import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";

const credentialsSchema = z.object({
  login: z.string().min(1),
  password: z.string().min(1),
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        login: { label: "Login", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const admin = await prisma.admin.findUnique({
          where: { login: parsed.data.login },
        });

        if (!admin) {
          return null;
        }

        const valid = await compare(parsed.data.password, admin.passwordHash);
        if (!valid) {
          return null;
        }

        return {
          id: admin.id,
          name: admin.login,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.adminId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.adminId) {
        session.user.adminId = token.adminId;
        session.user.id = token.adminId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
