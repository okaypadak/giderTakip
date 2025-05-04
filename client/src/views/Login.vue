<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-200 to-sky-400 px-4">
    <div class="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
      <h2 class="text-3xl font-bold text-center text-sky-700 mb-6">Gider Defteri</h2>

      <form @submit.prevent="login" class="space-y-5">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Kullanıcı Adı</label>
          <input
            v-model="username"
            type="text"
            placeholder="kullanici"
            class="input-field"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Şifre</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="input-field"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full py-2.5 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 transition"
        >
          Giriş Yap
        </button>

        <p v-if="error" class="text-red-600 text-sm text-center mt-2">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function login() {
  try {
    const res = await axios.post('/login', {
      username: username.value,
      password: password.value,
    })

    localStorage.setItem('token', res.data.token)
    router.push('/period')
  } catch (err) {
    error.value = 'Giriş başarısız. Bilgileri kontrol edin.'
  }
}
</script>

<style scoped>
@reference 'tailwindcss';
.input-field {
  @apply w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition;
}
</style>
