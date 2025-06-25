<template>
    <div>

        <UModal v-model:open="isOpen">
            <UButton class="font-bold py-2 px-4 rounded-lg w-full hover:bg-green-500">
                Monatliche Limits bearbeiten
            </UButton>

            <template #content>
                <div
                    class="flex flex-col gap-4 justify-center items-center p-4"
                >
                    <h2 class="text-center text-3xl font-bold">
                        Limits bearbeiten
                    </h2>
                    <UForm
                        class="space-y-4"
                        :state="{
                            selectedCategory,
                            selectedAmount,
                        }"
                        @submit="editLimit"
                    >   
                        <UFormField label="Category" name="category">
                            <USelect
                                v-model="selectedCategory"
                                :items="selectableCategories"
                                class="w-full"
                            />
                        </UFormField>
                        <UFormField label="Amount" name="amount">
                            <UInputNumber v-model="selectedAmount" :min="1" />
                        </UFormField>
                        <UButton type="submit"> Edit </UButton>
                    </UForm>
                </div>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">

import type { Category } from '~/interfaces/tables/category';

const selectedAmount = ref(0);
const isOpen = ref<boolean>(false);

const store = useUserStore();


const { data: categories } = await useFetch<Category[]>(
    `${useRuntimeConfig().public.apiBaseUrl}/table`,
    {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${store.jwt}`,
            'x-refresh-token': store.refreshToken,
        },
        body: {
            user_id: store.user.id,
            tableName: 'category',
        },
    }
);

const selectableCategories = computed(() => {
    if (categories.value) {
        return categories.value.map((item) => ({
            label: item.name,
            value: item.category_id,
        }));    
    }
    return [];
});

const { data: monthlyLimit} = await useFetch<{sum: number}[]>(
    `${useRuntimeConfig().public.apiBaseUrl}/table`,
    {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${store.jwt}`,
            'x-refresh-token': store.refreshToken,
        },
        body: {
            user_id: store.user.id,
            category_name: selectableCategories.value[0]?.value,
        },
    }
);


const selectedCategory = ref<string | undefined>(selectableCategories.value[0]?.value);

const editLimit = async (event: FormSubmitEvent<Schema>) => {

    const response = await $fetch(`${useRuntimeConfig().public.apiBaseUrl}/monthly_limit`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${store.jwt}`,
            'x-refresh-token': store.refreshToken,
        },
        body: {
            user_id: store.user.id,
            category_id: event.data.selectedCategory,
            maximum: event.data.selectedAmount,
        },
    });

    if(response) {
        console.log('Transaction added successfully');
        isOpen.value = false; // Close the modal after adding the transaction
    } else {
        console.error('Error adding transaction:', response);
    }
};
</script>