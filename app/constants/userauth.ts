import bcrypt from "bcrypt"
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

import prisma from '@/prisma/client'

export const userAuth = CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'email', type: 'text' },
      password: { label: 'password', type: 'password' }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error('Invalid credentials');
      }

      const user = await prisma.user.findUnique({
        where: {
          email: credentials.email
        }
      });

      if (!user || !user?.hashedPassword) {
        throw new Error('Invalid credentials');
      }

      const isCorrectPassword = await bcrypt.compare(
        credentials.password,
        user.hashedPassword
      );

      if (!isCorrectPassword) {
        throw new Error('Invalid credentials');
      }

      return user;
    }
  })
  
  