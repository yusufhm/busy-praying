<template>
  <v-app>
    <v-main>
      <v-container>
        <h1>{{ title }}</h1>
        <v-btn variant="text" @click="clearError({ redirect: '/' })">Home page</v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
const props = defineProps({ error: Object })

const title =
  props.error?.statusCode === 404 ? '404 Not Found' : 'An error occurred'

useHead({ title })
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
