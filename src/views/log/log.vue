<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-date-picker v-model="filters.date" type="daterange" range-separator="至"  value-format="yyyy-MM-dd"
                    start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
				</el-form-item>
                <el-form-item>
					<el-select v-model="filters.operAction" placeholder="请选择操作类型">
                        <el-option label="请选择" value=""></el-option>
						<el-option label="新增" value="新增"></el-option>
                        <el-option label="删除" value="删除"></el-option>
                        <el-option label="修改" value="修改"></el-option>
                    </el-select>
				</el-form-item>
                <el-form-item>
					<el-select v-model="filters.operDesc" placeholder="请选择操作信息">
                        <el-option label="请选择" value=""></el-option>
						<el-option label="项目基本信息" value="项目基本信息"></el-option>
                        <el-option label="项目属性信息" value="项目属性信息"></el-option>
                        <el-option label="项目明细信息" value="项目明细信息"></el-option>
                    </el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getLogListPage">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="logList" highlight-current-row v-loading="listLoading" stripe border>
			<el-table-column width="60">
				<template slot-scope="scope">
					<span>{{scope.$index + 1 + (pageNum - 1) * pageSize}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="operAction" label="操作类型" sortable></el-table-column>
			<el-table-column prop="operDesc" label="操作信息" sortable></el-table-column>
			<el-table-column prop="prjSN" label="许可证号" sortable></el-table-column>
			<el-table-column prop="userName" label="操作用户" sortable></el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="sizes, prev, pager, next" :page-sizes="paginationSize" @size-change="handleSizeChange"
			 	@current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

	</section>
</template>

<script>
	import { getLogListPage } from '../../api/api';
	import util from '../../common/js/util';
	
	export default {
		data() {
			return {
				filters: {
					date: [],
                    operAction: '',
                    operDesc: ''
				},
				logList: [],
				total: 0,
				pageNum: 1,
				listLoading: false,
				pageSize: util.paginationSize[0],
				paginationSize: util.paginationSize
			}
		},
		methods: {
			handleSizeChange(pageSize) {
				this.pageSize = pageSize;
				this.getLogListPage();
			},
			handleCurrentChange(val) {
				this.pageNum = val;
				this.getLogListPage();
			},
			//获取用户列表
			getLogListPage() {
				let para = {
					startDate: this.filters.date[0],
                    endDate: this.filters.date[1],
                    operAction: this.filters.operAction,
                    operDesc: this.filters.operDesc
				};
				this.listLoading = true;
				getLogListPage(para, this.pageSize, this.pageNum).then((resp) => {
                    this.listLoading = false;

                    if (resp.header.rspReturnCode !== '000000') {
						this.$message({
							message: resp.header.rspReturnMsg,
							type: 'error'
						});
						return;
					}

					this.total = resp.header.rspPageCount;
					this.logList = resp.userOperationList;
					
				});
			}
		}
	}

</script>