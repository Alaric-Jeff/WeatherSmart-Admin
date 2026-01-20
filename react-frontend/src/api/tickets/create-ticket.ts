const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

export interface CreateTicketPayload {
  userId: string;
  description: string;
  issueType: string;
  notes?: string;
}

export async function createTicket(payload: CreateTicketPayload) {
  const body = {
    ...payload,
    notes: payload.notes ?? ''
  };

  const res = await fetch(`${API_URL}/tickets/create-ticket`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Unable to create ticket');
  }

  const data = await res.json();
  return data.data ?? data;
}
