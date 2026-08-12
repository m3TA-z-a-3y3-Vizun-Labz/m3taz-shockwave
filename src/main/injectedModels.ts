// Models ahead of the pinned pi-ai catalog. Merged into agent:listModels and
// registered at session boot when getModel() has no entry yet.

export type InjectedModelDef = {
  id: string;
  name: string;
  api: 'openai-completions';
  provider: string;
  baseUrl: string;
  compat?: Record<string, unknown>;
  reasoning: boolean;
  input: Array<'text' | 'image'>;
  cost: { input: number; output: number; cacheRead: number; cacheWrite: number };
  contextWindow: number;
  maxTokens: number;
};

const ZAI_CODING_BASE = 'https://api.z.ai/api/coding/paas/v4';
const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';

const ZAI_GLM_5_2: InjectedModelDef = {
  id: 'glm-5.2',
  name: 'GLM-5.2',
  api: 'openai-completions',
  provider: 'zai',
  baseUrl: ZAI_CODING_BASE,
  compat: { supportsDeveloperRole: false, thinkingFormat: 'zai', zaiToolStream: true },
  reasoning: true,
  input: ['text'],
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  contextWindow: 1_048_576,
  maxTokens: 131_072,
};

const OPENROUTER_ZAI_GLM_5_2: InjectedModelDef = {
  id: 'z-ai/glm-5.2',
  name: 'Z.ai: GLM 5.2',
  api: 'openai-completions',
  provider: 'openrouter',
  baseUrl: OPENROUTER_BASE,
  reasoning: true,
  input: ['text'],
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  contextWindow: 1_048_576,
  maxTokens: 131_072,
};

/** provider slug → injected model defs (not yet in the pinned pi-ai build). */
export const INJECTED_MODELS: Record<string, InjectedModelDef[]> = {
  zai: [ZAI_GLM_5_2],
  openrouter: [OPENROUTER_ZAI_GLM_5_2],
};

export function injectedModelIds(provider: string): string[] {
  return (INJECTED_MODELS[provider] ?? []).map((m) => m.id);
}

export function findInjectedModel(provider: string, modelId: string): InjectedModelDef | undefined {
  return (INJECTED_MODELS[provider] ?? []).find((m) => m.id === modelId);
}
