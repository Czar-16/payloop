import { db } from "db";
import { z } from "zod";
import argon2 from "argon2";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const nextAuth = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {
        identifier: {},
        password: {},
      },

      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            identifier: z.string().min(3),
            password: z.string().min(3),
          })
          .safeParse(credentials);
        if (!parsedCredentials) {
          return null;
        }
        const { identifier, password }: any = parsedCredentials.data;
        const user = await db.user.findFirst({
          where: {
            OR: [{ email: identifier }, { phone: identifier }],
          },
        });
        if (!user) {
          return null;
        }

        const passwordValid = await argon2.verify(user.password, password);
        if (!passwordValid) {
          return null;
        }
        console.log(identifier, password);

        console.log(db);
        // console.log(credentials);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
});

export const handlers = nextAuth.handlers;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;
export const auth: typeof nextAuth.auth = nextAuth.auth;
