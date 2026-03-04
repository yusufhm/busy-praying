export const useThemeStore = defineStore('theme', {
  state: () => ({
    preference: 'light', // 'light' | 'dark' | 'system'
  }),
  persist: true,
})
