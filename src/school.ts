// src/school.ts

import { getWeatherStatus } from "./weather.ts";

export async function checkSchoolStatus() {
  const weather = await getWeatherStatus();

  // 例：警報があるかどうかチェック（仮ロジック）
  const warnings = JSON.stringify(weather);

  const hasWarning =
    warnings.includes("暴風") ||
    warnings.includes("大雨") ||
    warnings.includes("特別警報");

  if (hasWarning) {
    return {
      notify: true,
      message: "🚨 本日は警報の可能性があるため休校の可能性があります",
    };
  }

  return {
    notify: false,
    message: "通常通りです",
  };
}
