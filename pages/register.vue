<template>
    <UContainer class="flex flex-col items-center justify-center">
        <div class="border-2 border-gray-100 p-6 rounded-2xl shadow-lg w-128">
            <h2 class="text-4xl font-bold pt-2 pb-4 text-center">Register</h2>

            <UForm
                :schema="schema"
                :state="state"
                class="flex flex-col gap-4"
                @submit="loginUser"
            >
                <UFormField label="Email" name="email">
                    <UInput v-model="state.email" class="0 rounded-lg w-full" />
                </UFormField>
                <UFormField label="Password" name="password">
                    <UInput
                        v-model="state.password"
                        class="rounded-lg w-full"
                        type="password"
                    />
                </UFormField>
                <UFormField label="Repeat Password" name="repeatPassword">
                    <UInput
                        v-model="state.repeatPassword"
                        class="rounded-lg w-full"
                        type="password"
                    />
                </UFormField>

                <div>
                    <UButton
                        type="submit"
                        class="font-bold py-2 px-4 rounded-lg hover:bg-green-500"
                        >Register</UButton
                    >
                </div>
            </UForm>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
import { string, object, ref as YupRef, type InferType } from 'yup';
import type { FormSubmitEvent } from '@nuxt/ui';

const config = useRuntimeConfig();

const user = useSupabaseUser();

// if(localStorage.getItem('jwt')) {
//     navigateTo('/');
// }

const state = reactive({
    email: '',
    password: '',
    repeatPassword: '',
});
const supabase = useSupabaseClient();

const schema = object({
    email: string().email('Invalid email').required('Email is required'),
    password: string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    repeatPassword: string()
        .oneOf([YupRef('password')], 'Passwords must match')
        .required('Repeat Password is required'),
});

type Schema = InferType<typeof schema>;

const toast = useToast();

const loginUser = async (event: FormSubmitEvent<Schema>) => {
    // const { data, error } = await supabase.auth.signUp({
    //     email: event.data.email,
    //     password: event.data.password,
    // });

    const data = await $fetch(`${config.public.apiBaseUrl}/register`, {
        method: 'POST',
        body: {
            email: event.data.email,
            password: event.data.password,
        },
    });

    console.log(data);

    if (data) {
        console.log(data);
        localStorage.setItem('jwt', data.session.access_token);
        localStorage.setItem('refresh_token', data.session.refresh_token);

        toast.add({
            title: 'Success',
            description: 'User created successfully',
            color: 'success',
        });

        setTimeout(() => {
            navigateTo('/');
        }, 2000);
    }

    // if (error) {
    //     toast.add({
    //         title: 'Error',
    //         description: error.message,
    //         color: 'error',
    //     });
    // }

    // if (data) {
    //     toast.add({
    //         title: 'Success',
    //         description: 'User created successfully',
    //         color: 'success',
    //     });

    //     setTimeout(() => {
    //         navigateTo('/');
    //     }, 2000);
    // }
};
</script>
