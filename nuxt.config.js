export default {
    components: true,
    head: {
        titleTemplate: "Mastering Nuxt: %s",
        htmlAttrs: {
            lang: "en"
        },
        bodyAttrs: {
            class:  ["my-style"]
        },
        meta: [{
            charset: 'utf-8'
        }]
    },
    router: {
        prefetchLinks: true,
        linkPrefetchedClass: 'nuxt-link-prefetched'
    },
    plugins: [
        '~/plugins/maps.client',
        '~/plugins/dataApi'
    ]
}
