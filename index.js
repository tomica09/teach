const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const qs = require("querystring");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public")); // 프론트엔드 파일 제공

const clientId = "3c369511c330c46e537f90deaf76efdb";
const redirectUri = "http://localhost:3000/oauth/callback";
let accessToken = ""; // 사용자 인증 후 발급받은 액세스 토큰을 저장

// 카카오 로그인 페이지로 리다이렉트
app.get("/login", (req, res) => {
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
  res.redirect(kakaoAuthUrl);
});

// 카카오 인증 후 콜백을 받는 라우트
app.get("/oauth/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const tokenResponse = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      qs.stringify({
        grant_type: "authorization_code",
        client_id: clientId,
        redirect_uri: redirectUri,
        code: code,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    accessToken = tokenResponse.data.access_token;
    res.redirect("/send-message.html"); // 메시지 전송 페이지로 리다이렉트
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to get access token");
  }
});

// 카카오톡 메시지 보내기
app.post("/send-message", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://kapi.kakao.com/v2/api/talk/memo/default/send",
      {
        template_object: {
          object_type: "text",
          text: message,
          link: {
            web_url: "http://localhost:3000",
            mobile_web_url: "http://localhost:3000",
          },
          button_title: "바로 확인",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json({ status: "Message sent successfully via KakaoTalk" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Failed to send message" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
