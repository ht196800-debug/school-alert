// src/main.ts

case "/":
  return new Response("Version 2");

import { checkSchoolStatus } from "./school.ts";
import { sendLineMessage } from "./line.ts";

async function runCheck() {
  console.log("School Alert Check Started");

  try {
    const result = await checkSchoolStatus();

    if (result.notify) {
      await sendLineMessage(result.message);
      console.log("LINE通知送信完了");
    } else {
      console.log("通知不要");
    }

    return result;
  } catch (err) {
    console.error(err);

    await sendLineMessage(
      "⚠️ School Alert エラー\n\n" +
      String(err)
    );

    throw err;
  }
}

// ---------- HTTP ----------

Deno.serve(async (req) => {

  const url = new URL(req.url);

  switch (url.pathname) {

    case "/":
      return new Response("School Alert is running!");

    case "/notify":
      await sendLineMessage(
        "🚨 School Alert のテスト通知です！"
      );
      return new Response("LINE通知を送信しました。");

    case "/check":

      const result = await runCheck();

      return Response.json(result);

    default:

      return new Response("Not Found", {
        status:404
      });

  }

});


// ---------- Cron ----------

// 毎日6:00
Deno.cron(
  "School Alert 6AM",
  "0 6 * * *",
  async () => {

    console.log("6:00 Check");

    await runCheck();

  }
);

// 毎日8:00
Deno.cron(
  "School Alert 8AM",
  "0 8 * * *",
  async () => {

    console.log("8:00 Check");

    await runCheck();

  }
);

// 毎日10:00
Deno.cron(
  "School Alert 10AM",
  "0 10 * * *",
  async () => {

    console.log("10:00 Check");

    await runCheck();

  }
);
