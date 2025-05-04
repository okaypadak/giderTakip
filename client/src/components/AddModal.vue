<template>
  <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
    <div class="bg-white rounded-xl shadow-lg p-6 w-96">
      <h2 class="text-xl font-bold mb-4">Gider Ekle</h2>
      <form @submit.prevent="submit">
        <input v-model="amount" type="number" placeholder="Tutar" class="w-full mb-2 p-2 border rounded" />
        <input v-model="note" type="text" placeholder="Not" class="w-full mb-2 p-2 border rounded" />
        <select v-model="category" class="w-full mb-4 p-2 border rounded">
          <option value="">Kategori Seç</option>
          <option value="yemek">Yemek</option>
          <option value="ulaşım">Ulaşım</option>
          <option value="fatura">Fatura</option>
          <option value="market">Market</option>
          <option value="alışveriş">Alışveriş</option>
          <option value="internet">Alışveriş-İnternet</option>
        </select>
        <div class="flex justify-end gap-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 bg-gray-300 rounded">İptal</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Ekle</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps(['visible'])
const emit = defineEmits(['close', 'add'])

const amount = ref('')
const note = ref('')
const category = ref('')

function submit() {
  emit('add', { amount: amount.value, note: note.value, category: category.value })
  emit('close')
}
</script>
