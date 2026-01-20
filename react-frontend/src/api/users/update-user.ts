const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

export async function updateUser(userId: string, payload: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/users/update-user/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Unable to update user');
  }

  const data = await res.json();
  return data.data ?? data;
}