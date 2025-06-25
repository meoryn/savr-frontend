<template>
    <div class="flex flex-col items-center justify-center p-4">
        <h2 class="text-xl font-bold mb-4">Monatliches Limit</h2>
          <USelect v-model="selectedCategory" :items="selectableCategories" class="w-full" />
          <p v-if="monthlySpending && monthlySpending[0]" class="py-4 text-xl font-bold">
            <span>{{monthlySpending[0].sum}}</span> / 0
          </p>
    </div>
</template>


<script setup lang="ts">
import type { Category } from '~/interfaces/tables/category';

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
            value: item.name,
        }));
    }
    return [];
});



const selectedCategory = ref<string | undefined>(selectableCategories.value[0]?.value);

console.log(categories.value);

const { data: monthlySpending } = await useFetch<{sum: number}[]>(
    `${useRuntimeConfig().public.apiBaseUrl}/monthlySpendings`,
    {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${store.jwt}`,
            'x-refresh-token': store.refreshToken,
        },
        body: {
            user_id: store.user.id,
            category_name: selectedCategory,
        },
    }
);

console.log(monthlySpending.value);

</script>