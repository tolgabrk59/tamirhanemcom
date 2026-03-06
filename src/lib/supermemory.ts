import Supermemory from 'supermemory';
import { createLogger } from './logger';

const supermemoryLogger = createLogger('SUPERMEMORY');

// Supermemory client singleton
let client: Supermemory | null = null;

export function getSupermemoryClient(): Supermemory {
  if (!client) {
    const apiKey = process.env.SUPERMEMORY_API_KEY;
    if (!apiKey) {
      throw new Error('SUPERMEMORY_API_KEY is not configured');
    }
    client = new Supermemory({ apiKey });
  }
  return client;
}

// Add a memory for a user
export async function addMemory(userId: string, content: string, metadata?: Record<string, string>) {
  const client = getSupermemoryClient();

  try {
    const response = await client.add({
      content,
      containerTags: [userId],
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'tamirhanem-chat',
        ...metadata,
      },
    });
    return response;
  } catch (error) {
    supermemoryLogger.error({ error, userId }, 'Supermemory add error');
    return null;
  }
}

// Search memories for a user
export async function searchMemories(userId: string, query: string, limit = 5) {
  const client = getSupermemoryClient();

  try {
    const response = await client.search.documents({
      q: query,
      containerTags: [userId],
      limit,
    });
    return response.results || [];
  } catch (error) {
    supermemoryLogger.error({ error, userId, query }, 'Supermemory search error');
    return [];
  }
}

// Get user context from memories
export async function getUserContext(userId: string, currentMessage: string): Promise<string> {
  const memories = await searchMemories(userId, currentMessage, 3);

  if (memories.length === 0) {
    return '';
  }

  const context = memories
    .map((m) => (m as { content?: string; text?: string }).content || (m as { content?: string; text?: string }).text)
    .filter(Boolean)
    .join('\n---\n');

  return context ? `\n\nKullanıcının önceki konuşmalarından ilgili bilgiler:\n${context}` : '';
}

// Save conversation to memory
export async function saveConversation(
  userId: string,
  userMessage: string,
  assistantResponse: string,
  vehicleInfo?: { brand?: string; model?: string; year?: number }
) {
  const content = `Kullanıcı: ${userMessage}\nAsistan: ${assistantResponse}`;

  const metadata: Record<string, string> = {};
  if (vehicleInfo?.brand) metadata.brand = vehicleInfo.brand;
  if (vehicleInfo?.model) metadata.model = vehicleInfo.model;
  if (vehicleInfo?.year) metadata.year = String(vehicleInfo.year);

  return addMemory(userId, content, metadata);
}
