// src/weather.ts

export interface AreaAlert {
  area: string;
  warning: boolean;
  warnings: string[];
}

export interface WeatherResult {
  updated: string;
  alerts: AreaAlert[];
}

/**
 * 気象庁JSON取得
 */
async function fetchWeatherData() {

  // ここは次回、本番URLへ変更します
  const url =
    "https://www.jma.go.jp/bosai/warning/data/warning/map.json";

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("気象庁データ取得失敗");
  }

  return await res.json();

}

/**
 * 対象地域
 */
const TARGETS = [

  "奈良県北西部",
  "奈良市西部",
  "大阪市",
  "東部大阪",
  "東大阪市",
  "京都府南部"

];

/**
 * 判定
 */
export async function getWeatherStatus(): Promise<WeatherResult> {

  const json = await fetchWeatherData();

  const result: WeatherResult = {

    updated: new Date().toLocaleString("ja-JP"),

    alerts: []

  };

  for (const area of TARGETS) {

    result.alerts.push({

      area,

      warning: false,

      warnings: []

    });

  }

  // 次回ここへ気象庁JSON解析を書く

  return result;

}
