<template>
	<section>
		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="show" :close-on-click-modal="false" :show-close="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="菜单名称" prop="menuName">
					<el-input v-model="addForm.menuName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="父菜单" prop="parentMenuName">
					<el-input placeholder="请选择父菜单" v-model="addForm.parentMenuName" class="input-with-select" readonly>
						<el-button slot="append" icon="el-icon-search" @click="selectParentMenu"></el-button>
					</el-input>
					<el-input v-model="addForm.parentMenuId" auto-complete="off" style="display: none;"></el-input>
				</el-form-item>
				<el-form-item label="跳转路径" prop="menuLink">
					<el-input v-model="addForm.menuLink" auto-complete="off"></el-input>
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
	import { addMenu } from '../../api/api';

	export default {
		data() {
			return {
				show: true,
				addLoading: false,
				addFormRules: {
					menuName: [
						{ required: true, message: '请输入菜单名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					menuName: '',
					menuLink: '',
					parentMenuName: '',
					parentMenuId: '',
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
							addMenu(para).then((res) => {
								this.addLoading = false;
								this.$refs['addForm'].resetFields();
								this.callback({
                                    type: 'add',
                                    data: {message: '新增菜单成功', type: 'success'}
                                });
							});
						});
					}
				});
			},
            cancelHandle() {
                this.callback({type: 'add'});
            },
			selectParentMenu() {
				this.showMenuTreeHandler(this.addForm.parentMenuId, 'Add');
			},
			setParmentMenu(menuNode) {
				this.addForm.parentMenuId = menuNode.id;
				this.addForm.parentMenuName = menuNode.menuName;
			}
		},
        props: ['callback', 'showMenuTreeHandler']
	}

</script>

<style scoped></style>