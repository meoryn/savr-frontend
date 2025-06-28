<template>
    <div
        v-if="selectedCategory"
        class="flex flex-col items-center justify-center gap-8"
    >
        <div class="flex items-center gap-4">
            <span class="text-md font-bold">Ausgewählte Kategorie:</span>
            <USelect v-model="selectedCategory" :items="fetchedCategories" />
        </div>
        <AreaChart
            :data="AreaChartData"
            :height="300"
            y-label="Betrag"
            x-label="Monat"
            :categories="categories"
            :y-num-ticks="4"
            :x-num-ticks="
                AreaChartData.length > 13 ? 12 : AreaChartData.length - 1
            "
            :y-grid-line="true"
            :hide-legend="true"
            :x-formatter="xFormatter"
            class="w-full"
        />
    </div>
</template>

<script setup lang="ts">
import type { MonthlyReportEntry } from '~/interfaces/tables/monthlyReportEntry';

const store = useUserStore();

const categories: Ref<Record<string, BulletLegendItemInterface>> = ref({
    expense: { name: 'Bildung', color: '#3b82f6' },
});

const { data: usedCategories } = await useFetch<{ category_name: string }[]>(
    `${useRuntimeConfig().public.apiBaseUrl}/usedCategories`,
    {
        key: `usedCategories-${store.user?.id}`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${store.jwt}`,
            'x-refresh-token': store.refreshToken,
        },
        body: {
            user_id: store.user?.id,
            type: 'expense',
        },
        onResponse({ response }) {
            adjustTokens(response.headers);
        },
    }
);

const fetchedCategories = computed(() => {
    if (usedCategories.value) {
        return usedCategories.value.map((item) => {
            return {
                label: item.category_name,
                value: item.category_name,
            };
        });
    }
    return [];
});

const selectedCategory = ref<string | undefined>(
    fetchedCategories.value && fetchedCategories.value[0]
        ? fetchedCategories.value[0].value
        : undefined
);

watch(
    selectedCategory,
    (newValue) => {
        if (newValue) {
            categories.value.expense.name = newValue;
        }
    },
    { immediate: true }
);

const { data: expenses } = await useFetch<MonthlyReportEntry[]>(
    `${useRuntimeConfig().public.apiBaseUrl}/expenses`,
    {
        key: `expenses-${store.user?.id}-${selectedCategory.value}`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${store.jwt}`,
            'x-refresh-token': store.refreshToken,
        },
        body: {
            user_id: store.user?.id,
            category_name: selectedCategory,
        },
        onResponse({ response }) {
            adjustTokens(response.headers);
        },
    }
);

const AreaChartData = computed(() => {
    if (expenses.value) {
        return expenses.value.map((expense) => ({
            month: expense.transaction_date,
            expense: expense.sum,
        }));
    }
    return [];
});

const xFormatter = (i: number): string | number =>
    `${AreaChartData.value[i]?.month}`;
</script>
