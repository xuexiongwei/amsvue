<template>
	<section>

		<!--编辑界面-->
		<el-dialog :title="title" :visible.sync="show" :close-on-click-modal="false" :show-close="false" top="3vh" >
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
				<el-form-item label="项目性质" prop="prjNature">
					<el-input v-model="formData.prjNature" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="规划项目/人防" prop="prjAttr">
					<template>
						<el-radio v-model="formData.prjAttr" :label="prjAttrOptions[0]">{{prjAttrOptions[0]}}</el-radio>
						<el-radio v-model="formData.prjAttr" :label="prjAttrOptions[1]">{{prjAttrOptions[1]}}</el-radio>
					</template>
				</el-form-item>
				<el-form-item label="平时用途" prop="peacetimeUses">
					<el-input v-model="formData.peacetimeUses" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="地上层数" prop="aboveGroundLev">
					<el-input-number v-model="formData.aboveGroundLev" :min="0" :precision="2" :step="0.1" style="width:100%"></el-input-number>
				</el-form-item>
				<el-form-item label="地下层数" prop="underGroundLev">
					<el-input-number v-model="formData.underGroundLev" :min="0" :precision="2" :step="0.1" style="width:100%"></el-input-number>
				</el-form-item>
				<el-form-item label="地上高度（米）" prop="aboveGroundHet">
					<el-input-number v-model="formData.aboveGroundHet" :min="0" :precision="2" :step="0.1" style="width:100%"></el-input-number>
				</el-form-item>
				<el-form-item label="地下高度（米）" prop="underGroundHet">
					<el-input-number v-model="formData.underGroundHet" :max="0" :precision="2" :step="0.1" style="width:100%"></el-input-number>
				</el-form-item>
				<el-form-item label="栋数" prop="buildings">
					<el-input-number v-model="formData.buildings" :min="1" style="width:100%" :step="1" :precision="0"></el-input-number>
				</el-form-item>
				<el-form-item label="住房套数" prop="housingStockNum">
					<el-input-number v-model="formData.housingStockNum" :min="1" style="width:100%" :step="1" :precision="0"></el-input-number>
				</el-form-item>
				<el-form-item label="结构类型" prop="strucType">
					<el-input v-model="formData.strucType" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="验线文号" prop="checkDocSN">
					<el-input v-model="formData.checkDocSN" auto-complete="off" @change="checkDocSNChange"></el-input>
				</el-form-item>
				<el-form-item label="验线日期" prop="checkDocDate">
					<el-date-picker v-model="formData.checkDocDate" align="right" type="date" placeholder="选择日期" value-format="yyyy/MM/dd" format="yyyy/MM/dd"  style="width:100%"></el-date-picker>
				</el-form-item>
				<el-form-item label="验收文号" prop="checkSN">
					<el-input v-model="formData.checkSN" auto-complete="off" @change="checkSNChange"></el-input>
				</el-form-item>
				<el-form-item label="验收日期" prop="checkDate">
					<el-date-picker v-model="formData.checkDate" align="right" type="date" placeholder="选择日期" value-format="yyyy/MM/dd" format="yyyy/MM/dd"  style="width:100%"></el-date-picker>
				</el-form-item>
				<el-form-item label="撤（注）销证号" prop="cancelSN">
					<el-input v-model="formData.cancelSN" auto-complete="off" @change="cancelSNChange"></el-input>
				</el-form-item>
				<el-form-item label="撤（注）销日期" prop="cancelDate">
					<el-date-picker v-model="formData.cancelDate" align="right" type="date" placeholder="选择日期" value-format="yyyy/MM/dd" format="yyyy/MM/dd"  style="width:100%"></el-date-picker>
				</el-form-item>
				<el-form-item label="影像判读结果" prop="imgJudgeRes">
					<el-input v-model="formData.imgJudgeRes" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="代征用地情况" prop="exproprInfo">
					<el-input v-model="formData.exproprInfo" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" v-model="formData.remark" :autosize="{ minRows: 4, maxRows: 6}" auto-complete="off"></el-input>
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
	import { createOrUpdateProjectAttribute, queryDataByLike } from '../../../api/api';

	export default {
		data() {
			return {
				show: true,
				formLoading: false,
				title: '',
				prjAttrOptions: ['规划项目性质：', '人防工程情况：'],
				formRules: {
					prjSN: [
						{ required: true,  message: '不能为空', trigger: 'blur' }
					],
					serialNumber: [
						{ required: true,  message: '不能为空', trigger: 'blur' }
					],
					prjNature: [
						{ required: true, message: '不能为空', trigger: 'blur' },
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' },
						{ max: 200, message: '最大长度200', trigger: 'blur' }
					],
					prjAttr: [
						{ required: true, message: '不能为空', trigger: 'blur' }
					],
					peacetimeUses: [
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' },
						{ max: 100, message: '最大长度100', trigger: 'blur' }
					],
					strucType: [
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' },
						{ max: 100, message: '最大长度100', trigger: 'blur' }
					],
					checkDocSN: [
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' },
						{ max: 50, message: '最大长度50', trigger: 'blur' }
					],
					checkDocDate: [],
					checkSN: [
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' },
						{ max: 50, message: '最大长度50', trigger: 'blur' }
					],
					checkDate: [],
					cancelSN: [
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' },
						{ max: 50, message: '最大长度50', trigger: 'blur' }
					],
					cancelDate: [],
					imgJudgeRes: [
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' },
						{ max: 200, message: '最大长度200', trigger: 'blur' }
					],
					exproprInfo: [
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' },
						{ max: 200, message: '最大长度200', trigger: 'blur' }
					],
					remark: [
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' },
						{ max: 1000, message: '最大长度1000', trigger: 'blur' }
					]
				}
			}
		},
		methods: {
			checkDocSNChange(value) {
				if (!!value) {
					this.$refs.formData.rules.checkDocDate = [{ required: true,  message: '不能为空', trigger: 'blur' }];
				} else {
					this.$refs.formData.rules.checkDocDate = [];
				}
			},
			checkSNChange(value) {
				if (!!value) {
					this.$refs.formData.rules.checkDate = [{ required: true,  message: '不能为空', trigger: 'blur' }];
				} else {
					this.$refs.formData.rules.checkDate = [];
				}
			},
			cancelSNChange(value) {
				if (!!value) {
					this.$refs.formData.rules.cancelDate = [{ required: true,  message: '不能为空', trigger: 'blur' }];
				} else {
					this.$refs.formData.rules.cancelDate = [];
				}
			},
			querySearch(queryString, callback) {
				queryDataByLike({tab: 'xmjbxx', key: 'prjSN', val: queryString}).then(resp => {

					if (resp.header.rspReturnCode !== '000000') {
						this.$message({message: resp.header.rspReturnMsg, type: 'error'});
						return;
					}

					callback(resp.list.map(data => { return {value: data, address: data}; }));

				});
			},
			submitHandler: function () {
				this.$refs.formData.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.formLoading = true;
							let para = Object.assign({}, this.formData);
							createOrUpdateProjectAttribute(para).then((resp) => {
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
								respMsg.message = (typeof(this.formData.id) !== 'undefined') ? '修改项目属性信息成功' : '新增项目属性信息成功';
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
			this.title = (!!this.formData.id) ? '修改项目属性信息' : '新增项目属性信息';
		},
		updated() {
			this.checkDocSNChange(this.formData.checkDocSN);
			this.checkSNChange(this.formData.checkSN);
			this.cancelSNChange(this.formData.cancelSN);
		},
        props: ['formData', 'callback']
	}

</script>

<style scoped></style>