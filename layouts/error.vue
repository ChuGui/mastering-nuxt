<template>
<div style="text-align: center">
  <img src="https://media.tenor.com/images/4696cc1753dee5122e5648b71b6268c3/tenor.gif" alt="gif">
  <h1>{{ error.message }} {{ error.statusCode }}</h1>
  
</div>
</template>

<script>
export default {
    head() {
      return {
        title: 'A problem!!',
      }
    },
  props: {
    error: {
      type: Object,
      required: true,
    }
  }
}
</script>
