export async function getWeatherAlerts(): Promise<string[]> {
  // 気象庁（大阪・奈良周辺の例）
  const url =
    "https://www.jma.go.jp/bosai/warning/data/warning/270000.json";

  const res = await fetch(url);
  const data = await res.json();

  const areas: string[] = [];

  for (const item of data.areaTypes ?? []) {
    for (const area of item.areas ?? []) {
      if (area.warnings) {
        for (const w of area.warnings) {
          areas.push(w.name);
        }
      }
    }
  }

  return areas;
}
