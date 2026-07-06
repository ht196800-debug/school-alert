// src/line.ts

const TOKEN = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN")!;
const USER_ID = Deno.env.get("LINE_USER_ID")!;

export async function sendLineMessage(message: string) {
  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`
    },
    body: JSON.stringify({
      to: USER_ID,
      messages: [
        {
          type: "text",
          text: message
        }
      ]
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error("LINE API Error: " + text);
  }
}
