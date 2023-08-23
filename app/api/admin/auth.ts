import bcrypt from "bcrypt"
import NextAuth, { AuthOptions, getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"


import prisma from '@/prisma/client'
import { adminAuth } from "@/app/constants/adminauth"
import { userAuth } from "@/app/constants/userauth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    adminAuth,
    userAuth,
  ], 
  callbacks:{
    async session({token, session}){
      if (token){
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.role = token.role 
        session.user.ustate = token.ustate
      }
      return session
    },
    async jwt ({token, user}){
      const dbUser = await prisma.user.findFirst({
        where:{
          email: token.email
        }
      })
      if(!dbUser){
        token.id = user!.id
        return token 
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        ustate: dbUser.ustate,
      }
    }
  },
  pages: {
    signIn: '/',
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions);

