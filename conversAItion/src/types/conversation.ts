import { ItemType, FormattedToolType } from '@openai/realtime-api-beta/dist/lib/client.js';

export interface ContentItem {
  type: string;
  text: string;
}

export interface FormattedItem {
  text?: string;
  transcript?: string;
  audio?: Int16Array;
  output?: string;
  tool?: FormattedToolType;
  file?: {
    url: string;
  };
}

// Base conversation item matching OpenAI's types
export interface BaseConversationItem {
  id: string;
  object: string;
  role: 'assistant' | 'user' | 'system';
  type: 'message' | 'function_call' | 'function_call_output';
  content?: Array<ContentItem> | string;
  formatted: FormattedItem;
  status?: 'completed' | 'in_progress' | 'failed';
  response?: string;
}

// Enhanced version with our custom fields
export interface EnhancedConversationItem extends BaseConversationItem {
  created_at: string;
  timestamp: number;
}

// Type guard to check if an item is an EnhancedConversationItem
export function isEnhancedConversationItem(item: any): item is EnhancedConversationItem {
  return item && typeof item.created_at === 'string' && typeof item.timestamp === 'number';
}
