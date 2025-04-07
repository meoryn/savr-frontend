<template>
    <div class="min-h-screen flex flex-col">
        <Navbar />
        <main class="flex flex-1">
            <slot />
        </main>
        <Footer />
    </div>
</template>