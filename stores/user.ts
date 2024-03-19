import { defineStore } from 'pinia'
import type { Post } from '~/types'

export const useUserStore = defineStore('user', {
  state: () => ({
    posts: [] as Post[] | any,
    isMenuOverlay: false,
    isLogoutOverlay: false
  }),

  actions: {
    async getAllPosts() {
      const res = await useFetch('/api/get-all-posts')
      this.posts = res.data

      return res.data
    }
  }
})
