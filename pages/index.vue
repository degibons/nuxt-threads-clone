<script setup lang="ts">
import ThePost from '~/components/ThePost.vue'
import MainLayout from '~/layouts/MainLayout.vue'
import { useUserStore } from '~/stores/user'
import type { Post } from '~/types'

const userStore = useUserStore()
const user = useSupabaseUser()

const posts = ref<Post[]>([])
const isPost = ref(true)
const isLoading = ref(false)

onBeforeMount(() => {
  posts.value = [
    {
      id: 123,
      name: 'Degibons',
      image: 'https://placehold.co/100',
      text: 'Заголовок поста',
      picture: 'https://placehold.co/500'
    }
  ]
})
</script>

<template>
  <MainLayout>
    <div id="IndexPage" class="pb-[100px]">
      <div class="mx-auto overflow-hidden w-full h-full">
        <div
          id="Posts"
          class="px-4 mx-auto overflow-y-scroll w-full h-full box-content"
        >
          <div v-if="isPost" v-for="post in posts" :key="post.id">
            <ThePost :post="post" @isDeleted="posts = []" />
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
