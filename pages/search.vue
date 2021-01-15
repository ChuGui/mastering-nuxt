<template>
  <div>
    Results for: {{ label }}<br/>
    <div style="height: 800px; width: 800px; float: right;" ref="map"></div>
    <div v-if="homes.length > 0">
      <nuxt-link :to="`/home/${home.objectID}`" v-for="home in homes" :key="home.objectID">
        <HomeRow  :home="home"/>
      </nuxt-link>
    </div>
    <div v-else>
      No result found
    </div>
  </div>
</template>

<script>
export default {
  head () {
    return {
      title: `Homes around ${this.label}`
    }
  },
  mounted() {
    this.updateMap()
  },
  methods: {
    updateMap(){
      this.$maps.showMap(this.$refs.map, this.lat, this.lng, this.getHomeMarkers())
    },
    getHomeMarkers(){
      return this.homes.map((home) => {
        return {
          ...home._geoloc,
          pricePerNight: home.pricePerNight,
        }
      })
    }
  },
  async beforeRouteUpdate(to, from, next) {
    const data = await this.$dataApi.getHomeByLocation(to.query.lat, to.query.lng)
    this.homes = data.json.hits
    this.label = to.query.label
    this.lat = to.query.lat
    this.lng = to.query.lng
    this.updateMap()
    next()
  },
  async asyncData({query, $dataApi}) {
    const data = await $dataApi.getHomeByLocation(query.lat, query.lng)

    return {
      homes: data.json.hits,
      label: query.label,
      lat: query.lat,
      lng: query.lng,
    }
  }
}
</script>

<style scoped>

</style>
