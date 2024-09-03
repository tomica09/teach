// pages/_error.js
import { useRouter } from "next/router";

export default function Error({ statusCode }) {
  const router = useRouter();

  return (
    <div>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : "An error occurred on client"}
      <button onClick={() => router.push("/")}>Go to Homepage</button>
    </div>
  );
}
