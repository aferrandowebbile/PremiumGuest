type RequiredPublicEnv = "EXPO_PUBLIC_SUPABASE_URL" | "EXPO_PUBLIC_SUPABASE_ANON_KEY";

function getRequiredEnv(name: RequiredPublicEnv): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function getSupabaseKey(): string {
  return process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_KEY ?? "";
}

export const env = {
  supabaseUrl: getRequiredEnv("EXPO_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: getSupabaseKey() || getRequiredEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY"),
  tenantId: process.env.EXPO_PUBLIC_TENANT_ID ?? "1",
  mapboxToken: process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? ""
};
