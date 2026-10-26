<script setup lang="ts">
// The app shell. Build the basket widget inside the container below.
</script>

<template>
  <main class="page">
    <div class="container">
      <h1 class="brand">Emberforge</h1>
      <!-- TODO: your basket widget goes here -->
    </div>
  </main>
</template>

<style scoped lang="scss">
@use './styles/tokens' as *;

.page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding-top: $space-7;
}

.container {
  width: 480px;
}

.brand {
  color: $color-text-primary;
  font-size: $text-lg;
  font-weight: 700;
  margin-bottom: $space-5;
}
</style>
