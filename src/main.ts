// src/main.ts

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

    await sendLineMessage("⚠️ School Alert エラー\n\n" + String(err));
    throw err;
  }
}

// --------------------
// HTTP Server
// --------------------

Deno.serve(async (req) => {
  const url = new URL(req.url);

  switch (url.pathname) {
    case "/":
      return new Response("School Alert v1");

    case "/check":
      return Response.json(await runCheck());

    case "/notify":
      await sendLineMessage("🚨 テスト通知（School Alert）");
      return new Response("OK");

    default:
      return new Response("Not Found", { status: 404 });
  }
});

// --------------------
// Cron（UTC注意）
// JST対応済み
// --------------------

// 6:00 JST → 21:00 UTC
Deno.cron("check-6", "0 21 * * *", runCheck);

// 8:00 JST → 23:00 UTC
Deno.cron("check-8", "0 23 * * *", runCheck);

// 10:00 JST → 01:00 UTC
Deno.cron("check-10", "0 1 * * *", runCheck);
