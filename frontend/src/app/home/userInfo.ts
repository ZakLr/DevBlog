export const getUserInfo = async () => { 
    //delete every accessTokens from local storage
    
    const res = await fetch('http://localhost:3000/api/user/get',
        {
            credentials: 'include'
        }
    );
    const data = await res.json();
    
}

