<template>
    <div class="flex flex-col gap-3">
        <UTable
            v-if="transaction"
            sticky
            :data="transaction"
            class="w-full h-96"
        />

        <UModal v-model:open="isOpen">
            <UButton class="font-bold py-2 px-4 rounded-lg hover:bg-green-500">
                Add transaction
            </UButton>

            <template #content>
                <div
                    class="flex flex-col gap-4 justify-center items-center p-4"
                >
                    <h2 class="text-center text-3xl font-bold">
                        Transaktion hinzufügen
                    </h2>
                    <UForm
                        class="space-y-4"
                        :state="{
                            selectedCategory,
                            selectedAmount,
                            pickedDate,
                            selectedType,
                        }"
                        @submit="addTransaction"
                    >
                        <UFormField label="Amount" name="amount">
                            <UInputNumber v-model="selectedAmount" :min="1" />
                        </UFormField>
                        <UFormField label="Type" name="type">
                            <USelect
                                v-model="selectedType"
                                :items="selectTypes"
                                class="w-full"
                            />
                        </UFormField>
                        <UFormField label="Category" name="category">
                            <USelect
                                v-model="selectedCategory"
                                :items="selectOptions"
                                class="w-full"
                            />
                        </UFormField>
                        <UFormField label="Date" name="date">
                            <UInput
                                v-model="pickedDate"
                                type="date"
                                class="w-full"
                            />
                        </UFormField>
                        <UButton type="submit"> Submit </UButton>
                    </UForm>
                </div>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import type { Transaction } from '~/interfaces/tables/transaction';
import type { Category } from '~/interfaces/tables/category';

const selectedCategory = ref<string | undefined>(undefined);
const selectedAmount = ref(0);
const pickedDate = ref<string | undefined>(undefined);
const selectedType = ref('income');
const isOpen = ref<boolean>(false);

const selectTypes = [
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' },
];

const store = useUserStore();

const { data: transaction, error } = await useFetch<Transaction[]>(
    `${useRuntimeConfig().public.apiBaseUrl}/table`,
    {
        key: `transactions-${store.user?.id}`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${store.jwt}`,
            'x-refresh-token': store.refreshToken,
        },
        body: {
            tableName: 'transaction',
            selectedColumns: ['date', 'type', 'amount'],
        },
    }
);


const { data: categories } = await await useFetch<
    Category[]
>(`${useRuntimeConfig().public.apiBaseUrl}/table`, {
    key: `categories-selection-${store.user?.id}`,
    method: 'POST',
    headers: {
        Authorization: `Bearer ${store.jwt}`,
        'x-refresh-token': store.refreshToken,
    },
    body: {
        tableName: 'category',
        selectedColumns: ['category_id', 'name'],
    },
});

const selectOptions = computed(() => {
    if (categories.value) {
        return categories.value.map((category) => ({
            label: category.name,
            value: category.category_id,
        }));
    }
    return [];
});

const addTransaction = async () => {

    const response = await $fetch(
        `${useRuntimeConfig().public.apiBaseUrl}/transactions`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${store.jwt}`,
                'x-refresh-token': store.refreshToken,
            },
            body: {
                user_id: store.user?.id,
                category_id: selectedCategory.value,
                amount: selectedAmount.value,
                date: pickedDate.value,
                type: selectedType.value,
            }
        }
    );

    if(response) {
        console.log('Transaction added successfully');
        isOpen.value = false; // Close the modal after adding the transaction
    } else {
        console.error('Error adding transaction:', response);
    }
};
</script>
