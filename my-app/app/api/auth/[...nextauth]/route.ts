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
          image: profile.picture ?? "",
        },
        update: {
          name: profile.name ?? "",
          image: profile.picture ?? "",
        },
      })

      return true
    },
    async jwt({ token }) {

      if (token.email) {

        const user = await prisma.user.findUnique({
          where: {
            email: token.email
          },
          select: {
            id: true,
            role: true,
            image: true,  
          }
        })

        if (user) {
          token.role = user.role
          token.userId = user.id
           token.picture = user.image 
        }
        return token
      }
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | null
        session.user.id = token.userId as string
         session.user.image = token.picture as string 
      }
      return session
    },
    async redirect() {
      return "/Role"
    },
  },
  async redirect({ url, baseUrl }) {
    if (url === baseUrl) {
      return "/Role"
    }

    if (url.startsWith("/")) return `${baseUrl}${url}`

    if (new URL(url).origin === baseUrl) return url
    return baseUrl
  }
}
export const { handlers, auth } = NextAuth(authOptions)

export const GET = handlers.GET
export const POST = handlers.POST