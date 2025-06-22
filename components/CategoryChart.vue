<template>
    <DonutChart
        :data="computedPercentages"
        :height="300"
        :radius="0"
        :type="'full'"
        :labels="categoryLabels"
    >
        <div class="absolute text-center">
            <div class="font-semibold">{{ totalSpent }} €</div>
            <div class="text-(--ui-text-muted)">Totally spent</div>
        </div>
    </DonutChart>
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase';

const user = useSupabaseUser();
const supabase = useSupabaseClient<Database>();
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


const {data: categories} = await supabase
    .from('category')
    .select('name');

console.log(categories);




const accountData = await supabase
    .from('account')
    .select('*')
    .eq('user_id', user!.value!.id);

const testData = await supabase
    .from('monthly_report')
    .select('sum, type, transaction_date, category_name')
    .eq('account_id', accountData.data![0].account_id);

console.log(testData.data);

//TODO: Filter out duplicates and select 

const {data: months} = await supabase.from('monthly_report')
    .select('transaction_date')
    .eq('account_id', accountData.data![0].account_id)
    .order('transaction_date', { ascending: true });

console.log(months);

const categoryLabels = computed(() => {
    return categories.map((item, index) => ({
        name: item.name,
        color: colors[index % colors.length], // Cycle through colors
    }));
});

const computedPercentages = computed(() => {
    const percentagesPerCategory = testData.data.reduce((acc, item) => {
        if (!acc.find((el) => el.category_name === item.category_name)) {
            acc.push({
                category_name: item.category_name,
                total: 0,
            });
        }

        const index = acc.findIndex(
            (el) => el.category_name === item.category_name
        );


        if(item.type === 'expense') acc[index].total += item.sum;

        return acc;
    }, []);

    return percentagesPerCategory.sort((a, b) => {
        if (a.category_name < b.category_name) {
            return -1;
        }
        if (a.category_name > b.category_name) {
            return 1;
        }
        return 0;
    }).map(item => item.total);
});

console.log(computedPercentages.value);

const totalSpent = computed(() => {
    return computedPercentages.value.reduce((acc, item) => acc + item, 0);
});


</script>
