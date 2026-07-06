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
      return new Response("version2");

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

Deno.cron(
  "School Alert 6AM",
  "0 6 * * *",
  async () => {
    await runCheck();
  }
);



Deno.cron(
  "School Alert 8AM",
  "0 8 * * *",
  async () => {
    await runCheck();
  }
);


Deno.cron(
  "School Alert 10AM",
  "0 10 * * *",
  async () => {
    await runCheck();
  }
);


