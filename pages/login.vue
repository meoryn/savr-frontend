<template>
    <UContainer class="flex flex-col items-center justify-center">
        <div class="border-2 border-gray-100 p-6 rounded-2xl shadow-lg w-128">
            <h2 class="text-4xl font-bold pt-2 pb-4 text-center">Login</h2>

            <UForm
                :state="state"
                class="flex flex-col gap-4"
                @submit="loginUser"
            >
                <UFormField label="Email" name="email">
                    <UInput v-model="state.email" class="rounded-lg w-full" />
                </UFormField>
                <UFormField label="Password" name="password">
                    <UInput
                        v-model="state.password"
                        class="rounded-lg w-full"
                        type="password"
                    />
                </UFormField>

                <div>
                    <UButton type="submit">Login</UButton>
                </div>
            </UForm>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
import type { AuthenticatedUser } from '~/interfaces/auth/authenticatedUser.ts';

const store = useUserStore();

const config = useRuntimeConfig();

if (store.user && store.jwt) {
    navigateTo('/');
}

const state = reactive({
    email: '',
    password: '',
});

const toast = useToast();

const loginUser = async () => {
    try {
        const data = await $fetch<AuthenticatedUser>(`${config.public.apiBaseUrl}/login`, {
            method: 'POST',
            body: {
                email: state.email,
                password: state.password,
            },
        });

        if (data) {
            console.log(data);
            store.user = data.user;
            store.jwt = data.session.access_token;
            store.refreshToken = data.session.refresh_token;

            toast.add({
                title: 'Success',
                description: 'Login successful',
                color: 'success',
            });
            navigateTo('/');
        }
    } catch (error) {
        toast.add({
            title: 'Error',
            description: error.error || 'Problem occured while logging in. Please check your credentials.',
            color: 'error',
        });
    }
};
</script>
