import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref({});
  const jwt: Ref<string> = ref('');
  const refreshToken: Ref<string> = ref('');

  return { user, jwt, refreshToken }
}, {
    persist: true,
});

