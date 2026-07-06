// src/school.ts

import { getWeatherAlerts } from "./rules.ts";

export async function checkSchoolStatus() {
  const alerts = await getWeatherAlerts();

  const now = new Date();
  const hour = now.getHours();

  const has = (list: string[]) =>
    alerts.some((a) => list.some((l) => a.includes(l)));

  // -------------------------
  // Aルール（最優先）
  // -------------------------
  if (has([
    "暴風警報",
    "暴風雪警報",
    "大雪警報",
    "波浪警報",
    "特別警報",
    "レベル4"
  ])) {
    return buildResult("Aルール", hour);
  }

  // -------------------------
  // Bルール
  // -------------------------
  if (has(["大雨警報", "氾濫警報", "レベル3"])) {
    return buildResult("Bルール", hour);
  }

  return {
    notify: false,
    message: "🏫 帝塚山中学校\n\n現在、警報はありません。通常登校です。"
  };
}

// -------------------------
// 判定結果生成
// -------------------------
function buildResult(rule: string, hour: number) {
  let message = `🏫 帝塚山中学校\n\n【${hour}時時点】\n\n`;

  if (hour < 6) {
    message += "自宅待機（早朝判定）";
  } else if (hour < 8) {
    message += "3限目から登校";
  } else if (hour < 10) {
    message += "5限目から登校";
  } else {
    message += "終日休校";
  }

  return {
    notify: true,
    message: message + `\n\n判定：${rule}`
  };
}
