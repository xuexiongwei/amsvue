<template>
	<el-row id="uploadPage" v-loading="loading"
		element-loading-text="文件上传中"
		element-loading-spinner="el-icon-loading"
		element-loading-background="rgba(0, 0, 0, 0.8)">
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<div class="filter-item">
				<label>上传类型</label>
				<div>
					<el-select v-model="param.upLoadType" placeholder="请选择上传类型" @change="upLoadTypeChange">
						<el-option v-for="item in uploadTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
			</div>
			<div class="filter-item" v-if="param.upLoadType === 'SAVE'">
				<label>许可证号</label>
				<div>
					<el-select v-model="param.prjSN" filterable remote reserve-keyword placeholder="请录入许可证号" 
						:remote-method="filterPrjSNMethod" collapse-tags :title="param.prjSN" style="width:100%">
						<el-option v-for="item in prjSNOptions" :key="item" :label="item" :value="item"></el-option>
					</el-select>
				</div>
			</div>
			<div class="filter-item" v-if="!!param.upLoadType">
				<label>选择上传文件</label>
				<div>
					<el-upload ref="upload" multiple :action="uploadUrl" :file-list="fileList" :data="param" name="files" :auto-upload="false"
	
						:on-success="successHadnler" :accept="acceptStr" :on-change="handleChange" :on-remove="removeHandler">
						<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
  						<el-button style="margin-left: 10px;" size="small" type="success" :disabled="!isSubmit" @click="submitUpload">上传文件</el-button>
						  <el-button style="margin-left: 10px;" size="small" type="success" @click="clearAll">清空上传记录</el-button>
						<div slot="tip" class="el-upload__tip" v-text="tipMsg"></div>
					</el-upload>
				</div>
			</div>
			<div v-if="isShowRespond" class="toolbar" style="padding-bottom: 0px;">
				<p v-for="(msg, index) in errorMsg" :id="`msg_${index}`" class="error-msg" >
					<i class="fa fa-chevron-up" @click="toggleMsg(index)"></i>
					<span v-html="msg"></span>
				</p>
			</div>
		</el-col>
	</el-row>
</template>

<script>
	import { getUploadUrl, queryDataByLike } from '../api/api';

	export default {
		data() {
			return {
				uploadTypeOptions: [
					{label: '项目信息/地图数据', value: 'ANALYSIS'},
					{label: '批文图片', value: 'SAVE'},
					{label: '字典信息', value: 'DIC'}
				],
				prjSNOptions: [],
				acceptStr: '',
				uploadUrl: getUploadUrl(),
				fileList: [],
				tipMsg: '',
				param: {
					upLoadType: '',
					prjSN: ''
				},
				errorMsg: [],
				isShowRespond: false,
				isSubmit: true,
				loading: false
			}
		},
		methods: {
			clearAll() {
				this.isSubmit = true;
				this.isShowRespond = false;
				this.errorMsg = [];
				this.$refs.upload.clearFiles();
			},
			handleChange(file, fileList) {
				const names1 = fileList.map(item => item.name);
				const names2 = Array.from(new Set(names1));
				if (names1.length !== names2.length) {
					this.$message({message: '您上传的附件中存在重名的附件，请确认无误后，再进行上传...', type: 'error'});
						this.isSubmit = false;
						return;
				}
			},
			removeHandler(file, fileList) {
				const names1 = fileList.map(item => item.name);
				const names2 = Array.from(new Set(names1));
				if (names1.length === names2.length) {
					this.isSubmit = true;
				}
			},
			toggleMsg(index) {
				const msgDom = document.getElementById('msg_' + index);
				if (msgDom.querySelector('i').classList[1] === 'fa-chevron-up') {
					msgDom.className = 'error-msg hide';
					msgDom.querySelector('i').className = 'fa fa-chevron-down';
				} else {
					msgDom.className = 'error-msg';
					msgDom.querySelector('i').className = 'fa fa-chevron-up';
				}
			},
			filterPrjSNMethod(query) {
				if (!query) {
					return;
				}

				queryDataByLike({tab: 'xmjbxx', key: 'prjSN', val: query}).then(resp => {
					if (resp.header.rspReturnCode !== '000000') {
						this.$message({message: resp.header.rspReturnMsg, type: 'error'});
						return;
					}
					this.prjSNOptions = resp.list;
				});
			},
			upLoadTypeChange(val) {
				this.isShowRespond = false;
				this.errorMsg = [];
				if (this.$refs.upload) {
					this.$refs.upload.clearFiles();
				}
				
				if (val === 'ANALYSIS') {
					this.acceptStr = '.xlsx,.xls,.dxf';
					this.tipMsg = '支持excel,dxf格式(dxf必须以许可证号命名)';
				} else if (val === 'SAVE') {
					this.acceptStr = '.png';
					this.tipMsg = '支持png格式(png必须以文书名命名)';
				} else if (val === 'DIC') {
					this.acceptStr = '.xlsx,.xls';
					this.tipMsg = '支持excel格式';
				}
			},
			submitUpload() {
				if ( this.param.upLoadType === 'SAVE'&& !this.param.prjSN) {
					this.$message({ message: '请您先输入许可证号', type: 'error' });
					return;
				}
				const readyFiles = this.$refs.upload.uploadFiles.filter(item => item.status === 'ready');;
				if (readyFiles && readyFiles.length) {
					this.loading = true;
				} else {
					this.$message({ message: '上传列表中不存在未上传的文件', type: 'error' });
					return;
				}
				
				this.isShowRespond = true;
				this.$refs.upload.submit();
				
				
			},
			successHadnler(response, file, fileList) {
				if (response.header.rspReturnCode === 'E') {
					this.errorMsg.push(response.header.rspReturnMsg);
					file.status = 'fail';
				} else {
					file.status = 'success';
				}
				
				const loadingFiles = fileList.filter(item => item.status === 'uploading');
				if (!loadingFiles || loadingFiles.length === 0) {
					this.loading = false;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	#uploadPage {
		.filter-item {
			padding: 8px 40px;
			label {
				float: left;
				display: inline-block;
				height: 19px;
				padding: 11px 10px;
				width: 100px;
			}

			> div {
				display: inline-block;
				.el-upload__tip {
					color: red;
				}
			}
		}

		.error-msg {
			width: 80%;
			color: red;
			line-height: 30px;
			border: 1px solid black;
			position: relative;
			height: 200px;
			overflow: auto;
			transition: height 1s;
			-moz-transition: height 1s;	/* Firefox 4 */
			-webkit-transition: height 1s;	/* Safari 和 Chrome */
			-o-transition: height 1s;	/* Opera */

			i {
				position: absolute;
				color: #000;
				cursor: pointer;
				top: 5px;
    			right: 5px;
			}

			&.hide {
				height: 30px;
			}
		}
	}
</style>
