<template>
	<div id="imgPage">
		<el-carousel type="card" :autoplay="autoplay" :height="height">
			<el-carousel-item v-for="item in srcArray" :key="item.id">
				<h2 v-html="item.fileName"></h2>
				<img :src="item.src" :height="heightNum"/>
			</el-carousel-item>
		</el-carousel>
	</div>
</template>

<script>
	import { getDownloadUrl, fileQuery } from '../../api/api';

	export default {
		data() {
			return {
				autoplay: false,
				imgSrc: '',
				srcArray: [],
				fileList: [],
				height: '',
				heightNum: '200'
			}
		},
		methods: {},
		mounted() {
			this.heightNum = window.screen.availHeight * 0.7;
			this.height = this.heightNum + 'px';
			this.heightStyle = `{height: ${this.height}}`;
			this.heightNum = this.heightNum - 70;
			if (this.moreImg) {
				const param = {
					prjSN: this.prjSN,
					upLoadType: 'PROADDFILE'
				};
				fileQuery(param).then(resp => {

					if (resp.header.rspReturnCode !== '000000') {
						this.$message({
							message: resp.header.rspReturnMsg,
							type: 'error'
						});
						return;
					}

					resp.busFileList.map(item => {
						this.srcArray.push({
							id: item.id,
							src: getDownloadUrl(item.id, this.prjSN, 'id'),
							fileName: item.fileName
						}); 
					});
				});
			} else {
				this.srcArray = [
					{
						id: 1,
						src: getDownloadUrl(this.fileName, this.prjSN, 'fname'),
						fileName: ''
					}
				];
			}
			
		},
		props: ['fileName', 'prjSN', 'moreImg']
	}
</script>

<style lang="scss" scoped>
	#imgPage {
		width: 100%;
		overflow: auto;
		text-align: center;

		img {
			width: 80%;
		}

		.el-carousel__item h3 {
			color: #475669;
			font-size: 14px;
			opacity: 0.75;
			line-height: 200px;
			margin: 0;
		}
		
		.el-carousel__item:nth-child(2n) {
			background-color: #99a9bf;
		}
		
		.el-carousel__item:nth-child(2n+1) {
			background-color: #d3dce6;
		}
	}
</style>

