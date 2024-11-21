import { Role } from '@11labs/react';

export interface Message {
  text: string;
  role: Role;
  timestamp: number;
  created_at: string;
  final?: boolean;
  id?: string;
}

export function isMessage(item: any): item is Message {
  return item && 
    typeof item.text === 'string' && 
    typeof item.role === 'string' &&
    typeof item.timestamp === 'number' &&
    typeof item.created_at === 'string';
}
