<template>
	<section >
		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="show" :close-on-click-modal="false" :show-close="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="登录名" prop="username">
					<el-input v-model="editForm.username" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="email" prop="email">
					<el-input v-model="editForm.email" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="'男'"></el-radio>
						<el-radio class="radio" :label="'女'"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="联系电话" prop="mobile">
					<el-input v-model="editForm.mobile" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="cancelHandle">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util';
	import { editUser } from '../../api/api';

	export default {
		data() {
			return {
				show: true,
				editLoading: false,
				editFormRules: {
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
				}
			}
		},
		methods: {
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);							
							editUser(para).then((resp) => {
								this.editLoading = false;

								if (resp.header.rspReturnCode !== '000000') {
									this.$message({
										message: resp.header.rspReturnMsg,
										type: 'error'
									});
									return;
								}

								this.$refs['editForm'].resetFields();
								this.callback({
                                    type: 'edit',
                                    data: {message: '修改用户成功', type: 'success'}
                                });
							});
						});
					}
				});
			},
            cancelHandle() {
                this.callback({type: 'edit'});
            }
		},
        props: ['editForm', 'callback']
	}

</script>