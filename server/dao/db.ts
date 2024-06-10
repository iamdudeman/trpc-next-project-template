import postgres from "postgres";

const sql = postgres({
  max: 20,
});

export { sql };
