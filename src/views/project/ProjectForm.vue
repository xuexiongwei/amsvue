<template>
	<section id="projectPage">

		<!--编辑界面-->
		<el-dialog :title="title" :visible.sync="show" :close-on-click-modal="false" :show-close="false" top="3vh">
			<el-form :model="formData" label-width="150px" :rules="formRules" ref="formData" size="medium">
				<el-form-item label="许可证号" prop="prjSN">
					<el-input v-if="!!formData.id" v-model="formData.prjSN" auto-complete="off" readOnly></el-input>
					<el-input v-if="!formData.id" v-model="formData.prjSN" auto-complete="off" @change="prjSNChange"></el-input>
				</el-form-item>
				<el-form-item label="建设单位" prop="prjUnit">
					<el-input v-model="formData.prjUnit" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="建设位置" prop="prjAdrDetail">
					<el-input placeholder="请输入内容" v-model="formData.prjAdrDetail" class="input-with-select">
						<el-select v-model="formData.prjAdrCode" filterable slot="prepend" placeholder="请选择">
							<el-option v-for="item in prjAdrCodeOptons" :key="item.id" :label="item.name" :value="item.code"></el-option>
						</el-select>
					</el-input>
				</el-form-item>
				<el-form-item label="旧建设位置">
					<span style="width: 100%;display: inline-block;overflow: auto;white-space: nowrap;">{{formData.prjAdr}}</span>
				</el-form-item>
				<el-form-item label="工程名称" prop="prjName">
					<el-input v-model="formData.prjName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="建设类型" prop="prjType">
					<el-select v-model="formData.prjType" placeholder="请选择建设类型" style="width: 100%;">
						<el-option v-for="item in prjTypeOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="联系人" prop="contacts">
					<el-input v-model="formData.contacts" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="联系方式" prop="contactInf">
					<el-input v-model="formData.contactInf" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="附带临建批号" prop="prjTemSN">
					<el-input v-if="!!formData.id" v-model="formData.prjTemSN" auto-complete="off" readOnly></el-input>
					<el-input v-if="!formData.id" v-model="formData.prjTemSN" auto-complete="off" @change="prjSNChange"></el-input>
				</el-form-item>
				<el-form-item label="许可证类型" prop="prjSNType">
					<el-select v-model="formData.prjSNType" placeholder="请选择许可证类型" style="width: 100%;" @change="prjSNTypeChange">
						<el-option v-for="item in prjSNTypeOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发件日期" prop="noticeTime">
					<el-date-picker type="date" placeholder="发件日期" v-model="formData.noticeTime" value-format="yyyy/MM/dd" format="yyyy/MM/dd" style="width: 100%;"></el-date-picker>
				</el-form-item>
				<el-form-item label="有效期" prop="effectiveTime">
					<el-input-number v-model="formData.effectiveTime" :min="1" style="width:100%" :step="1" :precision="0"></el-input-number>
				</el-form-item>
				<el-form-item label="延期文号" prop="delaySN">
					<el-input v-model="formData.delaySN" auto-complete="off" @change="delaySNChange"></el-input>
				</el-form-item>
				<el-form-item label="延长期(月)" prop="delayCountDay">
					<el-input-number v-model="formData.delayCountDay" :min="1" style="width:100%" :step="1" :precision="0"></el-input-number>
				</el-form-item>
				<el-form-item label="补正证号" prop="correctionSN">
					<el-input v-model="formData.correctionSN" auto-complete="off" @change="correctionSNChange"></el-input>
				</el-form-item>
				<el-form-item label="补正日期" prop="correctionDate">
					<el-date-picker type="date" placeholder="补正日期" v-model="formData.correctionDate" value-format="yyyy/MM/dd" format="yyyy/MM/dd" style="width: 100%;"></el-date-picker>
				</el-form-item>
				<el-form-item label="特别告知事项" prop="specialNotifi">
					<el-input type="textarea" v-model="formData.specialNotifi" auto-complete="off" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" v-model="formData.remark" auto-complete="off" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
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
	import util from '../../common/js/util';
	import { createOrUpdateProject, queryDicByType } from '../../api/api';

	export default {
		data() {
			return {
				show: true,
				formLoading: false,
				title: '',
				prjTypeOptions: util.prjTypeOptions,
				prjSNTypeOptions: util.prjSNTypeOptions,
				prjAdrCodeOptons: [],
				remarkRequired: { required: true, message: '不能为空', trigger: 'blur' },
				formRules: {
					prjSN: [
						{ required: true, message: '不能为空', trigger: 'blur' },
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' },
						{ max: 50, message: '最大长度50', trigger: 'blur' },
						{ min: 4, message: '最小长度4', trigger: 'blur' }
					],
					prjUnit: [
						{ required: true, message: '不能为空', trigger: 'blur' },
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' },
						{ max: 200, message: '最大长度200', trigger: 'blur' }
					],
					prjAdrCode: [
						{ max: 50, message: '最大长度50', trigger: 'blur' }
					],
					prjAdrDetail: [
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' },
						{ max: 1000, message: '最大长度1000', trigger: 'blur' }
					],
					prjName: [
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' },
						{ max: 500, message: '最大长度500', trigger: 'blur' }
					],
					prjType: [
						{ required: true, message: '不能为空', trigger: 'blur' }
					],
					contacts: [
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' },
						{ max: 10, message: '最大长度10', trigger: 'blur' }
					],
					contactInf: [
						{ max: 100, message: '最大长度100', trigger: 'blur' }
					],
					prjTemSN: [
						{ validator: util.validatorUtils.checkContaintStr('临', '输入有效临建证号！'), trigger: 'blur' },
						{ max: 200, message: '最大长度200', trigger: 'blur' }
					],
					specialNotifi: [
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' },
						{ max: 1500, message: '最大长度1500', trigger: 'blur' }
					],
					prjSNType: [
						{ required: true, message: '不能为空', trigger: 'blur' },
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' },
						{ max: 200, message: '最大长度200', trigger: 'blur' }
					],
					noticeTime: [],
					effectiveTime: [],
					delaySN: [
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' },
						{ max: 50, message: '最大长度50', trigger: 'blur' }
					],
					delayCountDay: [],
					correctionSN: [
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' },
						{ max: 50, message: '最大长度50', trigger: 'blur' }
					],
					correctionDate: [],
					remark: [
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' },
						{ max: 900, message: '最大长度900', trigger: 'blur' }
					]
				}
			}
		},
		methods: {
			prjSNChange(val) {
				const remarkRule = this.$refs.formData.rules.remark;
				const index = remarkRule.indexOf(this.remarkRequired);
				if (val && val.indexOf('补正') > -1) {
					if (index === -1) {
						remarkRule.push(this.remarkRequired);
					}
				} else {
					if (index !== -1) {
						remarkRule.pop();
					}
				}
				
			},
			prjSNTypeChange(value) {
				if (value === '临时建设项目') {
					this.$refs.formData.rules.noticeTime = [{ required: true,  message: '不能为空', trigger: 'blur' }];
					this.$refs.formData.rules.effectiveTime = [{ required: true,  message: '不能为空', trigger: 'blur' }];
				} else {
					this.$refs.formData.rules.noticeTime = [];
					this.$refs.formData.rules.effectiveTime = [];
				}
			},
			delaySNChange(value) {
				if (!!value) {
					this.$refs.formData.rules.delayCountDay = [{ required: true,  message: '不能为空', trigger: 'blur' }];
				} else {
					this.$refs.formData.rules.delayCountDay = [];
				}
			},
			correctionSNChange(value) {
				if (!!value) {
					this.$refs.formData.rules.correctionDate = [{ required: true,  message: '不能为空', trigger: 'blur' }];
				} else {
					this.$refs.formData.rules.correctionDate = [];
				}
			},
			submitHandler: function () {
				this.$refs.formData.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.formLoading = true;
							let para = Object.assign({}, this.formData);
							delete para.prjAdr;
							createOrUpdateProject(para).then((resp) => {
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
								respMsg.message = (!!this.formData.id) ? '修改项目基本信息成功' : '新增项目基本信息成功';
								this.callback(respMsg);
							});
						});
					}
				});
			},
            cancelHandle() {
                this.callback();
			},
			queryPrjAdrCodeOptons() {
				const param = {
					type: 'CYXZGHB'
				};
				queryDicByType(param).then(resp => {
					if (resp.header.rspReturnCode !== '000000') {
						respMsg.type = 'error';
						respMsg.message = resp.header.rspReturnMsg;
						this.$message(respMsg);
						return;
					}

					this.prjAdrCodeOptons = resp.classifiDicList;
				});
			}
		},
		mounted() {
			this.title = (!!this.formData.id) ? '修改项目基本信息' : '新增项目基本信息';
			this.queryPrjAdrCodeOptons();
		},
		updated() {
			if (!!this.formData.id) {
				this.prjSNChange(this.formData.prjSN);
				this.prjSNTypeChange(this.formData.prjSNType);
				this.delaySNChange(this.formData.delaySN);
				this.correctionSNChange(this.formData.correctionSN);
			}
		},
        props: ['formData', 'callback']
	}

</script>

<style>
	#projectPage .input-with-select .el-select .el-input {
		width: 130px;
	}
	.input-with-select .el-input-group__prepend {
		background-color: #fff;
	}
  </style>