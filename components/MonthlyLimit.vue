<template>
    <div
        class="flex flex-col items-center justify-around p-4 shadow-lg border-1 border-gray-100 rounded-2xl w-full"
    >
        <h2 class="text-xl font-bold mb-4">Monatliches Limit</h2>

        <p
        v-if="monthlyLimit && monthlySpending"
            class="py-4 text-3xl font-bold"
        >
            <span
                :class="
                    monthlySpending > monthlyLimit
                        ? 'text-red-500'
                        : 'text-green-500'
                "
                >{{ monthlySpending }}</span
            >
            / {{ monthlyLimit }}
        </p>
        <USelect
            v-model="selectedCategory"
            :items="selectableCategories"
            class="w-full"
        />
    </div>
</template>

<script setup lang="ts">
import type { Category } from '~/interfaces/tables/category';

const store = useUserStore();

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

const selectedCategory = ref<string | undefined>(
    selectableCategories.value[0]?.value
);

const { data: monthlyLimit, error: monthlyLimitError } = await useFetch<number>(
    `${useRuntimeConfig().public.apiBaseUrl}/getMonthlyLimit`,
    {
        key: `get-monthly-limit-${store.user?.id}`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${store.jwt}`,
            'x-refresh-token': store.refreshToken,
        },
        body: {
            user_id: store.user?.id,
            category_name: selectedCategory,
        },
    }
);

if (monthlyLimitError.value) {
    console.error('Error fetching monthly limit:', monthlyLimitError.value);
}


const { data: monthlySpending } = await useFetch<number>(
    `${useRuntimeConfig().public.apiBaseUrl}/monthlySpendings`,
    {
        key: `monthly-spending-${store.user?.id}`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${store.jwt}`,
            'x-refresh-token': store.refreshToken,
        },
        body: {
            user_id: store.user?.id,
            category_name: selectedCategory,
        },
    }
);

</script>
