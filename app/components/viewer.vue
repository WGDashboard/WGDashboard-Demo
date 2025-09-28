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
	await fetch("/api/session?sessionId=" + encodeURIComponent(
		window.localStorage.getItem('sessionId') ?? ''
	)).then(res => res.json()).then((res: Session) => {
		session.value = res;
	})
	if (session.value.status){
		window.localStorage.setItem('sessionId', session.value.sessionData?.sessionId ?? '')
		requestedSession.value = true
		let interval = setInterval(async () => {
			await fetch("/api/isSessionAlive?sessionId=" + encodeURIComponent(session.value.sessionData?.sessionId ?? '')).then(res => res.json()).then(res => {
				if (res.status){
					clearInterval(interval)
					loadedSession.value = true
					loading.value = false
				}
			})
		}, 2000)
	}
}

onMounted(() => {
	// setTimeout(() => {
	// 	initSession()
	// }, 5000)
})

const sessionHref = computed(() => {
	if(session.value.status){
		return '//' + window.location.hostname + ':' + session.value.sessionData?.port
	}
})

</script>

<template>
	<div class="w-100 h-100 p-3 pt-0">
		<div class="bg-body-secondary w-100 h-100 d-flex rounded-3">
			<Transition name="fade" mode="out-in">
				<div class="m-auto d-flex flex-column gap-3" v-if="loading">
					<div>
						<div class="d-flex gap-2 flex-column align-items-center mb-2">
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
				<iframe :src="sessionHref" class="w-100 h-100 rounded-3" v-else></iframe>
			</Transition>
		</div>
	</div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: all 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	filter: blur(8px);
	transform: scale(0.9);
}


</style>