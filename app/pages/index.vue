<script setup lang="ts">
import {onMounted} from "vue";
import Viewer from "~/components/viewer.vue";

onMounted(async () => {

})
</script>

<template>
<div class="d-flex p-4 text-body flex-column w-100 h-100 gap-3">
	<div class="d-flex">
		<h5>WGDashboard Demo</h5>
	</div>
	<Viewer></Viewer>
</div>
</template>

<style scoped>

</style>