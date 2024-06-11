import { router } from "@server/router";
import { counterRouter } from "@server/routers/counterRouter";
import { authRouter } from "@server/routers/authRouter";

export const appRouter = router({
  auth: authRouter,
  counter: counterRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
