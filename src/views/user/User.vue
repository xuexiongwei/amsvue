<template>
	<section id="userPage">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUserListPage">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="userList" highlight-current-row v-loading="listLoading" style="width: 100%;"  stripe border>
			<el-table-column width="60">
				<template slot-scope="scope">
					<span>{{scope.$index + 1 + (pageNum - 1) * pageSize}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="120" sortable></el-table-column>
			<el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable></el-table-column>
			<el-table-column prop="email" label="email" width="150" sortable></el-table-column>
			<el-table-column prop="mobile" label="联系电话" width="120" sortable></el-table-column>
			<el-table-column prop="userName" label="用户名" min-width="100" sortable></el-table-column>
			<el-table-column prop="status" label="状态" min-width="80" sortable></el-table-column>
			<el-table-column prop="gmtCreate" label="创建时间" min-width="180" sortable></el-table-column>
			<el-table-column prop="gmtModified" label="修改时间" min-width="180" sortable></el-table-column>
			<el-table-column label="操作" width="300">
				<template slot-scope="scope">
					<el-button size="small" @click="showRoleHandler(scope.$index, scope.row)">分配角色</el-button>
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange"
				:page-size="pageSize" :total="total" :page-sizes="paginationSize" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<ams-user-edit v-if="editShow" :callback="callback" :editForm="editForm"></ams-user-edit>

		<!--新增界面-->
		<ams-user-add v-if="addShow" :callback="callback"></ams-user-add>

		<!-- 用户配置角色 -->
		<ams-user-add-role v-if="userSetRoleShow" :callback="callback" :currentUserId="currentUserId"></ams-user-add-role>
	</section>
</template>

<script>
	import util from '../../common/js/util';
	import { getUserListPage, removeUser, batchRemoveUser } from '../../api/api';
	import UserAdd from './UserAdd';
	import UserEdit from './UserEdit';
	import UserAddRole from './UserAddRole';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				userList: [],
				total: 0,
				pageNum: 1,
				pageSize: util.paginationSize[0],
				paginationSize: util.paginationSize,
				listLoading: false,

				editShow: false,
				editForm: {},
				addShow: false,

				userSetRoleShow: false,
				currentUserId: ''
			}
		},
		methods: {
			callback(respData) {
				this[respData.type + 'Show'] = false;
				if (respData.data) {
					this.$message(respData.data);
					this.getUserListPage();
				}
			},
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex;
			},
			handleSizeChange(pageSize) {
				this.pageSize = pageSize;
				this.getUserListPage();
			},
			handleCurrentChange(pageNum) {
				this.pageNum = pageNum;
				this.getUserListPage();
			},
			//获取用户列表
			getUserListPage() {
				let para = {
					name: this.filters.name
				};
				this.listLoading = true;
				getUserListPage(para, this.pageSize, this.pageNum).then((resp) => {
					this.listLoading = false;
					if (resp.header.rspReturnCode !== '000000') {
						this.$message({
							message: resp.header.rspReturnMsg,
							type: 'error'
						});
						return;
					}

					this.total = resp.header.rspPageCount;
					this.userList = resp.userList;
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					removeUser(para).then((resp) => {
						this.listLoading = false;

						if (resp.header.rspReturnCode !== '000000') {
							this.$message({
								message: resp.header.rspReturnMsg,
								type: 'error'
							});
							return;
						}

						this.$message({
							message: '删除用户成功',
							type: 'success'
						});
						this.getUserListPage();
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
			showRoleHandler(index, row) {
				this.currentUserId = row.id;
				this.userSetRoleShow = true;
			}
		},
		mounted() {
			this.getUserListPage();
		},
		components: {
			'ams-user-add': UserAdd,
			'ams-user-edit': UserEdit,
			'ams-user-add-role': UserAddRole
		}
	}
</script>