<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.menuName" placeholder="菜单名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getMenuListPage">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="menuList" highlight-current-row v-loading="listLoading" stripe border>
			<el-table-column width="60">
				<template slot-scope="scope">
					<span>{{scope.$index + 1 + (pageNum - 1) * pageSize}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="menuName" label="菜单名称" sortable></el-table-column>
			<el-table-column prop="parentMenuName" label="父菜单名称" sortable></el-table-column>
			<el-table-column prop="parentMenuId" label="父菜单Id" sortable></el-table-column>
			<el-table-column prop="menuLink" label="跳转路径" sortable></el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="sizes, prev, pager, next" :page-sizes="paginationSize" @size-change="handleSizeChange"
			 	@current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<ams-menu-edit v-if="editShow" ref="menuEditComponent" :callback="callback" 
			:showMenuTreeHandler="showMenuTreeHandler" :editForm="editForm"></ams-menu-edit>

		<!--新增界面-->
		<ams-menu-add v-if="addShow" ref="menuAddComponent" :callback="callback" :showMenuTreeHandler="showMenuTreeHandler"></ams-menu-add>

		<!-- 选择菜单-->
		<ams-menu-tree v-if="menuTreeShow" :callback="callback" :menuIds="checkedMenuIds"></ams-menu-tree>

	</section>
</template>

<script>
	import { getMenuListPage, removeMenu } from '../../api/api';
	import MenuAdd from './MenuAdd';
	import MenuEdit from './MenuEdit';
	import MenuTree from './MenuTree';
	import util from '../../common/js/util';
	
	export default {
		data() {
			return {
				filters: {
					menuName: ''
				},
				menuList: [],
				total: 0,
				pageNum: 1,
				listLoading: false,
				pageSize: util.paginationSize[0],
				paginationSize: util.paginationSize,

				editShow: false,
				editForm: {},
				addShow: false,
				menuTreeShow: false,
				checkedMenuIds:[],
				showType: ''
			}
		},
		methods: {
			callback(respData) {
				this[respData.type + 'Show'] = false;

				if (respData.type !== 'menuTree') {
					this.checkedMenuIds = [];
					this.showType = '';
				}

				if (respData.data) {
					this.$message(respData.data);
					this.getMenuListPage();
				}

				if (respData.checkedNode) {
					this.$refs[`menu${this.showType}Component`].setParmentMenu(respData.checkedNode);
				}

			},
			showMenuTreeHandler(menuId, type) {
				this.checkedMenuIds = [menuId];
				this.menuTreeShow = true;
				this.showType = type;
			},
			handleSizeChange(pageSize) {
				this.pageSize = pageSize;
				this.getMenuListPage();
			},
			handleCurrentChange(val) {
				this.pageNum = val;
				this.getMenuListPage();
			},
			//获取用户列表
			getMenuListPage() {
				let para = {
					pageSize: this.pageSize,
					pageNum: this.pageNum,
					menuName: this.filters.menuName
				};
				this.listLoading = true;
				getMenuListPage(para).then((resp) => {
					this.total = resp.total;
					this.menuList = resp.menuList;
					this.listLoading = false;
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					removeMenu(para).then((resp) => {
						this.listLoading = false;

						if (resp.header.rspReturnCode !== '000000') {
							this.$message({ message: resp.header.rspReturnMsg, type: 'error' });
							return;
						}

						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getMenuListPage();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editShow = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addShow = true;
			}
		},
		mounted() {
			this.getMenuListPage();
		},
		components: {
			'ams-menu-add': MenuAdd,
			'ams-menu-edit': MenuEdit,
			'ams-menu-tree': MenuTree
		}
	}

</script>

<style scoped></style>