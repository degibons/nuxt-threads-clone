<script setup lang="ts">
import ThePost from '~/components/ThePost.vue'
import MainLayout from '~/layouts/MainLayout.vue'
import { useUserStore } from '~/stores/user'
import type { Post } from '~/types'

const userStore = useUserStore()
const user = useSupabaseUser()

const posts = ref<Post[]>([])
const isPosts = ref(false)
const isLoading = ref(true)

watchEffect(() => {
  if (!user.value) {
    return navigateTo('/auth')
  }
})

onBeforeMount(async () => {
  try {
    await userStore.getAllPosts()
  } catch (error) {
    console.log(error)
  }
})

onMounted(() => {
  watchEffect(() => {
    if (userStore.posts) {
      posts.value = userStore.posts
      isPosts.value = !!userStore.posts.length
      isLoading.value = false
    }
  })
})
</script>

<template>
  <MainLayout>
    <div id="IndexPage" class="pb-[100px] size-full">
      <div class="mx-auto overflow-hidden size-full">
        <div
          id="Posts"
          class="px-4 mx-auto overflow-y-scroll size-full box-content"
        >
          <div v-if="isPosts" v-for="post in posts" :key="post.id">
            <ThePost :post="post" />
          </div>
          <div v-else>
            <client-only>
              <div
                v-if="isLoading"
                class="mt-20 w-full flex items-center justify-center mx-auto"
              >
                <div
                  class="text-white mx-auto flex flex-col gap-4 items-center justify-center"
                >
                  <Icon
                    name="eos-icons:bubble-loading"
                    size="50"
                    color="#fff"
                  />
                  <div class="w-full mt-1">Загрузка...</div>
                </div>
              </div>
              <div
                v-else
                class="mt-20 w-full flex items-center justify-center mx-auto"
              >
                <div
                  class="text-white/80 mx-auto flex flex-col gap-4 items-center justify-center"
                >
                  <Icon name="tabler:mood-empty" size="50" color="#fff" />
                  <div class="w-full">Напиши свой первый пост!</div>
                </div>
              </div>
            </client-only>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
