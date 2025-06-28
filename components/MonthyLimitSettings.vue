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
                        <UFormField label="Kategorie" name="category">
                            <USelect
                                v-model="selectedCategory"
                                :items="selectableCategories"
                                class="w-full"
                            />
                        </UFormField>
                        <UFormField label="Neues Limit" name="amount">
                            <UInputNumber v-model="selectedAmount" :min="0" />
                        </UFormField>
                        <UButton type="submit"> Bearbeiten </UButton>
                    </UForm>
                </div>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">

import type { Category } from '~/interfaces/tables/category';


const isOpen = ref<boolean>(false);

const store = useUserStore();
const toast = useToast();

const { data: categories } = await useFetch<Category[]>(
    `${useRuntimeConfig().public.apiBaseUrl}/table`,
    {
        key: `categories-${store.user?.id}`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${store.jwt}`,
            'x-refresh-token': store.refreshToken,
        },
        body: {
            user_id: store.user?.id,
            tableName: 'category',
        },
        onResponse({response}) {
            adjustTokens(response.headers);
        }
    }
);

const selectableCategories = computed(() => {
    if (categories.value) {
        return categories.value.map((item) => ({
            label: item.name,
            value: item.name,
        }));    
    }
    return [];
});

const selectedCategory = ref<string | undefined>(selectableCategories.value[0]?.value);

const selectedAmount = ref(0);


const editLimit = async () => {

    const response = await $fetch(`${useRuntimeConfig().public.apiBaseUrl}/monthly_limit`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${store.jwt}`,
            'x-refresh-token': store.refreshToken,
        },
        body: {
            user_id: store.user?.id,
            category_name: selectedCategory.value,
            maximum: selectedAmount.value,
        },
    });

    if(response) {
        toast.add({
                title: 'Success',
                description: 'Limit wurde erfolgreich angepasst!',
                color: 'success', 
        })
        isOpen.value = false; // Close the modal after adding the transaction
        await refreshNuxtData();
    } else {
        console.error('Error adding transaction:', response);
    }
};
</script>