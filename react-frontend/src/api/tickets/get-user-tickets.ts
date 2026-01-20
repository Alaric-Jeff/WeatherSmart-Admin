const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

export interface Ticket {
  ticketId: string;
  userName: string;
  userEmail: string;
  description: string;
  issueType: string;
  notes: string;
  status: 'Open' | 'In-Progress' | 'Resolved';
  createdDate: string;
  updatedAt: string | null;
}

export async function getUserTickets(userId: string): Promise<Ticket[]> {
  const res = await fetch(`${API_URL}/tickets/get-tickets`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Unable to fetch tickets');
  }

  const data = await res.json();
  const allTickets = data.data ?? [];
  
  // Filter tickets by userId on the client side
  // The backend stores userId field in the ticket document
  return allTickets.filter((ticket: any) => {
    return ticket.userId === userId;
  });
}
