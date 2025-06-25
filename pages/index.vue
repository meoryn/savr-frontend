<template>

        <div class="flex flex-col items-center justify-center flex-1">
            <div class="text-center">
                <h2 class="text-8xl pb-2">
                    Welcome to S<span class="text-green-300">avr</span>
                </h2>
                <div>
                    <p class="text-xl">
                        Your one-stop solution for all your savings needs.
                    </p>
                    <p class="text-xl">
                        We are currently in the process of building our
                        platform.
                    </p>
                    <p class="text-xl">Stay tuned for updates!</p>
                </div>
            </div>
        </div>
</template>


<script setup lang="ts">

const store = useUserStore();

const { data: transaction, error} = await useFetch(`${useRuntimeConfig().public.apiBaseUrl}/table`, {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${store.jwt}`,
        'x-refresh-token': store.refreshToken,
    },
    body: {
        tableName: 'transaction',
    },
});

console.log(transaction.value);
</script>