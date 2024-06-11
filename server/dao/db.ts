import postgres from "postgres";

export const sql = postgres({
  max: 20,
});
