<template>
  <div>
      {{ home.title }}<br/>
      <img :src="home.images[0]" style="width: 200px;"><br>
      {{ home.location.address }} {{ home.location.city }} {{ home.location.state}} <br>
      {{ home.guests }} guests <br>
      {{ home.pricePerNight }} / night <br>
  </div>
</template>

<script>
export default {
  name: "HomeCard",
  props: {
    home: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
