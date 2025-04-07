<template>
        <div class="flex flex-row justify-between p-5 border-b-2 border-gray-100 shadow">
        <div>
            <NuxtLink to="/" class="text-2xl font-bold">
                Savr
            </NuxtLink>
        </div>
        <div v-if="user">
            <div class="flex flex-row gap-4">
                <NuxtLink class="text-xl font-bold cursor-pointer hover:text-green-300" to="/dashboard">Dashboard</NuxtLink>
                <NuxtLink class="text-xl font-bold cursor-pointer hover:text-green-300" to="/profile">Profile</NuxtLink>
                <NuxtLink class="text-xl font-bold cursor-pointer hover:text-green-300" @click="logoutUser">Logout</NuxtLink>
                <ColorButton />
            </div>
        </div>
        <div v-else class="flex flex-row gap-4">
            <NuxtLink class="text-xl font-bold cursor-pointer hover:text-green-300" to="/login">Login</NuxtLink>
            <NuxtLink class="text-xl font-bold cursor-pointer hover:text-green-300" to="/register">Registrieren</NuxtLink>
            <ColorButton />
        </div>
    </div>
</template>

<script setup lang="ts">

const user = useSupabaseUser();

const supabase = useSupabaseClient();

const logoutUser = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        navigateTo('/');
    } catch (error) {
        console.error('Error logging out:', error);
    }
};

</script>
