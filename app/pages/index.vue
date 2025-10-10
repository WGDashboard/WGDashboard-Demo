<script setup lang="ts">
import {onMounted} from "vue";
import Viewer from "~/components/viewer.vue";

const minimize = ref(false)
const maximize = ref(false)
</script>

<template>
<div class="p-3 w-100 h-100 text-body"
     :class="{maximize: maximize}"
     id="windowContainer">
	<div class="w-100 h-100 rounded-4 shadow-lg bg-body-tertiary d-flex flex-column shadow"
	     :class="{minimize: minimize, maximize: maximize}"
	     id="window">
		<div class="banner bg-body-tertiary d-flex p-3 align-items-center rounded-top-4 gap-2">
			<div class="d-flex gap-2 d-none d-md-flex">
				<div class="dot bg-danger animate shadow"></div>
				<div class="dot bg-warning animate shadow" role="button" @click="minimize = !minimize"></div>
				<div class="dot bg-success animate shadow" role="button" @click="maximize = !maximize"></div>
			</div>
			<div class="bg-body-secondary px-3 py-2 rounded-4 d-flex gap-2 tab animate shadow flex-grow-1">
				<img src="https://wgdashboard-resources.tor1.cdn.digitaloceanspaces.com/Logos/Logo-2-128x128.png" width="20" height="20">
				<small>WGDashboard Demo</small>
			</div>
		</div>
		<Viewer class="viewer animate"></Viewer>
	</div>

</div>
</template>

<style scoped>
*{
	--animation-ease: cubic-bezier(0.83, 0.02, 0.1, 1.05)
}

.animate{
	opacity: 0;
}

.dot{
	height: 15px;
	width: 15px;
	border-radius: 100%;
}
#window, #windowContainer{
	transition: all 1s var(--animation-ease);
	animation: var(--animation-ease) 1s blurIn;
}

.dot.bg-danger{
	animation: var(--animation-ease) 1s blurIn forwards;
	animation-delay: 0.4s;
}
.dot.bg-warning{
	animation: var(--animation-ease) 1s blurIn forwards;
	animation-delay: 0.45s;
}
.dot.bg-success{
	animation: var(--animation-ease) 1s blurIn forwards;
	animation-delay: 0.5s;
}
.tab{
	animation: var(--animation-ease) 1s blurIn forwards;
	animation-delay: 0.55s;
}
.refresh{
	animation: var(--animation-ease) 1s blurIn forwards;
	animation-delay: 0.8s;
}

.viewer{
	animation: var(--animation-ease) 1s blurIn forwards;
	animation-delay: 0.6s;
}

@keyframes blurIn {
	0%{
		transform: scale(0.85);
		opacity: 0;

	}
	100%{
		transform: scale(1);
		opacity: 1;
	}
}


#window.minimize{
	transform: translateY(calc(100vh - 90px));
}

#window.maximize{
	border-radius: 0 !important;
}

#windowContainer.maximize{
	padding: 0 !important;
}
</style>