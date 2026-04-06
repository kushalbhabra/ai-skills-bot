import { createAnthropic } from "@ai-sdk/anthropic";
import { createAzure } from "@ai-sdk/azure";
import { createOpenAI } from "@ai-sdk/openai";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

export function getConfiguredModel() {
  const githubToken = process.env.GITHUB_TOKEN;
  const githubEndpoint = process.env.GITHUB_MODELS_ENDPOINT || "https://models.github.ai/inference";
  const githubModel = process.env.GITHUB_MODEL || "openai/gpt-5";

  if (githubToken) {
    const githubModels = createOpenAI({
      apiKey: githubToken,
      baseURL: `${trimTrailingSlash(githubEndpoint)}/v1`,
    });
    return githubModels.chat(githubModel);
  }

  const azureApiKey = process.env.AZURE_OPENAI_API_KEY;
  const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT || "";
  const azureApiVersion = process.env.AZURE_OPENAI_API_VERSION;
  const azureModelName =
    process.env.AZURE_OPENAI_MODEL_DEPLOYMENT_NAME || process.env.MODEL_NAME || "gpt-4o-mini";

  if (azureApiKey && azureEndpoint) {
    const useOpenAICompatible = azureEndpoint.includes("models.github.ai");

    if (useOpenAICompatible) {
      const openaiCompatible = createOpenAI({
        apiKey: azureApiKey,
        baseURL: `${trimTrailingSlash(azureEndpoint)}/v1`,
      });
      return openaiCompatible.chat(azureModelName);
    }

    const azure = createAzure({
      apiKey: azureApiKey,
      baseURL: azureEndpoint,
      apiVersion: azureApiVersion,
    });
    return azure.chat(azureModelName);
  }

  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicApiKey) {
    const anthropic = createAnthropic({ apiKey: anthropicApiKey });
    return anthropic(process.env.ANTHROPIC_MODEL || "claude-haiku-4-5");
  }

  throw new Error(
    "No model configuration found. Set GITHUB_TOKEN, AZURE_OPENAI_* variables, or ANTHROPIC_API_KEY."
  );
}
