<script setup lang="ts">
import type {Session} from "~~/interfaces/session";
import {computed, onMounted, ref} from "vue";
import type { Ref } from 'vue'

const loading = ref(true)
const requestedSession = ref(false)
const loadedSession = ref(false)
const session = ref<Session>({
	status: false,
	sessionData: null
})

const initSession = async () => {
	await fetch("/api/session").then(res => res.json()).then((res: Session) => {
		session.value = res;
	})
	if (session.value.status){
		requestedSession.value = true
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), 1000)
		setTimeout(() => {
			let interval: NodeJS.Timeout = setInterval(async () => {
				await fetch('//' + window.location.hostname + ':' + session.value.sessionData?.port, {
					signal: controller.signal
				}).catch((e) => {

				}).finally(() => {
					clearInterval(interval)
					loadedSession.value = true
					loading.value = false
				})
				}, 10000)
		}, 20000)
	}
}

onMounted(() => {
	setTimeout(() => {
		initSession()
	}, 5000)
})

const sessionHref = computed(() => {
	if(session.value.status){
		return '//' + window.location.hostname + ':' + session.value.sessionData?.port
	}
})

</script>

<template>
	<div class="w-100 h-100 rounded-3 shadow-lg bg-body-tertiary d-flex">
		<div class="m-auto d-flex flex-column gap-3" v-if="loading">
			<div >
				<div class="d-flex gap-2 flex-column align-items-center">
					<div class="spinner-border" style="width: 50px; height: 50px"></div>
				</div>
				<p v-if="!requestedSession && !loadedSession">
					Requesting Demo...
				</p>
				<p v-if="requestedSession && !loadedSession">
					Loading Demo...
				</p>
			</div>

		</div>
		<iframe :src="sessionHref" class="w-100 h-100" v-else></iframe>
	</div>
</template>

<style scoped>

</style>