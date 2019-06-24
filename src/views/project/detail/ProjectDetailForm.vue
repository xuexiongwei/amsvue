<template>
	<section>

		<!--编辑界面-->
		<el-dialog :title="title" :visible.sync="show" :close-on-click-modal="false" :show-close="false" top="3vh">
			<el-form :model="formData" label-width="200px" :rules="formRules" ref="formData">
				<el-form-item label="许可证号" prop="prjSN">
					<el-autocomplete v-if="!!formData.id" class="inline-input" v-model="formData.prjSN" style="width:100%"
						placeholder="请输入内容" :trigger-on-focus="false" readonly></el-autocomplete>
					<el-autocomplete v-if="!formData.id" class="inline-input" v-model="formData.prjSN" :fetch-suggestions="querySearch" style="width:100%"
						placeholder="请输入内容" :trigger-on-focus="false"></el-autocomplete>
				</el-form-item>
				<el-form-item label="建筑序号" prop="serialNumber">
					<el-input-number v-if="!formData.id" v-model="formData.serialNumber" :min="1" style="width:100%" :step="1" :precision="0"></el-input-number>
					<el-input v-if="!!formData.id" v-model="formData.serialNumber" auto-complete="off" readonly></el-input>
				</el-form-item>
				<el-form-item label="建筑功能" prop="serialFunct">
					<el-input v-model="formData.serialFunct" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="地上建筑面积（平方米）" prop="aboveGroundArea">
					<el-input-number v-model="formData.aboveGroundArea" :precision="2" :step="0.1" :min="0"  style="width:100%"></el-input-number>
				</el-form-item>
				<el-form-item label="地下建筑面积（平方米）" prop="underGroundArea">
					<el-input-number v-model="formData.underGroundArea" :precision="2" :step="0.1" :min="0" style="width:100%"></el-input-number>
				</el-form-item>
				<el-form-item label="混合建筑面积（平方米）" prop="blendArea">
					<el-input-number v-model="formData.blendArea" :precision="2" :step="0.1" :min="0" style="width:100%"></el-input-number>
				</el-form-item>
				<el-form-item label="地上建筑长度（米）" prop="aboveGroundLen">
					<el-input-number v-model="formData.aboveGroundLen" :min="0" style="width:100%" :step="0.1" :precision="2"></el-input-number>
				</el-form-item>
				<el-form-item label="一级分类" prop="prjClasfiName1">
					<el-select v-model="formData.prjClasfiName1" filterable placeholder="请选择一级分类" 
						style="width: 100%;" @change="prjClasfiName1Change">
						<el-option v-for="item in prjClasfiName1Options" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="二级分类" prop="prjClasfiName2">
					<el-select v-model="formData.prjClasfiName2" filterable placeholder="请选择二级分类" 
						style="width: 100%;" @change="prjClasfiName2Change">
						<el-option v-for="item in prjClasfiName2Options" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="三级分类" prop="prjClasfiName3">
					<el-select v-model="formData.prjClasfiName3" filterable placeholder="请选择三级分类" 
						style="width: 100%;" @change="prjClasfiName3Change">
						<el-option v-for="item in prjClasfiName3Options" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="四级分类" prop="prjClasfiName4">
					<el-select v-model="formData.prjClasfiName4" filterable placeholder="请选择四级分类" style="width: 100%;" 
						@change="prjClasfiName4Change">
						<el-option v-for="item in prjClasfiName4Options" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="五级分类" prop="prjClasfiName5">
					<el-select v-model="formData.prjClasfiName5" filterable placeholder="请选择五级分类" style="width: 100%;">
						<el-option v-for="item in prjClasfiName5Options" :key="item.id" :label="item.name" :value="item.code"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="cancelHandle">取消</el-button>
				<el-button type="primary" @click.native="submitHandler" :loading="formLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../../common/js/util';
	import {createOrUpdateProjectDetail, getPrjClasfiNameByParentId, queryDicByProejctDetailId, queryDataByLike } from '../../../api/api';

	export default {
		data() {
			return {
				show: true,
				formLoading: false,
				title: '',
				prjClasfiName1Options: [],
				prjClasfiName2Options: [],
				prjClasfiName3Options: [],
				prjClasfiName4Options: [],
				prjClasfiName5Options: [],
				formRules: {
					prjSN: [
						{ required: true,  message: '不能为空', trigger: 'blur' }
					],
					serialNumber: [
						{ required: true,  message: '不能为空', trigger: 'blur' }
					],
					serialFunct: [
						{ required: true, message: '不能为空', trigger: 'blur' },
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' },
						{ max: 100, message: '最大长度100', trigger: 'blur' }
					],
					prjClasfiName1: [
						{ required: true, message: '不能为空', trigger: 'blur' }
					],
					prjClasfiName2: [
						{ required: true, message: '不能为空', trigger: 'blur' }
					],
					prjClasfiName3: [
						{ required: true, message: '不能为空', trigger: 'blur' }
					],
					prjClasfiName4: [
						{ required: true, message: '不能为空', trigger: 'blur' }
					],
					prjClasfiName5: [
						{ required: true, message: '不能为空', trigger: 'blur' }
					]
				},
				formData: {
					prjSN: '',
					serialFunct: '',
					prjClasfiName1: '',
					prjClasfiName2: '',
					prjClasfiName3: '',
					prjClasfiName4: '',
					prjClasfiName5: ''

				}
			}
		},
		methods: {
			querySearch(queryString, callback) {
				queryDataByLike({tab: 'xmjbxx', key: 'prjSN', val: queryString}).then(resp => {

					if (resp.header.rspReturnCode !== '000000') {
						this.$message({message: resp.header.rspReturnMsg, type: 'error'});
						return;
					}

					callback(resp.list.map(data => { return {value: data, address: data}; }));

				});
			},
			prjClasfiName1Change(value) {
				this.getPrjClasfiNameByParentId(value, '2');
				this.formData.prjClasfiName2 = '';
				this.formData.prjClasfiName3 = '';
				this.formData.prjClasfiName4 = '';
				this.formData.prjClasfiName5 = '';
			},
			prjClasfiName2Change(value) {
				this.getPrjClasfiNameByParentId(value, '3');
				this.formData.prjClasfiName3 = '';
				this.formData.prjClasfiName4 = '';
				this.formData.prjClasfiName5 = '';
			},
			prjClasfiName3Change(value) {
				this.getPrjClasfiNameByParentId(value, '4');
				this.formData.prjClasfiName4 = '';
				this.formData.prjClasfiName5 = '';
			},
			prjClasfiName4Change(value) {
				this.getPrjClasfiNameByParentId(value, '5');
				this.formData.prjClasfiName5 = '';
			},
			getPrjClasfiNameByParentId(pId, type) {

				getPrjClasfiNameByParentId({type: 'FJ', parentID: pId}).then(resp => {
					
					if (resp.header.rspReturnCode !== '000000') {
						respMsg.type = 'error';
						respMsg.message = resp.header.rspReturnMsg;
						this.$message(respMsg);
						return;
					}

					this[`prjClasfiName${type}Options`] = resp.classifiDicList;

				});
			},
			submitHandler: function () {
				this.$refs.formData.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.formLoading = true;
							let para = {
								prjSN: this.formData.prjSN,
								serialNumber: this.formData.serialNumber,
								serialFunct: this.formData.serialFunct,
								aboveGroundArea: this.formData.aboveGroundArea,
								underGroundArea: this.formData.underGroundArea,
								blendArea: this.formData.blendArea,	
								aboveGroundLen: this.formData.aboveGroundLen,
								prjClasfiCode: this.formData.prjClasfiName5
							};
							if (!!this.formData.id) {
								para.id = this.formData.id;
							}
							
							createOrUpdateProjectDetail(para).then((resp) => {
								this.formLoading = false;
								const respMsg= {message: '', type: ''}
								

								if (resp.header.rspReturnCode !== '000000') {
									respMsg.type = 'error';
									respMsg.message = resp.header.rspReturnMsg;
									this.$message(respMsg);
									return;
								}

								this.$refs['formData'].resetFields();
								respMsg.type = 'success';
								respMsg.message = (typeof(this.formData.id) !== 'undefined') ? '修改项目明细信息成功' : '新增项目明细信息成功';
								this.callback(respMsg);
							});
						});
					}
				});
			},
            cancelHandle() {
                this.callback();
            }
		},
		mounted() {
			if (this.formTemData && !!this.formTemData.id) {
				this.title = '修改项目明细信息';
				queryDicByProejctDetailId({id: this.formTemData.id}).then(resp => {

					if (resp.header.rspReturnCode !== '000000') {
						respMsg.type = 'error';
						respMsg.message = resp.header.rspReturnMsg;
						this.$message(respMsg);
						return;
					}

					this.formData.id = this.formTemData.id;
					this.formData.prjSN = this.formTemData.prjSN;
					this.formData.serialNumber = this.formTemData.serialNumber;
					this.formData.serialFunct = this.formTemData.serialFunct;
					this.formData.aboveGroundArea = this.formTemData.aboveGroundArea;
					this.formData.underGroundArea = this.formTemData.underGroundArea;
					this.formData.blendArea = this.formTemData.blendArea;
					this.formData.aboveGroundLen = this.formTemData.aboveGroundLen;
					
					for (let i = 1; i < 6; i++) {
						this[`prjClasfiName${i}Options`] = resp.viewObj[`prjClasfiName${i}List`] || [];
						const obj = resp.viewObj[`prjClasfiName${i}Obj`];
						if (obj) {
							if (i === 5) {
								this.formData[`prjClasfiName${i}`] = obj.code;
							} else {
								this.formData[`prjClasfiName${i}`] = obj.id;
							}
							
						}
					}

				});
			} else {
				this.title = '新增项目明细信息';
				this.getPrjClasfiNameByParentId('', '1');
			}			
		},
        props: ['formTemData', 'callback']
	}

</script>

<style scoped></style>