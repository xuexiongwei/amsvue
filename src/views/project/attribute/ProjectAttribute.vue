<template>
	<section id="userPage">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.prjSN" placeholder="许可证号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getProjectAttributeListPage">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="showFormHandler(null, null)">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table v-if="tableHeight > 0" :data="xmsxList" highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight"  stripe border>
			<el-table-column width="60">
				<template slot-scope="scope">
					<span>{{scope.$index + 1 + (pageNum - 1) * pageSize}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="prjSN" label="许可证号" width="200"></el-table-column>
			<el-table-column prop="serialNumber" label="建筑序号" width="150"></el-table-column>
			<el-table-column prop="prjNature" label="项目性质" width="150"></el-table-column>
			<el-table-column prop="prjAttr" label="规划项目/人防" width="150"></el-table-column>
			<el-table-column prop="peacetimeUses" label="平时用途" width="150"></el-table-column>
			<el-table-column prop="aboveGroundLev" label="地上层数" width="150"></el-table-column>
			<el-table-column prop="underGroundLev" label="地下层数" width="150"></el-table-column>
			<el-table-column prop="aboveGroundHet" label="地上高度（米）" width="150"></el-table-column>
			<el-table-column prop="underGroundHet" label="地下高度（米）" width="150"></el-table-column>
			<el-table-column prop="buildings" label="栋数" width="150"></el-table-column>
			<el-table-column prop="housingStockNum" label="住房套数" width="150"></el-table-column>
			<el-table-column prop="strucType" label="结构类型" width="150"></el-table-column>
			<el-table-column prop="checkDocSN" label="验线文号" width="150"></el-table-column>
			<el-table-column prop="checkDocDate" label="验线时间" width="150"></el-table-column>
			<el-table-column prop="checkSN" label="验收文号" width="150"></el-table-column>
			<el-table-column prop="checkDate" label="验收日期" width="150"></el-table-column>
			<el-table-column prop="cancelSN" label="撤（注）销证号" width="150"></el-table-column>
			<el-table-column prop="cancelDate" label="撤（注）销日期" width="150"></el-table-column>
			<el-table-column prop="imgJudgeRes" label="影像判读结果" width="150"></el-table-column>
			<el-table-column prop="exproprInfo" label="代征用地情况" width="150"></el-table-column>
			<el-table-column prop="buldStatus" label="工程状态" width="150"></el-table-column>
			<el-table-column label="备注" width="150">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p><span>{{scope.row.remark}}</span></p>
						<div slot="reference" class="name-wrapper nowrap-text">
							<span>{{scope.row.remark}}</span>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column fixed="right"  label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="showFormHandler(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 项目属性信息增加/修改 -->
		<ams-project-attribute-form v-if="formParams.show" :formData="this.formParams.data" :callback="callback"></ams-project-attribute-form>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange"
				:page-size="pageSize" :total="total" :page-sizes="paginationSize" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
	import { getProjectAttributeListPage , removeProjectAttribute } from '../../../api/api';
	import util from '../../../common/js/util';
	import ProjectAttributeForm from './ProjectAttributeForm';

	export default {
		data() {
			return {
				filters: {
					prjSN: ''
				},
				xmsxList: [],
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
				this.getProjectAttributeListPage();
			},
			handleCurrentChange(pageNum) {
				this.pageNum = pageNum;
				this.getProjectAttributeListPage();
			},
			// 获取项目基本信息列表
			getProjectAttributeListPage() {
				let para = {
					prjSN: this.filters.prjSN
				};
				this.listLoading = true;
				getProjectAttributeListPage(para, this.pageSize, this.pageNum).then((resp) => {
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
					this.xmsxList = resp.xmsxList;
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					removeProjectAttribute(para).then((resp) => {
						this.listLoading = false;

						if (resp.header.rspReturnCode !== '000000') {
							this.$message({
								message: resp.header.rspReturnMsg,
								type: 'error'
							});
							return;
						}

						this.$message({
							message: '删除项目属性信息成功',
							type: 'success'
						});
						this.getProjectAttributeListPage();
					});
				});
			},
			// 新增 修改表单显示
			showFormHandler(index, row) {
				this.formParams.data = Object.assign({}, row);
				this.formParams.show = true;
			},
			callback(respData) {
				this.formParams.show = false;
				if (respData) {
					this.$message(respData);
					this.getProjectAttributeListPage();
				}
				
			}
		},
		mounted() {
			this.getProjectAttributeListPage();
		},
		components: {
			'ams-project-attribute-form': ProjectAttributeForm,
		}
	}
</script>