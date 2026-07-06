import { getWeatherStatus } from "./weather.ts";

export async function checkSchoolStatus() {
  const weather = await getWeatherStatus();

  const warnings = JSON.stringify(weather);

  const hasStorm =
    warnings.includes("暴風") ||
    warnings.includes("暴風雪") ||
    warnings.includes("特別警報");

  const hour = new Date().getHours();

  // 6時～8時
  if (hour >= 6 && hour < 8) {
    if (hasStorm) {
      return {
        notify: true,
        message: "🚨 6:00現在 暴風警報発令中\n本日は休校です。",
      };
    }
  }

  // 8時～10時
  if (hour >= 8 && hour < 10) {
    if (hasStorm) {
      return {
        notify: true,
        message: "🚨 8:00現在 暴風警報継続中\n午前休校です。",
      };
    }
  }

  // 10時以降
  if (hour >= 10) {
    if (!hasStorm) {
      return {
        notify: true,
        message: "✅ 10:00現在 警報解除\n3時間目から登校してください。",
      };
    }
  }

  return {
    notify: false,
    message: "通常通りです",
  };
}
