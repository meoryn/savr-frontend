<template>
    <div
        class="flex flex-row justify-between p-5 border-b-2 border-gray-100 shadow"
    >
        <div>
            <NuxtLink to="/" class="text-2xl font-bold"> Savr </NuxtLink>
        </div>
        <div
            v-if="store.user && store.jwt"
            class="flex flex-row items-center gap-4"
        >
            <div class="flex flex-row gap-4">
                <NuxtLink
                    class="text-xl font-bold cursor-pointer hover:text-primary-400"
                    to="/dashboard"
                    >Dashboard</NuxtLink
                >
                <NuxtLink
                    class="text-xl font-bold cursor-pointer hover:text-primary-400"
                    to="/profile"
                    >Profile</NuxtLink
                >
                <NuxtLink
                    class="text-xl font-bold cursor-pointer hover:text-primary-400"
                    @click="logoutUser"
                    >Logout</NuxtLink
                >
                <ColorButton />
            </div>
        </div>
        <div v-else class="flex flex-row gap-4">
            <NuxtLink
                class="text-xl font-bold cursor-pointer hover:text-green-300"
                to="/login"
                >Login</NuxtLink
            >
            <NuxtLink
                class="text-xl font-bold cursor-pointer hover:text-green-300"
                to="/register"
                >Registrieren</NuxtLink
            >
            <ColorButton />
        </div>
    </div>
</template>

<script setup lang="ts">
const store = useUserStore();
const toast = useToast();

const logoutUser = async () => {

 
try {
    
    const data = await $fetch(
        `${useRuntimeConfig().public.apiBaseUrl}/logout`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${store.jwt}`,
                'x-refresh-token': store.refreshToken,
            },
        }
    );

    if (data) {
        store.user = undefined;
        store.jwt = '';
        store.refreshToken = '';
        navigateTo('/');
    }
} catch (error) {
      toast.add({
            title: 'Error Logging Out',
            description:
                error.error as string,
            color: 'error',
        });
}

   
};
</script>
