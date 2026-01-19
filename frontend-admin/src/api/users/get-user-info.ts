export async function getUserInfo(userId: string) {
  try {
    console.log(`current user id: ${userId}`)
    const res = await fetch(`http://localhost:3000/users/get-user-info/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch user info: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    console.log(json.data);
    return json.data;
  } catch (err: unknown) {
    console.log(`Error occurred in getting user info:`, err);
    throw err;
  }
}
