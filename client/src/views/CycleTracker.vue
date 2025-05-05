<template>
  <div class="bg-gray-100 p-10 m-5 rounded-xl shadow border space-y-4">
    <Navbar />
    <h2 class="text-xl font-bold text-gray-800">📅 Dönem Bilgisi</h2>

    <div v-if="hasData">
      <div v-for="(cycle, index) in cycles" :key="index"
        class="bg-white space-y-1 text-gray-700 text-sm border p-3 rounded mb-4">
        <p><strong>Başlangıç:</strong> {{ formatDate(cycle.startDate) }}</p>
        <p><strong>Bitiş:</strong> {{ formatDate(cycle.endDate) }}</p>
        <p><strong>Açıklama:</strong> {{ cycle.explanation }}</p>
        <p v-if="getRemainingText(cycle.endDate)" class="text-green-700 font-semibold">
          ⏳ {{ getRemainingText(cycle.endDate) }}
        </p>
        <p v-else class="text-red-600 font-semibold">🛑 Süre doldu</p>

        <!-- 🚮 Sil Butonu -->
        <button @click="deleteCycle(cycle._id)" class="mt-2 text-red-600 hover:underline text-sm">
          ❌ Sil
        </button>

      </div>
    </div>
    <div v-else>
      <p>📭 Herhangi bir veri bulunamadı.</p>
    </div>

    <!-- Yeni dönem ekleme formu -->
    <div class="mt-6 border-t pt-4">
      <h3 class="text-md font-semibold mb-2 text-gray-700">Yeni Dönem Ekle</h3>
      <form @submit.prevent="submitCycle" class="space-y-2">
        <div>
          <label class="block text-sm text-gray-600">Başlangıç Tarihi</label>
          <input type="date" v-model="formStart" class="border rounded p-2 w-full" />
        </div>
        <div>
          <label class="block text-sm text-gray-600">Süre (gün)</label>
          <input type="number" v-model.number="formDays" class="border rounded p-2 w-full" />
        </div>
        <div>
          <label class="block text-sm text-gray-600">Açıklama</label>
          <textarea v-model="formExplanation" class="border rounded p-2 w-full" rows="2"
            placeholder="Dönem açıklaması..."></textarea>
        </div>
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Kaydet
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import axios from 'axios'

const cycles = ref([])
const startDate = ref(null)
const endDate = ref(null)
const durationDays = ref(0)
const explanation = ref('')
const hasData = ref(true)

// Form verileri
const formStart = ref('')
const formDays = ref(0)
const formExplanation = ref('')

onMounted(async () => {
  try {
    const response = await axios.get('/cycles')

    if (Array.isArray(response.data) && response.data.length > 0) {
      cycles.value = response.data.map(cycle => ({
        ...cycle,
        startDate: new Date(cycle.start),
        endDate: (() => {
          const end = new Date(cycle.start)
          end.setDate(end.getDate() + cycle.durationDays)
          return end
        })()
      }))
      hasData.value = true
    } else {
      hasData.value = false
    }
  } catch (error) {
    console.error('Veri alınırken hata:', error)
    hasData.value = false
  }
})

function getRemainingText(endDate) {
  if (!endDate) return null

  const now = new Date()
  const diffMs = endDate - now
  if (diffMs < 0) return null

  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const years = Math.floor(totalDays / 365)
  const months = Math.floor((totalDays % 365) / 30)
  const days = totalDays - years * 365 - months * 30

  return `${years} yıl ${months} ay ${days} gün kaldı`
}

function formatDate(date) {
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

async function submitCycle() {
  try {
    await axios.post('/cycles', {
      start: formStart.value,
      durationDays: formDays.value,
      explanation: formExplanation.value
    })

    location.reload()
  } catch (err) {
    console.error('Dönem kaydedilemedi:', err)
  }
}

async function deleteCycle(id) {
  try {
    await axios.delete(`/cycles/${id}`)
    cycles.value = cycles.value.filter(cycle => cycle._id !== id)
  } catch (err) {
    console.error('Silme işlemi başarısız:', err)
  }
}
</script>
