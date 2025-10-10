<script setup lang="ts">

</script>

<template>
<div class="d-flex gap-2">
	<img
		class="rounded-3"
		src="https://wgdashboard-resources.tor1.cdn.digitaloceanspaces.com/Logos/Logo-2-128x128.png" width="50" height="50">
	<div class="d-flex flex-column" style="gap: 10px;">
		<div class="placeholder-t placeholder1"></div>
		<div class="placeholder-t placeholder2"></div>
	</div>
</div>
</template>

<style scoped>
.placeholder-t{
	height: 20px;
	min-width: 100px;
	background: #474747;
	border-radius: 5px;
	animation: 3s ease-in-out load infinite;
}

@keyframes load {
	0%{
		width: 20px;
	}
	50%{
		width: 200px;
	}
	100%{
		width: 20px;
	}
}
</style>