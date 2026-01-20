
export async function adminSignIn(
    idToken: string
){
    try{
        const res = await fetch("http://localhost:4000/api/auth/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({idToken})
        })

        return await res.json();

    }catch(err: unknown){
        console.log(`error occured in sign-in, error: ${err}`);
        throw err
    }
}