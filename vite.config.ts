/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { basketApi } from './server/basket-api'
import { discountApi } from './server/discount-api'

export default defineConfig({
  plugins: [vue(), basketApi(), discountApi()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
