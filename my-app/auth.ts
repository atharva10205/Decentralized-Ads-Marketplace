import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async jwt({ token }) {
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | null
        session.user.id = token.userId as string
        session.user.image = token.picture as string
      }
      return session
    },
  },
})