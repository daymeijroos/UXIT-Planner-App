/** @type {import('next').NextConfig} */
const { runtimeCaching } = require('./cache.js')
const withPWA = require('next-pwa')({
  dest: 'public',
  runtimeCaching,
  cacheStartUrl: false,
  cleanupOutdatedCaches: true,
  customWorkerDir: 'serviceworker'
})

module.exports = withPWA({
  reactStrictMode: true,
  /* If trying out the experimental appDir, comment the i18n config out
   * @see https://github.com/vercel/next.js/issues/41980 */
})
