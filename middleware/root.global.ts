export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/') {
    return navigateTo('/dashboard', { external: true })
  }
})
