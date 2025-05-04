<template>
    <nav class="bg-white shadow-md px-6 py-4 flex justify-between items-center mb-6 rounded-b-2xl">
        <button @click="goToPeriodPage" class="text-blue-600 font-semibold hover:underline">
            ⬅️ Dönemlere Dön
        </button>

        <button @click="logout" class="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md">
            Çıkış
        </button>
    </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToPeriodPage() {
    router.push('/period')
}

function logout() {
    sessionStorage.clear()
    localStorage.removeItem('token')
    router.push('/')
}
</script>