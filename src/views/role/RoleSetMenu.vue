<template>
	<section>
		<!-- 分配菜单-->
		<el-dialog title="分配菜单" :visible.sync="show" :close-on-click-modal="false" :show-close="false">
			<div style="height:400px;overflow:auto;">
				<el-tree :props="{label: 'menuName'}" :data="menuTreeData" node-key="id" ref="menuTree"
					:default-checked-keys="selectMenuIds" show-checkbox @check-change="handleCheckChange">
				</el-tree>
			</div>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="cancelHandle">取消</el-button>
				<el-button type="primary" @click.native="setMenuHandler" :loading="setMenuLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util';
	import { getMenuTree, getMenuIdsByRoleId, setMenuIdsByRoleId } from '../../api/api';

	export default {
		data() {
			return {
                show: true,
				setMenuLoading: false,
				menuTreeData: [],
				selectMenuIds: []
			}
		},
		methods: {
			handleCheckChange() {
				this.selectMenuIds = this.$refs.menuTree.getCheckedKeys();
			},
			getMenuIdsByRoleId() {
				getMenuIdsByRoleId({ roleId: this.currentRoleId }).then(resp => {
					this.selectMenuIds = resp.selectMenuIds;
				});
			},
			setMenuHandler() {
				setMenuIdsByRoleId({selectMenuIds: this.selectMenuIds}).then(resp => {
                    this.callback({
                        type: 'setMenu',
                        data: {message: '配置菜单成功', type: 'success'}
                    });
				}); 
				
			},
			getMenuTree() {
				getMenuTree().then(resp => {
					this.menuTreeData = resp.menuTree;
				});
			},
            cancelHandle() {
                this.callback({type: 'setMenu'});
            }
		},
		mounted() {
			this.getMenuTree();
            this.getMenuIdsByRoleId();
		},
        props: ['callback', 'currentRoleId']
	}

</script>

<style scoped></style>