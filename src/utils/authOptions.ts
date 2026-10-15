import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    // for email login session handling
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // loginUser logic
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          },
        );

        const data = await res.json();

        // if login  success  (accessToken found), then return data.user
        if (res.ok && data.success && data.user) {
          return data.user;
        }
        return null;
      },
    }),
    // documentation: https://next-auth.js.org/providers/github
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // documentation: https://next-auth.js.org/providers/google
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }

      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/register`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: user.name,
                email: user.email,
                image: user.image,
                provider: account?.provider,
              }),
            },
          );
          return response.ok;
        } catch (error) {
          return false;
        }
      }
      return true;
    },
    // 2. Second: user data pass to Session- for navbar
    async jwt({ token, user }) {
      if (user) {
        // we set user object in token
        token.email = user.email;
        token.name = user.name;
        token.picture = (user as any).image;
        token.role = (user as any).role;
      }
      return token;
    },

    async session({ session, token }) {
      // data is send from token to session
      if (session.user) {
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  // to get user info I need to added NEXTAUTH_SECRET from .env file and this secret can be any string
};
