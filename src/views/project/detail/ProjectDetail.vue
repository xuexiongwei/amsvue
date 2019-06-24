<template>
	<section id="userPage">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.prjSN" placeholder="许可证号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getProjectDtailListPage">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="showFormHandler(null, null)">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table v-if="tableHeight > 0" :data="xmmxList" highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight" stripe border>
			<el-table-column width="60">
				<template slot-scope="scope">
					<span>{{scope.$index + 1 + (pageNum - 1) * pageSize}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="prjSN" label="许可证号" width="200"></el-table-column>
			<el-table-column prop="serialNumber" label="建筑序号" width="150"></el-table-column>
			<el-table-column prop="serialFunct" label="建筑功能" width="200"></el-table-column>
			<el-table-column prop="aboveGroundArea" label="地上建筑面积（平方米）" width="200"></el-table-column>
			<el-table-column prop="underGroundArea" label="地下建筑面积（平方米）" width="200"></el-table-column>
			<el-table-column prop="blendArea" label="混合建筑面积（平方米）" width="200"></el-table-column>
			<el-table-column prop="aboveGroundLen" label="地上建筑长度（米）" width="200"></el-table-column>
			<el-table-column prop="prjClasfiName1" label="一级分类" width="150"></el-table-column>
			<el-table-column prop="prjClasfiName2" label="二级分类" width="150"></el-table-column>
			<el-table-column prop="prjClasfiName3" label="三级分类" width="150"></el-table-column>
			<el-table-column prop="prjClasfiName4" label="四级分类" width="150"></el-table-column>
			<el-table-column prop="prjClasfiName5" label="五级分类" width="150"></el-table-column>
			<el-table-column fixed="right"  label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="showFormHandler(scope.$index, scope.row)">编辑</el-button>
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


		<!-- 项目详细信息增加/修改 -->
		<ams-project-detail-form v-if="formParams.show" :formTemData="this.formParams.data" :callback="callback"></ams-project-detail-form>

	</section>
</template>

<script>
	import { getProjectDtailListPage , removeProjectDetail } from '../../../api/api';
	import ProjectDetailForm from './ProjectDetailForm';
	import util from '../../../common/js/util';

	export default {
		data() {
			return {
				filters: {
					prjSN: ''
				},
				xmmxList: [],
				total: 0,
				pageNum: 1,
				pageSize: util.paginationSize[0],
				paginationSize: util.paginationSize,
				listLoading: false,
				formParams: {
					show: false,
					data: null
				},
				tableHeight: 0
			}
		},
		methods: {
			handleSizeChange(pageSize) {
				this.pageSize = pageSize;
				this.getProjectDtailListPage();
			},
			handleCurrentChange(pageNum) {
				this.pageNum = pageNum;
				this.getProjectDtailListPage();
			},
			// 获取项目基本信息列表
			getProjectDtailListPage() {
				let para = {
					prjSN: this.filters.prjSN
				};
				this.listLoading = true;
				getProjectDtailListPage(para, this.pageSize, this.pageNum).then((resp) => {
					this.listLoading = false;
					if (resp.header.rspReturnCode !== '000000') {
						this.$message({
							message: resp.header.rspReturnMsg,
							type: 'error'
						});
						return;
					}

					this.tableHeight = window.screen.availHeight - 450;
		
					this.total = resp.header.rspPageCount;
					this.xmmxList = resp.xmmxList;
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					removeProjectDetail(para).then((resp) => {
						this.listLoading = false;

						if (resp.header.rspReturnCode !== '000000') {
							this.$message({ message: resp.header.rspReturnMsg, type: 'error' });
							return;
						}

						this.$message({
							message: '删除项目明细信息成功',
							type: 'success'
						});
						this.getProjectDtailListPage();
					});
				});
			},
			// 新增 修改表单显示
			showFormHandler(index, row) {
				if (row && row.id) {
					this.formParams.data = {
						id: row.id,
						prjSN: row.prjSN,
						serialNumber: row.serialNumber,
						serialFunct: row.serialFunct,
						aboveGroundArea: row.aboveGroundArea,
						underGroundArea: row.underGroundArea,
						blendArea: row.blendArea,
						aboveGroundLen: row.aboveGroundLen
					};
				}
				this.formParams.show = true;
			},
			callback(respData) {
				this.formParams.show = false;
				this.formParams.data = null;
				if (respData) {
					this.$message(respData);
					this.getProjectDtailListPage();
				}
				
			}
		},
		mounted() {
			this.getProjectDtailListPage();
		},
		components: {
			'ams-project-detail-form': ProjectDetailForm,
		}
	}
</script>