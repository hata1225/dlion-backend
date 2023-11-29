import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../utils/db";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      // ユーザーの検索または作成のロジックをここに記述
      const googleId = profile.id;
      let user = await prisma.user.findUnique({ where: { googleId } });

      if (!user) {
        user = await prisma.user.create({
          data: {
            googleId,
            email: profile?.emails ? profile.emails[0].value : "",
            name: profile.displayName,
          },
        });
      }

      done(null, user);
    }
  )
);

export default passport;
