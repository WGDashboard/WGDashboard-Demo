import * as bootstrap from 'bootstrap'
import {defineNuxtPlugin} from "nuxt/app";

export default defineNuxtPlugin(() => {
	return {
		provide: {
			bootstrap: bootstrap
		}
	}
})