<template>
    <div
        class=" shadow-lg border-1 border-gray-100 rounded-2xl w-full"
    >
        <div class="flex flex-col items-center justify-center p-4 h-full">
            <h3 class="text-2xl font-bold">Derzeitiger Stand:</h3>
            <span
                class="text-4xl font-semibold mt-2"
                :class="{
                    'text-red-600': accountBalance < 0,
                    'text-green-600': accountBalance > 0,
                }"
            >
                {{ accountBalance }} €
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
const store = useUserStore();

const { data: accountBalance, error } = await useFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/balance`,
    {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${store.jwt}`,
            'x-refresh-token': store.refreshToken,
        },
        body: {
            user_id: store.user.id,
        },
    }
);

console.log(accountBalance.value);
</script>
