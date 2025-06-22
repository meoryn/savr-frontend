<template>
    <UContainer class="p-5 grid grid-cols-12 gap-4">
        <div class="col-span-6">
            <TransactionChart />
        </div>
        <div class="col-span-6">
            <CategoryChart />
        </div>
        <div class="col-span-12"> 
            <TransactionTable />
        </div>
    </UContainer>
</template>

<script setup lang="ts">

const user = useSupabaseUser();


if (!user.value) {
    navigateTo('/');
}



</script>
