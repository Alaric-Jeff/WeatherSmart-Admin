import fs from 'fs';
import path from 'path';

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  type: string;
  message: string;
  created_at: string;
}

const dataDir = path.resolve(process.cwd(), 'data');
const filePath = path.join(dataDir, 'inquiries.json');

export function initStorage() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([]), 'utf-8');
}

function readAll(): Inquiry[] {
  const raw = fs.readFileSync(filePath, 'utf-8');
  try {
    return JSON.parse(raw) as Inquiry[];
  } catch {
    return [];
  }
}

function writeAll(items: Inquiry[]) {
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf-8');
}

export function addInquiry(input: Omit<Inquiry, 'id' | 'created_at'>): Inquiry {
  const items = readAll();
  const now = new Date().toISOString();
  const id = items.length ? items[items.length - 1].id + 1 : 1;
  const record: Inquiry = { id, created_at: now, ...input };
  items.push(record);
  writeAll(items);
  return record;
}

export function listInquiries(): Inquiry[] {
  return readAll().sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}
