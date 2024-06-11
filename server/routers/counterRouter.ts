import { z } from "zod";
import { authProcedure, publicProcedure, router } from "@server/router";

let count = 0;

export const counterRouter = router({
  getCount: publicProcedure.query(() => count),
  incrementCount: publicProcedure.mutation(() => (count = count + 1)),
  setCount: authProcedure
    .input(
      z.object({
        newCount: z.number().positive("Must be a positive number"),
      })
    )
    .mutation(({ input }) => {
      count = input.newCount;
      return count;
    }),
});
