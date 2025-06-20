<template>
    <div class="flex flex-col gap-3">
        <UTable sticky :data="tableData" class="w-full h-38" />

        <UModal v-model:open="isOpen">
            <UButton class="font-bold py-2 px-4 rounded-lg hover:bg-green-500">
                Add transaction
            </UButton>

            <template #content>
                <div class="flex flex-col gap-4 justify-center items-center p-4">
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
                            <UInputNumber  v-model="selectedAmount" :min="1"/>
                        </UFormField>
                        <UFormField label="Type" name="type">
                           <USelect v-model="selectedType" :items="selectTypes" class="w-full" />
                        </UFormField>
                        <UFormField label="Category" name="category">
                           <USelect v-model="selectedCategory" :items="selectOptions" class="w-full" />
                        </UFormField>
                        <UFormField label="Date" name="date">
                            <UInput v-model="pickedDate" type="date" class="w-full"/>
                        </UFormField>
                        <UButton type="submit"> Submit </UButton>
                    </UForm>
                </div>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase';

const user = useSupabaseUser();
const supabase = useSupabaseClient<Database>();

const selectedCategory = ref<string | undefined>(undefined);
const selectedAmount = ref(0);
const pickedDate = ref<string | undefined>(undefined);
const selectedType = ref('income');
const isOpen = ref<boolean>(false);

const selectTypes = [
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' },
];

const { data: sbData } = await supabase
    .from('transaction')
    .select('*')
    .eq('user_id', user!.value!.id);

const tableData = computed(() => {
    if (!sbData) return [];

    return sbData.map((item) => ({
        date: item.date,
        type: item.type,
        amount: `${item.amount}€`,
    }));
});

const {data: categories} = await supabase
    .from('category')
    .select('*');

 const selectOptions = categories?.map((item) => ({
    label: item.name,
    value: item.category_id,
}));

const addTransaction = async () => {
    const { data } = await supabase
        .from('account')
        .select('*')
        .eq('user_id', user!.value!.id);

    if (data) {

        console.log(data);

        const resp = await supabase.from('transaction').insert({
            user_id: user!.value!.id,
            account_id: data[0].account_id,
            category_id: selectedCategory.value,
            amount: selectedAmount.value,
            date: pickedDate.value,
            type: selectedType.value,
        });

        if(resp) {
            console.log('Transaction added successfully');
            isOpen.value = false; // Close the modal after adding the transaction

        } else {
            console.error('Error adding transaction:', resp);
        }
    }
};
</script>
