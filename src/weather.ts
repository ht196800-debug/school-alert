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

async function fetchWeatherData() {
  const url =
    "https://www.jma.go.jp/bosai/warning/data/warning/map.json";

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("気象庁データ取得失敗");
  }

  return await res.json();
}

const TARGETS = [
  "奈良県北西部",
  "奈良市",
  "大阪市",
  "東部大阪",
  "東大阪市",
  "京都府南部"
];

export async function getWeatherStatus(): Promise<WeatherResult> {
  const json = await fetchWeatherData();

  const result: WeatherResult = {
    updated: new Date().toLocaleString("ja-JP"),
    alerts: []
  };

  // map.jsonの構造は「地域コードベース」なので全走査
  const areas = json.areaTypes ?? [];

  for (const target of TARGETS) {
    let warning = false;
    const warnings: string[] = [];

    for (const areaType of areas) {
      const areaList = areaType.areas ?? [];

      for (const area of areaList) {
        const name = area.name ?? "";

        // 部分一致で地域判定
        if (name.includes(target)) {
          const w = area.warning || [];

          if (Array.isArray(w) && w.length > 0) {
            warning = true;
            warnings.push(...w);
          }
        }
      }
    }

    result.alerts.push({
      area: target,
      warning,
      warnings
    });
  }

  return result;
}
