// src/main.ts

import { checkSchoolStatus } from "./school.ts";
import { sendLineMessage } from "./line.ts";

// --------------------
// 共通処理
// --------------------
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
      "⚠️ School Alert エラー\n\n" + String(err)
    );

    throw err;
  }
}

// --------------------
// HTTPサーバ
// --------------------
Deno.serve(async (req) => {
  const url = new URL(req.url);

  switch (url.pathname) {
    case "/":
      return new Response("version2");

    case "/notify":
      await sendLineMessage("🚨 School Alert のテスト通知です！");
      return new Response("LINE通知を送信しました。");

    case "/check":
      const result = await runCheck();
      return Response.json(result);

    default:
      return new Response("Not Found", { status: 404 });
  }
});

// --------------------
// Cron（自動実行）
// --------------------

// ※日本時間注意（UTC基準）
Deno.cron("morning-check-6", "0 21 * * *", async () => {
  await runCheck();
});

Deno.cron("morning-check-8", "0 23 * * *", async () => {
  await runCheck();
});

Deno.cron("morning-check-10", "0 1 * * *", async () => {
  await runCheck();
});
