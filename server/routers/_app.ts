import { router } from "@router";
import { counterRouter } from "@routers/counterRouter";
import { authRouter } from "@routers/authRouter";

export const appRouter = router({
  auth: authRouter,
  counter: counterRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
