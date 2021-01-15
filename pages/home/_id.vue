<template>
  <div>
    <div v-if="$nuxt.isOffline">TES HORSLINGNE</div>
    <div style="display: flex">
      <img v-for="image in home.images" :key="image" alt="something descriptive..." :src="image" width="200"
           height="150">
    </div>
    {{ home.title }}<br>
    ${{ home.pricePerNight }} / night <br>
    <img src="/images/marker.svg" alt="location_icon" width="20" height="20">
    {{ home.location.address }} {{ home.location.city }} {{ home.location.state }} {{ home.location.country }} <br>
    <img src="/images/star.svg" alt="star_icon" width="20" height="20"> {{ home.reviewValue }} <br>
    {{ home.guests }} guests, {{ home.bedroom }} rooms, {{ home.beds }}, {{ home.bathrooms }} bath <br>
    <div style="height: 800px; width: 800px" ref="map"></div>

    <div v-for="review in reviews" :key="review.objectID">
      <img :src="review.reviewer.image" alt=""><br>
      {{ review.reviewer.name }}<br>
      {{ formatDate(review.date) }}<br>
      <short-text :text="review.comment " :target="150"></short-text>
      <br>
    </div>

    <div>
      <img :src="user.image"><br>
      {{ user.name }} <br>
      {{ formatDate(user.joined) }} <br>
      {{ user.reviewCount }} <br>
      {{ user.description }}
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: this.home.title
    }
  },
  mounted() {
    this.$maps.showMap(this.$refs.map, this.home._geoloc.lat, this.home._geoloc.lng)
  },
  async asyncData({params, $dataApi, error}) {

    const responses = await Promise.all([
      $dataApi.getHome(params.id),
      $dataApi.getReviewsByHomeId(params.id),
      $dataApi.getUserByHomeId(params.id),
    ])

    const badResponse = responses.find((response)=> !response.ok)

    return {
      home: responses[0].json,
      reviews: responses[1].json.hits,
      user: responses[2].json.hits[0],
    }

    return {
      home: homeResponse.json,
      reviews: reviewResponse.json.hits,
      user: userResponse.json.hits[0],
    }
  },
  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return date.toLocaleDateString('fr-FR', {month: 'long', year: 'numeric', day: 'numeric'})
    }
  }
}
</script>

<style scoped>

</style>
