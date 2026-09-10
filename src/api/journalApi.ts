import client from './client';
import type { JournalEntry, JournalEntryInput } from '@/types/journal';

function extractArray(data: unknown): JournalEntry[] {
  if (Array.isArray(data)) return data as JournalEntry[];
  if (data && typeof data === 'object' && Array.isArray((data as Record<string, unknown>).journalEntries)) {
    return (data as Record<string, unknown>).journalEntries as JournalEntry[];
  }
  return [];
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const res = await client.get('/journal');
  return extractArray(res.data);
}

export async function getJournalEntry(id: string): Promise<JournalEntry> {
  const res = await client.get(`/journal/id/${id}`);
  return res.data;
}

export async function createJournalEntry(data: JournalEntryInput): Promise<JournalEntry> {
  const res = await client.post('/journal', data);
  return res.data;
}

export async function updateJournalEntry(id: string, data: Partial<JournalEntryInput>): Promise<JournalEntry> {
  const res = await client.put(`/journal/id/${id}`, data);
  return res.data;
}

export async function deleteJournalEntry(id: string): Promise<void> {
  await client.delete(`/journal/id/${id}`);
}
