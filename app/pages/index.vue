<script setup lang="ts">
import {onMounted} from "vue";

onMounted(async () => {
	await fetch("/api/session")
})
</script>

<template>
<div class="d-flex p-4 text-body flex-column w-100 h-100 gap-3">
	<div class="d-flex">
		<h5>WGDashboard Demo</h5>
	</div>
	<div class="w-100 h-100 rounded-3 shadow-lg bg-body-tertiary">
		12
	</div>
</div>
</template>

<style scoped>

</style>