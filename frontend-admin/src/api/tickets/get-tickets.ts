import { getAuthHeaders } from "../shared/get-auth-headers";

export async function getTickets() {
  try {
    const res = await fetch("http://localhost:3000/tickets/get-tickets", {
      method: "GET",
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch tickets: ${res.status} ${errorText}`);
    }

    const json = await res.json();

    return (json.data ?? []).map((ticket: any) => ({
      id: ticket.id,
      userId: ticket.userId,
      userName: ticket.userName,
      email: ticket.email,
      description: ticket.description,
      issueType: ticket.issueType,
      notes: ticket.notes,
      status: ticket.status,
      createdAt: ticket.createdAt
        ? new Date(ticket.createdAt)
        : null,
      updatedAt: ticket.updatedAt
        ? new Date(ticket.updatedAt)
        : null
    }));
  } catch (err: unknown) {
    console.error("Error occurred in fetching tickets api:", err);
    throw err;
  }
}
