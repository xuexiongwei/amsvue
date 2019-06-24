<template>
	<div id="imgPage">
		<img :src="imgSrc"/>
	</div>
</template>

<script>
	import { getDownloadUrl } from '../../api/api';

	export default {
		data() {
			return {
				imgSrc: ''
			}
		},
		methods: {},
		mounted() {
			this.imgSrc = getDownloadUrl(this.fileName, this.prjSN);
		},
		props: ['fileName', 'prjSN']
	}
</script>

<style lang="scss" scoped>
	#imgPage {
		width: 100%;
		overflow: auto;
		text-align: center;
	}
</style>

