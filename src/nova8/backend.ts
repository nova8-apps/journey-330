/**
 * Nova8 AI Gateway - OpenAI proxy that bills in Nova8 credits
 *
 * This module provides access to OpenAI GPT-4 Vision via Nova8's built-in
 * AI gateway. No OPENAI_API_KEY required - bills against your Nova8 credit balance.
 *
 * Available in preview and production TestFlight builds.
 */

import Constants from 'expo-constants';

const API_BASE = String(
  (Constants?.expoConfig?.extra as any)?.apiBaseUrl ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  'https://nova8.dev'
).replace(/\/+$/, '');

const PROJECT_ID = Number(
  (Constants?.expoConfig?.extra as any)?.projectId ||
  process.env.EXPO_PUBLIC_PROJECT_ID ||
  0
);

const PROJECT_API_KEY = String(
  (Constants?.expoConfig?.extra as any)?.projectApiKey ||
  process.env.EXPO_PUBLIC_PROJECT_API_KEY ||
  ''
);

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{ type: 'text' | 'image_url'; text?: string; image_url?: { url: string } }>;
}

interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
}

interface ChatResponse {
  choices: Array<{
    message: {
      content: string | null;
    };
  }>;
}

/**
 * Call OpenAI Chat API via Nova8 AI Gateway
 */
async function chat(request: ChatRequest): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE}/api/app/${PROJECT_ID}/proxy/openai/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-nova8-project-key': PROJECT_API_KEY,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Nova8 AI Gateway error (${response.status}): ${errorText}`);
  }

  return response.json();
}

export const openai = {
  chat,
};
