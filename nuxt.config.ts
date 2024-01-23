// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/test-utils/module', '@vueuse/nuxt', 'pruvious'],
  pruvious: {
    api: {
      routes: {
        'pages.get': false,
        'previews.get': false,
        'robots.txt.get': false,
        'sitemap.xml.get': false,
      },
    },
    dashboard: {
      removeSiteStyles: false,
    },
    standardCollections: {
      pages: false,
      presets: false,
      previews: false,
      redirects: false,
      seo: false,
    },
    jwt: {
      secretKey: 'random-secret-key',
    },
    uploads: {
      maxFileSize: '92MB',
    },
  },
})
