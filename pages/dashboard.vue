<template>
    <UContainer class="p-5 grid grid-cols-12 gap-4">
        <div class="col-span-4"> 
            <TransactionTable />
        </div>
        <div class="col-span-4">
            <TransactionChart />
        </div>
    </UContainer>
</template>

<script setup lang="ts">

const user = useSupabaseUser();


if (!user.value) {
    navigateTo('/');
}



</script>
