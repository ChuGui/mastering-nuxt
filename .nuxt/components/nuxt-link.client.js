import Vue from 'vue'

const requestIdleCallback = window.requestIdleCallback ||
  function (cb) {
    const start = Date.now()
    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
      })
    }, 1)
  }

const cancelIdleCallback = window.cancelIdleCallback || function (id) {
  clearTimeout(id)
}

const observer = window.IntersectionObserver && new window.IntersectionObserver((entries) => {
  entries.forEach(({ intersectionRatio, target: link }) => {
    if (intersectionRatio <= 0) {
      return
    }
    link.__prefetch()
  })
})

export default {
  name: 'NuxtLink',
  extends: Vue.component('RouterLink'),
  props: {
    prefetch: {
      type: Boolean,
      default: true
    },
    noPrefetch: {
      type: Boolean,
      default: false
    },
    prefetchedClass: {
      type: String,
      default: 'nuxt-link-prefetched'
    }
  },
  mounted () {
    if (this.prefetch && !this.noPrefetch) {
      this.handleId = requestIdleCallback(this.observe, { timeout: 2e3 })
    }
  },
  beforeDestroy () {
    cancelIdleCallback(this.handleId)

    if (this.__observed) {
      observer.unobserve(this.$el)
      delete this.$el.__prefetch
    }
  },
  methods: {
    observe () {
      // If no IntersectionObserver, avoid prefetching
      if (!observer) {
        return
      }
      // Add to observer
      if (this.shouldPrefetch()) {
        this.$el.__prefetch = this.prefetchLink.bind(this)
        observer.observe(this.$el)
        this.__observed = true
      } else {
        this.addPrefetchedClass()
      }
    },
    shouldPrefetch () {
      return this.getPrefetchComponents().length > 0
    },
    canPrefetch () {
      const conn = navigator.connection
      const hasBadConnection = this.$nuxt.isOffline || (conn && ((conn.effectiveType || '').includes('2g') || conn.saveData))

      return !hasBadConnection
    },
    getPrefetchComponents () {
      const ref = this.$router.resolve(this.to, this.$route, this.append)
      const Components = ref.resolved.matched.map(r => r.components.default)

      return Components.filter(Component => typeof Component === 'function' && !Component.options && !Component.__prefetched)
    },
    prefetchLink () {
      if (!this.canPrefetch()) {
        return
      }
      // Stop observing this link (in case of internet connection changes)
      observer.unobserve(this.$el)
      const Components = this.getPrefetchComponents()
      const promises = []

      for (const Component of Components) {
        const componentOrPromise = Component()
        if (componentOrPromise instanceof Promise) {
          componentOrPromise.catch(() => {})
          promises.push(componentOrPromise)
        }
        Component.__prefetched = true
      }

      return Promise.all(promises).then(() => this.addPrefetchedClass())
    },
    addPrefetchedClass () {
      if (this.prefetchedClass !== 'false') {
        this.$el.className = (this.$el.className + ' ' + this.prefetchedClass).trim()
      }
    }
  }
}
