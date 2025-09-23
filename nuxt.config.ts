// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: [
        'nuxt-cron'
    ],
    cron: {
        runOnInit: true,
        jobsDir: 'cron',
        timeZone: "America/Los_Angeles"
    },
})
