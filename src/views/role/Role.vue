<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.roleName" placeholder="角色名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getRoleListPage">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="roleList" highlight-current-row v-loading="listLoading" style="width: 100%;" stripe border>
			<el-table-column width="60">
				<template slot-scope="scope">
					<span>{{scope.$index + 1 + (pageNum - 1) * pageSize}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="roleSign" label="角色标识" sortable></el-table-column>
			<el-table-column prop="roleName" label="角色名称" sortable></el-table-column>
			<el-table-column prop="gmtCreate" label="创建时间" sortable></el-table-column>
			<el-table-column prop="gmtModified" label="修改时间" sortable></el-table-column>
			<el-table-column prop="remark" label="备注" sortable></el-table-column>
			<el-table-column label="操作" width="350">
				<template slot-scope="scope">
					<el-button size="small" @click="showSetMenu(scope.$index, scope.row)">分配菜单</el-button>
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
		
		<!-- 新增角色-->
		<ams-role-add v-if="addShow" :callback="callback"></ams-role-add>

		<!-- 修改角色-->
		<ams-role-edit v-if="editShow" :callback="callback" :editForm="editForm"></ams-role-edit>

		<!-- 角色分配菜单 -->
		<ams-role-set-menu v-if="setMenuShow" :currentRoleId="currentRoleId" :callback="callback"></ams-role-set-menu>
	</section>
</template>

<script>
	import { getRoleListPage, removeRole, batchRemoveRole, getMenuTree, getMenuIdsByRoleId, setMenuIdsByRoleId } from '../../api/api';
	import RoleAdd from './RoleAdd';
	import RoleEdit from './RoleEdit';
	import RoleSetMenu from './RoleSetMenu';
	import util from '../../common/js/util';

	export default {
		data() {
			return {
				filters: {
					roleName: ''
				},
				roleList: [],
				total: 0,
				pageNum: 1,
				pageSize: util.paginationSize[0],
				paginationSize: util.paginationSize,
				listLoading: false,

				editShow: false,
				editForm: {},
				addShow: false,

				setMenuShow: false,
				currentRoleId: ''
			}
		},
		methods: {
			callback(respData) {
				this[respData.type + 'Show'] = false;
				if (respData.data) {
					this.$message(respData.data);
					this.getRoleListPage();
				}
			},
			handleSizeChange(pageSize) {
				this.pageSize = pageSize;
				this.getRoleListPage();
			},
			handleCurrentChange(pageNum) {
				this.pageNum = pageNum;
				this.getRoleListPage();
			},
			//获取用户列表
			getRoleListPage() {
				let para = {
					roleName: this.filters.roleName
				};
				this.listLoading = true;
				getRoleListPage(para, this.pageSize, this.pageNum).then((resp) => {					
					this.listLoading = false;
					if (resp.header.rspReturnCode !== '000000') {
						this.$message({ message: resp.header.rspReturnMsg, type: 'error' });
						return;
					}

					this.total = resp.header.rspPageCount;
					this.roleList = resp.roleList;
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					removeRole(para).then((resp) => {
						this.listLoading = false;
						if (resp.header.rspReturnCode !== '000000') {
							this.$message({
								message: resp.header.rspReturnMsg,
								type: 'error'
							});
							return;
						}

						this.$message({
							message: '删除角色成功',
							type: 'success'
						});
						this.getRoleListPage();
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
			},
			showSetMenu(index, row) {
				this.currentRoleId = row.id;
				this.setMenuShow = true;
			}
		},
		mounted() {
			this.getRoleListPage();

		},
		components: {
			'ams-role-add': RoleAdd,
			'ams-role-edit': RoleEdit,
			'ams-role-set-menu': RoleSetMenu
		}
	}

</script>

<style scoped></style>