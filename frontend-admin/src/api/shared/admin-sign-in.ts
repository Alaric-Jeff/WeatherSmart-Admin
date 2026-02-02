
export async function adminSignIn(
    idToken: string
){
    try{
        const res = await fetch("http://localhost:3000/admin/signin", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({idToken})
        })

        const data = await res.json();

        if (!res.ok) {
            // Extract clean error message from response
            const errorMessage = data?.message || 'Authentication failed. Please try again.';
            throw new Error(errorMessage);
        }

        return data;

    }catch(err: unknown){
        // Clean up error message - remove technical details
        let errorMessage = 'Login failed. Please try again.';
        
        if (err instanceof Error) {
            // If it's already a clean message from our error handling, use it
            errorMessage = err.message;
        } else if (typeof err === 'string') {
            errorMessage = err;
        }

        throw new Error(errorMessage);
    }
}