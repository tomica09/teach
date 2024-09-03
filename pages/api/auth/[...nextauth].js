// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";

export default NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
});
