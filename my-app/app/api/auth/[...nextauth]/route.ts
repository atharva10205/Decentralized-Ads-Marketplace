import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "../../../lib/prisma"

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt" as const,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }: any) {
      if (!profile?.email) return false

      await prisma.user.upsert({
        where: { email: profile.email },
        create: {
          name: profile.name ?? "",
          email: profile.email,
        },
        update: {
          name: profile.name ?? "",
        },
      })

      return true
    },
    async redirect() {
    return "/Role"
  },
  },
}
export const { handlers, auth } = NextAuth(authOptions)

export const GET = handlers.GET
export const POST = handlers.POST



