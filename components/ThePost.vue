<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import type { Like, Post } from '~/types'

const userStore = useUserStore()
const runtimeConfig = useRuntimeConfig()

const props = defineProps<{
  post: Post
}>()

const client = useSupabaseClient()
const user = useSupabaseUser()

const isMenu = ref(false)
const isLike = ref(false)
const isDeleting = ref(false)

const likeComputed = computed<Like | null>(() => {
  let likePostObj = null

  if (user.value) {
    props.post.likes.forEach(like => {
      if (
        like.userId == user.value!.identities![0].user_id &&
        like.postId == props.post.id
      ) {
        likePostObj = like
      }
    })
  }

  return likePostObj
})

const deletePost = async (id: number, picture: string) => {
  if (confirm('Точно удалить?')) {
    try {
      isMenu.value = false
      isDeleting.value = true

      const { data, error } = await client.storage
        .from('threads-clone-files')
        .remove([picture])

      await useFetch(`/api/delete-post/${id}`, { method: 'DELETE' })
      // TODO: splice post by id from posts instead getAllPosts
      await userStore.getAllPosts()
      isDeleting.value = false
    } catch (error) {
      console.log(error)
      isDeleting.value = false
    }
  }
}

const likePost = async (id: number) => {
  isLike.value = true
  try {
    await useFetch('/api/like-post', {
      method: 'POST',
      body: {
        userId: user.value!.identities![0].user_id,
        postId: id
      }
    })
    // TODO: get likes by post id (state action) and refresh post instead getAllPosts
    await userStore.getAllPosts()
    isLike.value = false
  } catch (error) {
    console.log(error)
    isLike.value = false
  }
}

const unlikePost = async (id: number) => {
  isLike.value = true
  try {
    await useFetch(`/api/unlike-post/${id}`, { method: 'DELETE' })
    // TODO: get likes by post id (state action) and refresh post instead getAllPosts
    await userStore.getAllPosts()
    isLike.value = false
  } catch (error) {
    console.log(error)
    isLike.value = false
  }
}
</script>

<template>
  <div class="z-50 bottom-0 h-full w-full">
    <div class="py-2 w-full">
      <div class="flex items-center justify-between">
        <div class="flex items-center text-white">
          <img class="rounded-full h-[35px]" :src="post.image" alt="" />
          <div class="ml-2 font-semibold text-[18px]">{{ post.name }}</div>
        </div>

        <div
          v-if="
            user && user.identities && user.identities[0].user_id == post.userId
          "
          class="relative"
          @click="isMenu = !isMenu"
        >
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
              @click="deletePost(post.id, post.picture)"
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
            :src="runtimeConfig.public.bucketUrl + '/' + post.picture"
            alt=""
          />
          <div class="absolute mt-2 w-full ml-2">
            <button
              :disabled="isLike"
              @click="
                likeComputed ? unlikePost(likeComputed.id) : likePost(post.id)
              "
              class="flex items-center gap-1"
            >
              <Icon
                v-if="likeComputed"
                class="p-1 text-red-500 hover:bg-gray-800 rounded-full cursor-pointer"
                name="mdi:cards-heart"
                size="28"
              />
              <Icon
                v-else
                class="p-1 text-white hover:bg-gray-800 rounded-full cursor-pointer"
                name="mdi:cards-heart-outline"
                size="28"
              />
            </button>
            <div class="relative text-sm text-gray-500">
              <div>
                <span v-if="isLike">
                  <Icon
                    name="eos-icons:bubble-loading"
                    size="13"
                    color="#fff"
                  />
                </span>
                <span v-else>{{ post.likes.length }}</span>
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
