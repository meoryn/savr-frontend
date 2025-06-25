import { defineStore } from 'pinia'
import type {User} from '~/interfaces/auth/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<User>();
  const jwt: Ref<string> = ref('');
  const refreshToken: Ref<string> = ref('');

  return { user, jwt, refreshToken }
}, {
    persist: true,
});

