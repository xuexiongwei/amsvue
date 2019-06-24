<template>
	<section>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="show" :close-on-click-modal="false" :show-close="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="登录名" prop="username">
					<el-input v-model="addForm.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="email" prop="email">
					<el-input v-model="addForm.email" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="'男'"></el-radio>
						<el-radio class="radio" :label="'女'"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="联系电话" prop="mobile">
					<el-input v-model="addForm.mobile" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="cancelHandle">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
	import util from '../../common/js/util';
	import { addUser } from '../../api/api';

	export default {
		data() {
			return {
                show: true,
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '不能为空', trigger: 'blur' },
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' }
					],
					username: [
						{ required: true, message: '不能为空', trigger: 'blur' },
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' }
					],
					email: [
						{ required: true, validator: util.validatorUtils.checkEmail, trigger: 'blur' }
					],
					mobile: [
						{ required: true, validator: util.validatorUtils.checkMobile, trigger: 'blur' }
					],
					sex: [
						{ required: true, message: '请输入性别', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					username: '',
					email: '',
					mobile: '',
					sex: '男'
				}
			}
		},
		methods: {
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							addUser(para).then((resp) => {
								this.addLoading = false;

								if (resp.header.rspReturnCode !== '000000') {
									this.$message({
										message: resp.header.rspReturnMsg,
										type: 'error'
									});
									return;
								}

								this.$refs['addForm'].resetFields();
                                this.callback({
                                    type: 'add',
                                    data: {message: '新增用户成功', type: 'success'}
                                });
							});
						});
					}
				});
			},
            cancelHandle() {
                this.callback({type: 'add'});
            }
		},
        props: ['callback']
	}

</script>