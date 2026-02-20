const requiredPublicEnv = ["EXPO_PUBLIC_SUPABASE_URL", "EXPO_PUBLIC_SUPABASE_ANON_KEY"] as const;

function getRequiredEnv(name: (typeof requiredPublicEnv)[number]): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  supabaseUrl: getRequiredEnv("EXPO_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: getRequiredEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY"),
  tenantId: process.env.EXPO_PUBLIC_TENANT_ID ?? "1"
};
