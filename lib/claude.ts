import Anthropic from "@anthropic-ai/sdk";
import { config, hasClaude } from "@/lib/config";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: config.anthropicApiKey });
  }
  return client;
}

/**
 * Appel agent : une requête, une sortie JSON contrainte par schéma
 * (structured outputs). Lance une erreur explicite si l'appel échoue —
 * chaque appelant décide de son fallback.
 */
export async function callAgentJson<T>(options: {
  system: string;
  prompt: string;
  schema: Record<string, unknown>;
  model?: string;
}): Promise<T> {
  if (!hasClaude()) {
    throw new Error("ANTHROPIC_API_KEY absente — mode démo attendu en amont");
  }
  const response = await getClient().messages.create({
    model: options.model ?? config.modelVolume,
    max_tokens: 2048,
    system: options.system,
    output_config: {
      format: { type: "json_schema", schema: options.schema },
    },
    messages: [{ role: "user", content: options.prompt }],
  });
  if (response.stop_reason === "refusal") {
    throw new Error("Le modèle a refusé la requête");
  }
  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") {
    throw new Error("Réponse du modèle sans bloc texte");
  }
  return JSON.parse(text.text) as T;
}
