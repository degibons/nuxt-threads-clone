<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import type { Post } from '~/types'

const userStore = useUserStore()
const runtimeConfig = useRuntimeConfig()

const emit = defineEmits<{
  isDeleted: []
}>()
const props = defineProps<{
  post: Post
}>()

// const client = useSupabaseClient()
// const user = useSupabaseUser()

const isMenu = ref(false)
const isLike = ref(false)
const isDeleting = ref(false)
</script>

<template>
  <div class="z-50 bottom-0 h-full w-full">
    <div class="py-2 w-full">
      <div class="flex items-center justify-between">
        <div class="flex items-center text-white">
          <img class="rounded-full h-[35px]" :src="post.image" alt="" />
          <div class="ml-2 font-semibold text-[18px]">{{ post.name }}</div>
        </div>

        <div class="relative" @click="isMenu = !isMenu">
          <button
            :disabled="isDeleting"
            class="flex items-center text-white p-1 h-[24px] w-[24px] hover:bg-gray-800 rounded-full cursor-pointer"
            :class="isMenu ? 'bg-gray-800' : ''"
          >
            <Icon
              v-if="!isDeleting"
              name="bi:three-dots"
              color="#fff"
              size="18"
            />
            <Icon
              v-else
              name="eos-icons:bubble-loading"
              color="#fff"
              size="18"
            />
          </button>

          <div
            v-if="isMenu"
            class="absolute border border-gray-600 right-0 z-20 mt-1 rounded"
          >
            <button
              class="flex items-center rounded gap-2 text-red-500 justify-between bg-black w-full pl-4 pr-3 py-1 hover:bg-gray-900"
            >
              <div>Удалить</div>
              <Icon name="solar:trash-bin-trash-broken" size="20" />
            </button>
          </div>
        </div>
      </div>

      <div class="relative flex items-center w-full">
        <div class="w-[42px] mx-auto">
          <div class="absolute ml-4 mt-1 top-0 w-px bg-gray-700 h-full" />
        </div>
        <div class="bg-black rounded-lg w-[calc(100%-45px)] text-sm font-light">
          <div class="py-2 text-gray-300">{{ post.text }}</div>
          <img
            v-if="post && post.picture"
            class="mx-auto w-full mt-2 pr-2 rounded"
            :src="post.picture"
            alt=""
          />
          <div class="absolute mt-2 w-full ml-2">
            <button :disabled="isLike" class="flex items-center gap-1">
              <Icon
                class="p-1 text-white hover:bg-gray-800 rounded-full cursor-pointer"
                name="mdi:cards-heart-outline"
                size="28"
              />
            </button>
            <div class="relative text-sm text-gray-500">
              <div>
                <span>4</span>
                нравится
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="relative inline-block text-gray-500 pt-1 pb-1.5">
      <div class="flex items-center">
        <div class="flex items-center flex-wrap text-white gap-1 w-[42px]">
          <div class="flex gap-0.5">
            <img
              class="rounded-full h-[14px] w-[14px] mt-2"
              src="https://source.unsplash.com/random"
              alt=""
            />
            <img
              class="rounded-full h-[17px] w-[17px]"
              src="https://source.unsplash.com/random-photo"
              alt=""
            />
          </div>
          <div class="flex items-center">
            <img
              class="rounded-full h-[11px] w-[11px] ml-4"
              src="https://source.unsplash.com/featured"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
    <div class="h-px bg-gray-800 w-full mt-3" />
  </div>
</template>
