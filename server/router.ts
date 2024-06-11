import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./createContext";
import { authService } from "@services/authService";
import cookie from "cookie";

const t = initTRPC.context<Context>().create();

const authMiddleware = t.middleware(async ({ next, ctx }) => {
  const cookies = cookie.parse(ctx.req.headers.cookie || "");
  const accessToken = cookies.at;

  if (!accessToken) {
    throw new TRPCError({
      message: "No access token cookie",
      code: "UNAUTHORIZED",
    });
  }

  const userId = authService.getUserIdFromToken(accessToken);

  if (!userId) {
    throw new TRPCError({
      message: "No user id in access token",
      code: "UNAUTHORIZED",
    });
  }

  const user = await authService.getUserById(userId);

  return next({
    ctx: {
      user,
    },
  });
});

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(authMiddleware);
