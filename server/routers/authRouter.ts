import { z } from "zod";
import { authService } from "@services/AuthService";
import { authProcedure, publicProcedure, router } from "@router";
import cookie from "cookie";
import * as process from "process";

export const authRouter = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;
      const tokens = await authService.loginUser(email, password);

      ctx.res.setHeader("Set-Cookie", buildSetTokenCookies(tokens.accessToken, tokens.refreshToken));
    }),
  logout: authProcedure.mutation(async ({ ctx }) => {
    await authService.logoutUser(ctx.user.id);

    ctx.res.setHeader("Set-Cookie", buildClearTokenCookies());
  }),
  register: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { email, password } = input;

      await authService.registerUser(email, password);
    }),
  refresh: publicProcedure.mutation(async ({ ctx }) => {
    const cookies = cookie.parse(ctx.req.headers.cookie || "");
    const tokens = await authService.refresh(cookies.rt);

    ctx.res.setHeader("Set-Cookie", buildSetTokenCookies(tokens.accessToken, tokens.refreshToken));
  }),
});

function buildSetTokenCookies(accessToken: string, refreshToken: string) {
  const accessTokenCookie = cookie.serialize("at", accessToken, {
    httpOnly: true,
    path: "/api/trpc",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production",
  });
  const refreshTokenCookie = cookie.serialize("rt", refreshToken, {
    httpOnly: true,
    path: "/api/trpc/auth.refresh",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production",
  });

  return [accessTokenCookie, refreshTokenCookie];
}

function buildClearTokenCookies() {
  const accessTokenCookie = cookie.serialize("at", "", {
    httpOnly: true,
    path: "/api/trpc",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production",
  });
  const refreshTokenCookie = cookie.serialize("rt", "", {
    httpOnly: true,
    path: "/api/trpc/auth.refresh",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production",
  });

  return [accessTokenCookie, refreshTokenCookie];
}
