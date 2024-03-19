<script setup lang="ts">
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const client = useSupabaseClient()

const logout = () => {
  client.auth.signOut()
  userStore.isLogoutOverlay = false
  return navigateTo('/')
}
</script>

<template>
  <div
    id="Modal"
    class="fixed grid place-items-center h-screen z-50 bottom-0 bg-black bg-opacity-50 backdrop-blur-md w-full"
  >
    <div
      class="bg-black w-full max-w-[300px] rounded-lg text-white border border-gray-600 p-2"
    >
      <button
        class="flex items-center justify-between bg-black w-full p-3"
        @click="userStore.isLogoutOverlay = false"
      >
        <div>Закрыть</div>
        <Icon name="mdi:close" size="25" />
      </button>
      <div class="border-b border-b-gray-700 my-1" />
      <button
        @click="logout()"
        class="flex items-center justify-between bg-black w-full p-3"
      >
        <div>Выйти</div>
        <Icon name="ph:sign-out" size="25" />
      </button>
    </div>
  </div>
</template>
