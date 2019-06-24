<template>
	<section>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="show" :close-on-click-modal="false" :show-close="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="菜单名称" prop="menuName">
					<el-input v-model="editForm.menuName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="父菜单" prop="parentMenuName">
					<el-input placeholder="请选择父菜单" v-model="editForm.parentMenuName" class="input-with-select" readonly>
						<el-button slot="append" icon="el-icon-search" @click="selectParentMenu"></el-button>
					</el-input>
					<el-input v-model="editForm.parentMenuId" style="display: none;"></el-input>
				</el-form-item>
				<el-form-item label="跳转路径" prop="menuLink">
					<el-input v-model="editForm.menuLink" auto-complete="off"></el-input>
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
	import { editMenu } from '../../api/api';

	export default {
		data() {
			return {
				show: true,
				editLoading: false,
				editFormRules: {
					menuName: [
						{ required: true, message: '请输入菜单名称名称', trigger: 'blur' }
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
							editMenu(para).then((res) => {
								this.editLoading = false;
								this.$refs['editForm'].resetFields();
								this.callback({
                                    type: 'edit',
                                    data: {message: '修改菜单成功', type: 'success'}
                                });
							});
						});
					}
				});
			},
            cancelHandle() {
                this.callback({type: 'edit'});
            },
			selectParentMenu() {
				this.showMenuTreeHandler(this.editForm.parentMenuId, 'Edit');
			},
			setParmentMenu(menuNode) {
				this.editForm.parentMenuId = menuNode.id;
				this.editForm.parentMenuName = menuNode.menuName;
			}
		},
        props: ['editForm', 'callback', 'showMenuTreeHandler']
	}

</script>

<style scoped></style>