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
        console.log(credentials);

        return null;
      },
    }),
  ],
});

export const handlers = nextAuth.handlers;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;
export const auth: typeof nextAuth.auth = nextAuth.auth;
