<template>
	<section>

		<!--新增界面-->
		<el-dialog title="新增角色" :visible.sync="show" :close-on-click-modal="false" :show-close="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="角色标识" prop="roleSign">
					<el-input v-model="addForm.roleSign" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="addForm.roleName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色备注" prop="remark">
					<el-input type="textarea" v-model="addForm.remark" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button  @click.native="cancelHandle">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util';
	import { addRole } from '../../api/api';

	export default {
		data() {
			return {
                show: true,
				addLoading: false,
				addFormRules: {
					roleSign: [
						{ required: true, message: '不能为空', trigger: 'blur' },
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' }
					],
					roleName: [
						{ required: true, message: '不能为空', trigger: 'blur' },
						{ validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' }
					],
					remark: [
						{ required: true,  validator: util.validatorUtils.checkSpecialChar, trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					roleSign: '',
					roleName: '',
					remark: ''
				}
			}
		},
		methods: {
			addSubmit() {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							addRole(para).then((resp) => {
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
                                    data: {message: '角色添加成功', type: 'success'}
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