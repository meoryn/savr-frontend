<template>
   <div class="flex flex-col items-center justify-center gap-8">
     <div class="flex items-center gap-4">
        <span class="text-md font-bold">Ausgewählter Monat:</span>
        <USelect v-model="selectedMonth" :items="selectableMonths"/>
     </div>
    <DonutChart
        :data="computedPercentages.map((item) => item.total)"
        :height="300"
        :radius="0"
        :type="'full'"
        :labels="categoryLabels"
    >
        <div class="absolute text-center">
            <div class="font-semibold">{{ totalSpent }} €</div>
            <div class="text-muted">Totally spent</div>
        </div>
    </DonutChart>
   </div>
</template>

<script setup lang="ts">
import type { MonthlyReportEntry } from '~/interfaces/tables/monthlyReportEntry';

const store = useUserStore();
const selectedMonth = ref(new Date().toISOString().slice(0, 7)); // YYYY-MM format
const colors = [
    '#3b82f6', // Blue
    '#22c55e', // Green
    '#f59e0b', // Amber
    '#a855f7', // Purple
    '#06b6d4', // Cyan
    '#ef4444', // Red
    '#f97316', // Orange
    '#10b981', // Emerald
];



const { data: availableMonths } = await useFetch<{transaction_date: string}[]>(
    `${useRuntimeConfig().public.apiBaseUrl}/availableMonths`,
    {
        key: `availableMonths-${store.user?.id}`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${store.jwt}`,
            'x-refresh-token': store.refreshToken,
        },
        body: {
            user_id: store.user?.id,
        },
        onResponse({ response }) {
            adjustTokens(response.headers);
        },
    }
);

const selectableMonths = computed(() => {
    if (availableMonths.value) {
        return availableMonths.value.map((month) => ({
            label: month.transaction_date,
            value: month.transaction_date,
        }));
    }
    return [];
});

const { data: categoriesedTransactions } = await useFetch<MonthlyReportEntry[]>(
    `${useRuntimeConfig().public.apiBaseUrl}/monthlyReport`,
    {
        key: `monthlyReport-${store.user?.id}`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${store.jwt}`,
            'x-refresh-token': store.refreshToken,
        },
        body: {
            user_id: store.user?.id,
        },
        onResponse({ response }) {
            adjustTokens(response.headers);
        },
    }
);

const categoryLabels = computed(() => {
    if (computedPercentages.value) {
        return computedPercentages.value
            .map((item, index) => ({
                name: item.category_name,
                color: colors[index % colors.length], // Cycle through colors
            }))
            .sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
    }
    return [];
});

const computedPercentages = computed(() => {
    if (categoriesedTransactions.value) {
        const percentagesPerCategory = categoriesedTransactions.value.reduce(
            (acc, item) => {


                if(item.transaction_date !== selectedMonth.value || item.type === 'income') {
                    return acc; // Skip items not in the selected month
                }

                if (
                    !acc.find((el) => el.category_name === item.category_name)
                ) {
                    acc.push({
                        category_name: item.category_name,
                        total: 0,
                    });
                }

                const index = acc.findIndex(
                    (el) => el.category_name === item.category_name
                );

                acc[index].total += item.sum;

                return acc;
            },
            [] as { category_name: string; total: number }[]
        );

        return percentagesPerCategory
            .sort((a, b) => {
                if (a.category_name < b.category_name) {
                    return -1;
                }
                if (a.category_name > b.category_name) {
                    return 1;
                }
                return 0;
            })
    }
    return [];
});

const totalSpent = computed(() => {
    return computedPercentages.value.reduce((acc, item) => acc + item.total, 0);
});


</script>
