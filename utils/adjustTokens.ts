export const adjustTokens = (headers: Headers) => {
    const store = useUserStore();
    
    console.log(headers.get('jwt'));

    if(headers.get('jwt')) {
        store.jwt = headers.get('jwt') as string;
    }

    console.log(headers.get('new-x-refresh-token'));

    if(headers.get('new-x-refresh-token')) {
        store.refreshToken = headers.get('new-x-refresh-token') as string;
    }
}