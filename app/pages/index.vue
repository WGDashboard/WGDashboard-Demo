<script setup lang="ts">
import {onMounted} from "vue";
import Viewer from "~/components/viewer.vue";

onMounted(async () => {

})
</script>

<template>
<div class=" p-4 w-100 h-100 text-body">
	<div class="w-100 h-100 rounded-3 shadow-lg bg-body-tertiary d-flex flex-column">
		<div class="banner bg-body-tertiary d-flex px-3 py-2 align-items-center rounded-3 gap-3">
			<div class="d-flex gap-2">
				<div class="dot bg-danger"></div>
				<div class="dot bg-warning"></div>
				<div class="dot bg-success"></div>
			</div>
			<div class="bg-body-secondary px-3 py-2 rounded-3 d-flex gap-2">
				<img src="https://wgdashboard-resources.tor1.cdn.digitaloceanspaces.com/Logos/Logo-2-128x128.png" width="20" height="20">
				<small>WGDashboard Demo</small>
			</div>
			<div class="btn bg-body-secondary px-3 py-2 rounded-3 d-flex gap-2 ms-auto">
				<small>
					<i class="bi bi-arrow-clockwise"></i>
				</small>
			</div>
		</div>
		<Viewer></Viewer>
	</div>

</div>
</template>

<style scoped>
.banner{

}
.dot{
	height: 15px;
	width: 15px;
	border-radius: 100%;
}
</style>