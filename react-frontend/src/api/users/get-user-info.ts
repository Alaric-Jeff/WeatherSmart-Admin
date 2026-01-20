const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

export async function getUserInfo(userId: string) {
  const res = await fetch(`${API_URL}/users/get-user-info/${userId}`);
  if (!res.ok) {
    throw new Error('Unable to load user info');
  }
  const data = await res.json();
  return data.data ?? data;
}