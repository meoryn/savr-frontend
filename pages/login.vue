<template>
    <UContainer class="flex flex-col items-center justify-center">
        <div class="border-2 border-gray-100 p-6 mt-32 rounded-2xl shadow-lg w-128">
            <h2 class="text-4xl font-bold pt-2 pb-4 text-center">Login</h2>

            <UForm
                :state="state"
                class="flex flex-col gap-4"

                @submit="loginUser"
            >
                <UFormField label="Email" name="email">
                    <UInput
                        v-model="state.email"
                        class="border-2 border-gray-100 rounded-lg w-full"
                    />
                </UFormField>
                <UFormField label="Password" name="password">
                    <UInput
                        v-model="state.password"
                        class="border-2 border-gray-100 rounded-lg w-full"
                    />
                </UFormField>

                <div>
                    <UButton
                    type="submit"
                    class="bg-green-400 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-500"
                    >Login</UButton
                >
                </div>
            </UForm>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
const state = reactive({
    email: '',
    password: '',
});

const loginUser = async () => {
    try {
        const response = await $fetch('/api/login', {
            method: 'POST',
            body: {
                email: state.email,
                password: state.password,
            },
        });
        console.log('Login successful:', response);
    } catch (error) {
        console.error('Login failed:', error);
    }
};
</script>
