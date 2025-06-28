export const adjustTokens = (headers: Headers) => {
    const store = useUserStore();

    if(headers.get('jwt')) {
        store.jwt = headers.get('jwt') as string;
    }

    if(headers.get('new-x-refresh-token')) {
        store.refreshToken = headers.get('new-x-refresh-token') as string;
    }
}