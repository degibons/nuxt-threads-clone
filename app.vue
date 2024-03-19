<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import CreatePost from '~/components/CreatePost.vue'
import TheModal from '~/components/TheModal.vue'

const userStore = useUserStore()
</script>

<template>
  <VitePwaManifest />
  <div class="bg-black fixed w-[calc(100%+1px)] h-full">
    <NuxtPage />

    <CreatePost
      :class="[
        {
          'max-h-[100wh] transition-all duration-200 ease-in visible':
            userStore.isMenuOverlay
        },
        {
          'max-h-0 transition-all duration-200 ease-out invisible':
            !userStore.isMenuOverlay
        }
      ]"
    />

    <TheModal
      :class="[
        {
          'max-h-[100wh] transition-all duration-200 ease-in visible':
            userStore.isLogoutOverlay
        },
        {
          'max-h-0 transition-all duration-200 ease-out invisible':
            !userStore.isLogoutOverlay
        }
      ]"
    />
  </div>
</template>
