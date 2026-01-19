export function getAuthHeaders() {
  const idToken = localStorage.getItem('idToken');
  
  if (!idToken) {
    throw new Error('No authentication token found. Please login again.');
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${idToken}`
  };
}