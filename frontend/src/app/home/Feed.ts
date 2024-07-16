export const getFeed = async (page:number) => {
    // Append query parameters directly to the URL
    const url = new URL("http://localhost:3000/api/blog/feed");
    url.searchParams.append("page", page.toString()); // Add query parameters here

    const response = await fetch(url.toString(), {
        method: 'GET',
        credentials: 'include'
    });
    
    return response;
}