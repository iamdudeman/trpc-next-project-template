import { usersDao } from "@server/dao/UsersDao";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as process from "process";
import { TRPCError } from "@trpc/server";

const saltRounds = 10;
const ONE_MINUTE = 60 * 1000;
const accessTokenLife = 30 * ONE_MINUTE; // half hour
const refreshTokenLife = 10080 * ONE_MINUTE; // one week

class AuthService {
  public async registerUser(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await usersDao.insertUser(email, hashedPassword);
  }

  public async loginUser(email: string, password: string) {
    const user = await usersDao.selectUserByEmail(email);
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      // todo temporary wording for debugging
      throw new TRPCError({
        message: "Password incorrect",
        code: "BAD_REQUEST",
      });
    }

    const tokens = generateTokens(user.id);

    await usersDao.setRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  public async refresh(refreshToken: string) {
    const userId = this.getUserIdFromToken(refreshToken);
    const user = await usersDao.selectUserById(userId);

    if (refreshToken !== user.refresh_token) {
      await usersDao.setRefreshToken(user.id, null);
      // todo temporary wording for debugging
      throw new TRPCError({
        message: "Don't use an old refresh token",
        code: "FORBIDDEN",
      });
    }

    const tokens = generateTokens(userId);

    await usersDao.setRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  public async logoutUser(id: string) {
    await usersDao.setRefreshToken(id, null);
  }

  public getUserById(id: string) {
    return usersDao.selectUserById(id);
  }

  public getUserIdFromToken(token: string): string {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return (decoded as jwt.JwtPayload).id;
  }
}

export const authService = new AuthService();

function generateTokens(userId: string) {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: accessTokenLife,
  });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: refreshTokenLife,
  });

  return {
    accessToken,
    refreshToken,
  };
}
