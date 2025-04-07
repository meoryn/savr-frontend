export const useLoggedInUser = (user = null) => {
    return useState('user', () => user);
};
