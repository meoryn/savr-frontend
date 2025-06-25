<template>
    <UContainer class="p-5 grid grid-cols-12 gap-8">
        <div class="col-span-6 grid grid-cols-2 gap-4">
            <AccountBalance class="col-span-1"/>
            <MonthlyLimit class="col-span-1"/>
            <MonthyLimitSettings class="col-span-2"/>
        </div>
        <div class="col-span-6">
            <CategoryChart />
        </div>
        <hr class="col-span-12 border-gray-200 py-4">
        <div class="col-span-12">
            <ExpenseChart />
        </div>
        <hr class="col-span-12 border-gray-200 py-4">

        <div class="col-span-12">
            <TransactionChart />
        </div>
        <hr class="col-span-12 border-gray-200 py-4">
        <div class="col-span-12">
            <TransactionTable />
        </div>
    </UContainer>
</template>

<script setup lang="ts">
const store = useUserStore();

//TODO: Create interfaces for all backend responses

if (!(store.user && store.jwt)) {
    navigateTo('/');
}
</script>
