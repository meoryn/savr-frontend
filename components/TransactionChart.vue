<template>
    <div class="flex flex-col gap-3">
        <BarChart
            :data="calcSavings"
            :height="300"
            :categories="RevenueCategoriesMultple"
            :y-axis="['income', 'expense']"
            :group-padding="0"
            :bar-padding="0.2"
            :radius="4"
            :x-formatter="xFormatter"
            :x-num-ticks="6"
            :legend-position="LegendPosition.Top"
            :hide-legend="false"
            :y-grid-line="true"
        />
    </div>
</template>

<script setup lang="ts">
import type { MonthlyReportEntry } from '~/interfaces/tables/monthlyReportEntry';
const store = useUserStore();


const {data: categoriesedTransactions} = await useFetch<MonthlyReportEntry[]>(
    `${useRuntimeConfig().public.apiBaseUrl}/monthlyReport`,
    {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${store.jwt}`,
            'x-refresh-token': store.refreshToken,
        },
        body: {
            userId: store.user.id,
        },
    }
);

const RevenueCategoriesMultple = {
    income: { name: 'Income', color: '#3b82f6' },
    expense: { name: 'Expense', color: '#22c55e' },
};

const xFormatter = (i: number): string => `${calcSavings.value[i]?.month}`;
// const yFormatter = (i: number) => i;

const calcSavings = computed(() => {
    if(categoriesedTransactions.value) {
        const savings = categoriesedTransactions.value.reduce((acc, item) => {
        if (!acc.find((el) => el.month === item.transaction_date)) {
            acc.push({
                month: item.transaction_date,
                income: 0,
                expense: 0,
            });
        }

        const index = acc.findIndex((el) => el.month === item.transaction_date);

        if (item.type === 'income') {
            acc[index].income += item.sum;
            return acc;
        } else if (item.type === 'expense') {
            acc[index].expense += item.sum;
            return acc;
        }
        return acc;
    }, [] as {month: string, income: number, expense: number}[]);
    return savings;
    }

    return [];
});

console.log(calcSavings.value.length);
</script>
