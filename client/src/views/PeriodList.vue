<template>
 
  <div class="p-6 bg-gray-100">
    <Navbar />
    <h1 class="text-2xl font-bold mb-4">Dönem Seç</h1>

    <!-- ✅ Yeni Dönem Ekle -->
    <form @submit.prevent="addPeriod" class="flex gap-2 mb-6">
      <input
        v-model="newPeriod"
        placeholder="Örn: 2025-05"
        class="border rounded px-3 py-2 w-64"
      />
      <button class="bg-blue-600 text-white px-4 py-2 rounded">Ekle</button>
    </form>

    <!-- 📃 Dönem Listesi -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="p in periods"
        :key="p._id"
        @click="goToDashboard(p.period)"
        class="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-blue-50"
      >
        <p class="text-lg font-semibold text-blue-700">{{ p.period }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'

const newPeriod = ref('')
const periods = ref([])
const router = useRouter()

async function fetchPeriods() {
  try {
    const response = await axios.get('/periods')
    periods.value = response.data.sort((a, b) => b.period.localeCompare(a.period))
  } catch (err) {
    console.error('Dönemleri getirirken hata:', err.response?.data || err.message)
  }
}

async function addPeriod() {
  if (!newPeriod.value.trim()) return

  try {
    await axios.post('/periods', {
      period: newPeriod.value.trim()
    })

    newPeriod.value = ''
    await fetchPeriods()
  } catch (err) {
    console.error('Dönem eklenirken hata:', err.response?.data || err.message)
  }
}


function goToDashboard(period) {
  router.push({ name: 'Dashboard', query: { period } })
}

onMounted(fetchPeriods)
</script>
