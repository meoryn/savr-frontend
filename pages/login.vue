<template>
    <UContainer class="flex flex-col items-center justify-center">
        <div
            class="border-2 border-gray-100 p-6 rounded-2xl shadow-lg w-128"
        >
            <h2 class="text-4xl font-bold pt-2 pb-4 text-center">Login</h2>

            <UForm
                :state="state"
                class="flex flex-col gap-4"
                @submit="loginUser"
            >
                <UFormField label="Email" name="email">
                    <UInput
                        v-model="state.email"
                        class="rounded-lg w-full"
                    />
                </UFormField>
                <UFormField label="Password" name="password">
                    <UInput
                        v-model="state.password"
                        class="rounded-lg w-full"
                        type="password"
                    />
                </UFormField>

                <div>
                    <UButton
                        type="submit"
                        >Login</UButton
                    >
                </div>
            </UForm>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
const user = useSupabaseUser();

if(user.value) {
    navigateTo('/');
}

const state = reactive({
    email: '',
    password: '',
});

const supabase = useSupabaseClient();

const toast = useToast();

const loginUser = async () => {

        console.log(state.email, state.password);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: state.email,
            password: state.password,
        });
        if (error) {
            toast.add({
                title: 'Error',
                description: error.message,
                color: 'error', 
            })
        }

        if (data.user) {
            toast.add({
                title: 'Success',
                description: 'Login successful',
                color: 'success', 
            })
            navigateTo('/');
        }
    }
</script>
