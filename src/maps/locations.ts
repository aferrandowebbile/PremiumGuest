export type DestinationMapPreset = {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
};

const DEFAULT_PRESET: DestinationMapPreset = {
  center: [-106.82, 39.19],
  zoom: 11.8,
  pitch: 58,
  bearing: -22
};

const PRESETS_BY_TENANT_ID: Record<string, DestinationMapPreset> = {
  "1": { center: [-106.95, 39.21], zoom: 12.2, pitch: 62, bearing: -18 }, // Aspen Snowmass
  "2": { center: [-106.37, 39.64], zoom: 12.6, pitch: 60, bearing: -25 }, // Vail
  "3": { center: [-122.95, 50.11], zoom: 12.1, pitch: 58, bearing: -15 }, // Whistler
  "4": { center: [-117.9189, 33.8121], zoom: 15.1, pitch: 57, bearing: -28 }, // Disneyland
  "5": { center: [-118.3534, 34.1381], zoom: 15.3, pitch: 60, bearing: -12 }, // Universal Studios
  "6": { center: [-118.5981, 34.4253], zoom: 14.9, pitch: 58, bearing: -30 } // Six Flags Magic Mountain
};

const PRESETS_BY_NAME_KEY: Record<string, DestinationMapPreset> = {
  snowmass: PRESETS_BY_TENANT_ID["1"],
  aspen: PRESETS_BY_TENANT_ID["1"],
  vail: PRESETS_BY_TENANT_ID["2"],
  whistler: PRESETS_BY_TENANT_ID["3"],
  disneyland: PRESETS_BY_TENANT_ID["4"],
  universal: PRESETS_BY_TENANT_ID["5"],
  "six flags": PRESETS_BY_TENANT_ID["6"]
};

export function resolveDestinationPreset(tenantId: string, destinationName?: string): DestinationMapPreset {
  const byTenant = PRESETS_BY_TENANT_ID[tenantId];
  if (byTenant) return byTenant;

  const normalized = (destinationName ?? "").toLowerCase();
  const byName = Object.entries(PRESETS_BY_NAME_KEY).find(([key]) => normalized.includes(key))?.[1];
  return byName ?? DEFAULT_PRESET;
}
