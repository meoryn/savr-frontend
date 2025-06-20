<template>
    <div class="flex flex-col gap-3">
        <BarChart
            :data="calcSavings"
            :height="300"
            :categories="RevenueCategoriesMultple"
            :y-axis="['income', 'expense']"
            :group-padding="0"
            :bar-padding="0.2"
            :x-num-ticks="1"
            :radius="4"
            :x-formatter="xFormatter"
            :legend-position="LegendPosition.Top"
            :hide-legend="false"
            :y-grid-line="true"
        />
    </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase';

const user = useSupabaseUser();
const supabase = useSupabaseClient<Database>();

const accountData = await supabase
    .from('account')
    .select('*')
    .eq('user_id', user!.value!.id);

const testData = await supabase
    .from('monthly_report')
    .select('sum, type, transaction_date, category_name')
    .eq('account_id', accountData.data![0].account_id);

console.log(testData.data);

const RevenueCategoriesMultple = {
    income: { name: 'Income', color: '#3b82f6' },
    expense: { name: 'Expense', color: '#22c55e' },
};

const xFormatter = (i: number): string => `${calcSavings.value[i]?.month}`;
const yFormatter = (i: number) => i;

const calcSavings = computed(() => {
    const savings = testData.data.reduce((acc, item) => {
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
    }, []);
    return savings;
});

console.log(calcSavings.value.length);
</script>
