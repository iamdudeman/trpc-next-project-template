import { sql } from "@dao/db";
import { TRPCError } from "@trpc/server";

class UsersDao {
  public async selectUserByEmail(email: string) {
    const results = await sql<dbUser[]>`
      SELECT *
      FROM users
      WHERE email = ${email}
    `;

    if (!results.length) {
      throw new TRPCError({
        message: "No user with email",
        code: "NOT_FOUND",
      });
    }

    return results[0];
  }

  public async selectUserById(id: string) {
    const results = await sql<dbUser[]>`
      SELECT *
      FROM users
      WHERE id = ${id}
    `;

    if (!results.length) {
      throw new TRPCError({
        message: "No user with email",
        code: "NOT_FOUND",
      });
    }

    return results[0];
  }

  public async insertUser(email: string, passwordHash: string) {
    return sql`
      INSERT INTO users (email, password)
      VALUES (${email}, ${passwordHash})
    `;
  }

  public async setRefreshToken(id: string, refreshToken: string | null) {
    return sql`
      UPDATE users
      SET refresh_token = ${refreshToken}
      WHERE id = ${id}
    `;
  }
}

export const usersDao = new UsersDao();
