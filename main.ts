const CHANNEL_ACCESS_TOKEN = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN");
const USER_ID = Deno.env.get("LINE_USER_ID");

if (!CHANNEL_ACCESS_TOKEN) {
  throw new Error("LINE_CHANNEL_ACCESS_TOKEN が設定されていません");
}

if (!USER_ID) {
  throw new Error("LINE_USER_ID が設定されていません");
}

Deno.serve(async (req) => {
  if (new URL(req.url).pathname === "/notify") {
    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: USER_ID,
        messages: [
          {
            type: "text",
            text: "🚨 School Alert のテスト通知です！",
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(error, { status: 500 });
    }

    return new Response("LINE通知を送信しました。");
  }

  return new Response("School Alert is running!");
});
