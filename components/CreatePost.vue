<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { useUserStore } from '~/stores/user'
import type { Post } from '~/types'

const userStore = useUserStore()

const client = useSupabaseClient()
const user = useSupabaseUser()

const text = ref(null)
const isLoading = ref(false)

const adjustTextareaHeight = () => {
  const textarea = document.getElementById('textarea') as HTMLTextAreaElement
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}

const file = ref<null | { files: File[] }>(null)
const fileDisplay = ref<null | string>(null)
const fileData = ref<null | File>(null)

const clearData = () => {
  text.value = null
  file.value = null
  fileDisplay.value = null
  fileData.value = null
}

const onChange = () => {
  fileDisplay.value = URL.createObjectURL(file.value!.files[0])
  fileData.value = file.value!.files[0]
}

const restore = () => {
  userStore.isMenuOverlay = false
  clearData()
}

const createPost = async () => {
  let dataOut = null
  let errorOut = null

  isLoading.value = true

  if (fileData.value) {
    const { data, error } = await client.storage
      .from('threads-clone-files')
      .upload(`${uuidv4()}.jpg`, fileData.value)

    dataOut = data
    errorOut = error
  }

  if (errorOut) {
    console.log(errorOut)
    return errorOut
  }

  let pic = ''
  if (dataOut) {
    pic = dataOut.path || ''
  }

  try {
    await useFetch('/api/create-post', {
      method: 'POST',
      body: {
        userId: user.value?.identities![0].user_id,
        name: user.value?.identities![0].identity_data!.preferred_username,
        image: user.value?.identities![0].identity_data!.avatar_url,
        text: text.value,
        picture: pic
      }
    })

    // TODO: get new post by id (state action) and push to posts instead getAllPosts
    await userStore.getAllPosts()
    userStore.isMenuOverlay = false

    clearData()
    isLoading.value = false
  } catch (error) {
    console.log(error)
    isLoading.value = false
  }
}
</script>

<template>
  <div id="CreatePost" class="fixed z-50 bottom-0 size-full overflow-hidden">
    <div class="bg-black size-full text-white overflow-auto">
      <div
        class="flex items-center justify-start py-4 max-w-[500px] mx-auto border-b border-b-gray-700"
      >
        <button @click="restore" class="rounded-full px-2">
          <Icon name="mdi:close" size="25" />
        </button>
        <div class="text-[16px] font-semibold">Новый пост</div>
      </div>
      <div
        id="Post"
        class="z-40 bottom-0 max-h-[100vh-200px] w-full px-3 max-w-[500px] mx-auto"
      >
        <div class="py-2 w-full">
          <div class="flex items-center">
            <div v-if="user" class="flex items-center text-white">
              <img
                class="rounded-full size-8"
                :src="user.identities![0].identity_data!.avatar_url"
                alt=""
              />
              <div class="ml-2 font-semibold text-[18px]">
                {{ user.identities![0].identity_data!.preferred_username }}
              </div>
            </div>
          </div>

          <div class="relative flex items-center w-full">
            <div class="w-[42px] mx-auto">
              <div class="absolute ml-4 mt-1 top-0 w-px bg-gray-700 h-full" />
            </div>
            <div class="bg-black rounded-lg w-[calc(100%-50px)] font-light">
              <div class="pt-2 text-gray-300 bg-black w-full">
                <textarea
                  id="textarea"
                  v-model="text"
                  style="resize: none"
                  placeholder="Текст поста..."
                  @input="adjustTextareaHeight()"
                  class="w-full bg-black outline-none"
                ></textarea>
              </div>

              <div class="w-full">
                <div class="flex flex-col gap-2 py-1">
                  <div v-if="fileDisplay">
                    <img
                      class="mx-auto w-full mt-2 mr-2 rounded-lg"
                      :src="fileDisplay"
                      alt=""
                    />
                  </div>

                  <label for="fileInput">
                    <Icon
                      name="clarity:paperclip-line"
                      color="#fff"
                      size="25"
                    />
                    <input
                      type="file"
                      ref="file"
                      id="fileInput"
                      @input="onChange()"
                      hidden
                      accept=".jpg,.jpeg,.png"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        v-if="text"
        :disabled="isLoading"
        @click="createPost()"
        class="fixed bottom-0 font-bold text-lg w-full bg-black inline-block float-right p-4 border-t border-t-gray-700"
        :class="isLoading ? 'text-gray-600' : 'text-blue-600'"
      >
        <div v-if="!isLoading">Опубликовать</div>
        <div v-else class="flex items-center gap-2 justify-center">
          <Icon name="eos-icons:bubble-loading" size="25" />
          В процессе...
        </div>
      </button>
    </div>
  </div>
</template>
