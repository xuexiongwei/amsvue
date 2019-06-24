<template>
	<section>
		<!-- 分配菜单-->
		<el-dialog title="选择菜单" :visible.sync="show" :close-on-click-modal="false" :show-close="false">
			<div style="height:400px;overflow:auto;">
				<el-tree :props="{label: 'menuName'}" :data="menuTreeData" node-key="id" ref="menuTreeComponent" 
					check-strictly show-checkbox :default-checked-keys="menuIds" @check-change="checkChange">
				</el-tree>
			</div>

			<div slot="footer" class="dialog-footer">
				<el-button @click.native="cancelHandle">取消</el-button>
				<el-button type="primary" @click.native="menuTreeSubmit">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { getMenuTree } from '../../api/api';

	export default {
		data() {
			return {
                show: true,
				menuTreeData: []
			}
		},
		methods: {
			checkChange(treeNode, isChecked) {
				if(isChecked){
					this.$refs.menuTreeComponent.setCheckedNodes([treeNode]);
				}
			},
			getMenuTree() {
				getMenuTree().then(resp => {
					this.menuTreeData = resp.menuTree;
				});
			},
            cancelHandle() {
                this.callback({type: 'menuTree'});
            },
			menuTreeSubmit() {
				const checkedNodes = this.$refs.menuTreeComponent.getCheckedNodes();
				const resp = {
					type: 'menuTree',
					checkedNode: checkedNodes.length ? checkedNodes[0] : {}
				};
				this.callback(resp);
			}
		},
		mounted() {
			this.getMenuTree();
		},
        props: ['callback', 'menuIds']
	}

</script>

<style scoped></style>