// pages/auth/signin.js
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={() => signIn("kakao")}>Sign in with Kakao</button>
    </div>
  );
}
