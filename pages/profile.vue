<template>
    <UContainer class="p-5 flex flex-col gap-4">
        <h1 class="text-4xl font-bold text-center">Profil anpassen</h1>
        <h3 class="text-xl font-bold">Passwort ändern</h3>
        <UForm :schema="passwordSchema" :state="passwordState" class="flex flex-col gap-4" @submit="changePassword">
            <UFormField label="newPassword" name="newPassword">
                <UInput v-model="passwordState.newPassword" type="password" class="w-full"/>
            </UFormField>
            <UFormField label="repeatPassword" name="repeatPassword">
                <UInput v-model="passwordState.repeatPassword" type="password" class="w-full"/>
            </UFormField>

            <UButton type="submit"> Password ändern </UButton>
        </UForm>
        <hr>
        <UForm :schema="schema" :state="state" class="flex flex-col gap-4" @submit="adjustProfile">
            <UFormField label="Username" name="username">
                <UInput v-model="state.username" type="text" class="w-full" />
            </UFormField>
            <UFormField label="Firstname" name="first_name">
                <UInput v-model="state.firstName" type="text" class="w-full" />
            </UFormField>
            <UFormField label="Lastname" name="last_name">
                <UInput v-model="state.lastName" type="text" class="w-full" />
            </UFormField>

            <UButton type="submit"> Profil anpassen </UButton>
        </UForm>
    </UContainer>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod';

const store = useUserStore();
const toast = useToast();
const config = useRuntimeConfig();

const schema = z.object({
    username: z.string({
        required_error: 'Username is required',
    }),
    firstName: z.string({
        required_error: 'First name is required',
    }),
    lastName: z.string({
        required_error: 'Last name is required',
    }),
});

const passwordSchema = z.object({
    newPassword: z.string(),
    repeatPassword: z.string()
}).refine(data => data.newPassword == data.repeatPassword,
    'Passwords must match',
);

type pSchema = z.output<typeof passwordSchema>;


type Schema = z.output<typeof schema>;

    const {data: profile } = await useFetch(`${config.public.apiBaseUrl}/profile`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${store.jwt}`,
            'x-refresh-token': store.refreshToken,
        },
        body: {
            user_id: store.user?.id,
        }   
    });

const state = reactive<Partial<Schema>>({
    username: profile?.value.username,
    firstName: profile?.value.full_name?.split(' ')[0],
    lastName: profile?.value.full_name?.split(' ')[1],
});

const passwordState = reactive<Partial<pSchema>>({
    newPassword: '',
    repeatPassword: ''
});

const adjustProfile = async (event: FormSubmitEvent<Schema>) => {

    const resp = await $fetch(`${config.public.apiBaseUrl}/edit_profile`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${store.jwt}`,
            'x-refresh-token': store.refreshToken,
        },
        body: {
            user_id: store.user?.id,
            username: event.data.username,
            full_name: `${event.data.firstName} ${event.data.lastName}`,
            
        },
    });

    if (resp) {
        toast.add({
                title: 'Success',
                description: 'Updated profile successfully!',
                color: 'success', 
            })
    } else {
        toast.add({
                title: 'Error updating profile',
                description: resp as string,
                color: 'error', 
            })
    }
}

const changePassword = async (event: FormSubmitEvent<pSchema>) => {
   try {
     const resp = await $fetch(`${config.public.apiBaseUrl}/change_password`, {
        method: 'POST',
        headers: {
             Authorization: `Bearer ${store.jwt}`,
            'x-refresh-token': store.refreshToken,
        },
        body: {
            new_password: event.data.newPassword
        }
    });

    if(resp) {
          toast.add({
                title: 'Success',
                description: 'Updated password successfully!',
                color: 'success', 
            })
    }
   } catch (error) {
     toast.add({
                title: 'Error updating profile',
                description: error as string,
                color: 'error', 
            })
   }
}
 
</script>
