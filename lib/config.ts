// Configuration centralisée — secrets uniquement via variables d'environnement.

export const config = {
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
  modelVolume: process.env.BALIA_MODEL_VOLUME ?? "claude-sonnet-5",
  modelComplex: process.env.BALIA_MODEL_COMPLEX ?? "claude-opus-4-8",
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID ?? "",
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN ?? "",
  twilioFromNumber: process.env.TWILIO_FROM_NUMBER ?? "",
};

export const hasClaude = (): boolean => config.anthropicApiKey.length > 0;
export const hasSupabase = (): boolean =>
  config.supabaseUrl.length > 0 && config.supabaseServiceRoleKey.length > 0;
export const hasTwilio = (): boolean =>
  config.twilioAccountSid.length > 0 && config.twilioAuthToken.length > 0;
