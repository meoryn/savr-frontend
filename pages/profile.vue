<template>
    <UContainer class="p-5 flex flex-col gap-4">
        <h1 class="text-4xl font-bold text-center">Profil anpassen</h1>
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
import type { Database } from '~/types/supabase';
import type { FormSubmitEvent } from '@nuxt/ui'
import * as z from 'zod';

const user = useSupabaseUser();
const supabase = useSupabaseClient<Database>();
const toast = useToast();

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


type Schema = z.output<typeof schema>;

const { data: profile } = await supabase
    .from('profile')
    .select('*')
    .eq('id', user!.value!.id)
    .single();


const state = reactive<Partial<Schema>>({
    username: profile?.username || '',
    firstName: profile?.full_name?.split(' ')[0] || '',
    lastName: profile?.full_name?.split(' ')[1] || '',
});

const adjustProfile = async (event: FormSubmitEvent<Schema>) => {
    console.log('event', event.data);
    const resp = await supabase
        .from('profile')
        .update({
            username: event.data.username,
            full_name: `${event.data.firstName} ${event.data.lastName}`,
        })
        .eq('id', user!.value!.id)

    if (resp.error) {
        toast.add({
                title: 'Error updating profile',
                description: resp.error.message,
                color: 'error', 
            })
    } else {
        toast.add({
                title: 'Success',
                description: 'Updated profile successfully!',
                color: 'success', 
            })
    }
}
 
</script>
