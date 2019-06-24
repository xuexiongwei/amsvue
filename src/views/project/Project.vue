<template>
	<section id="projectPage">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.prjSN" placeholder="许可证号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.prjUnit" placeholder="建设单位"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.prjAdr" placeholder="建设位置"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.prjType" placeholder="请选择建设类型" style="width: 100%;">
						<el-option v-for="item in prjTypeOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.specialNotifi" placeholder="特别告知事项"></el-input>
				</el-form-item>
				<el-form-item>
					<el-date-picker type="date" placeholder="发件日期" v-model="filters.noticeTime" value-format="yyyy/MM/dd"
						format="yyyy/MM/dd" style="width: 100%;"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.remark" placeholder="备注"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getProjectListPage">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="showFormHandler(null, null)">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table v-if="tableHeight > 0"  :data="jbxxList" highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight" stripe border>
			<el-table-column label="序号" width="60">
				<template slot-scope="scope">
					<span>{{scope.$index + 1 + (pageNum - 1) * pageSize}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="prjSN" label="许可证号" width="200">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p><span>{{scope.row.prjSN}}</span></p>
						<div slot="reference" class="name-wrapper nowrap-text">
							<span>{{scope.row.prjSN}}</span>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="prjUnit" label="建设单位" width="250">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p><span>{{scope.row.prjUnit}}</span></p>
						<div slot="reference" class="name-wrapper nowrap-text">
							<span>{{scope.row.prjUnit}}</span>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="prjAdr" label="建设位置" width="150">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p><span>{{scope.row.prjAdr}}</span></p>
						<div slot="reference" class="name-wrapper nowrap-text">
							<span>{{scope.row.prjAdr}}</span>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="prjName" label="工程名称" width="250">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p><span>{{scope.row.prjName}}</span></p>
						<div slot="reference" class="name-wrapper nowrap-text">
							<span>{{scope.row.prjName}}</span>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="prjType" label="建设类型" width="150"></el-table-column>
			<el-table-column prop="contacts" label="联系人" width="150"></el-table-column>
			<el-table-column prop="contactInf" label="联系方式" width="250"></el-table-column>
			<el-table-column prop="prjTemSN" label="附带临建批号" width="150"></el-table-column>
			<el-table-column label="特别告知事项" width="150">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p><span>{{scope.row.specialNotifi}}</span></p>
						<div slot="reference" class="name-wrapper nowrap-text">
							<span>{{scope.row.specialNotifi}}</span>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="noticeTime" label="发件日期" width="150"></el-table-column>
			<el-table-column prop="effectiveTime" label="有效时间" width="150"></el-table-column>
			<el-table-column prop="prjSNType" label="许可证类型" width="150"></el-table-column>
			<el-table-column prop="prjStatus" label="项目状态" width="150"></el-table-column>
			<el-table-column prop="delaySN" label="延期文号" width="150"></el-table-column>
			<el-table-column prop="delayCountDay" label="延长期" width="150"></el-table-column>
			<el-table-column prop="correctionSN" label="补正证号" width="150"></el-table-column>
			<el-table-column prop="correctionDate" label="补正日期" width="150"></el-table-column>
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
			<el-table-column fixed="right" label="操作" width="150">
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


		<!-- 项目基本信息增加/修改 -->
		<ams-project-form v-if="formParams.show" :formData="this.formParams.data" :callback="callback"></ams-project-form>
		
	</section>
</template>

<script>
	import { getProjectListPage , removeProject } from '../../api/api';
	import ProjectForm from './ProjectForm';
	import util from '../../common/js/util';

	export default {
		data() {
			return {
				prjTypeOptions: util.prjTypeOptions,
				filters: {
					prjSN: '',
					prjUnit: '',
					prjAdr: '',
					prjType: '',
					specialNotifi: '',
					noticeTime: '',
					remark: ''
				},
				jbxxList: [],
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
				this.getProjectListPage();
			},
			handleCurrentChange(pageNum) {
				this.pageNum = pageNum;
				this.getProjectListPage();
			},
			// 获取项目基本信息列表
			getProjectListPage() {
				let para = {
					prjSN: this.filters.prjSN,
					prjUnit: this.filters.prjUnit,
					prjAdr: this.filters.prjAdr,
					prjType: this.filters.prjType,
					specialNotifi: this.filters.specialNotifi,
					noticeTime: this.filters.noticeTime,
					remark: this.filters.remark
				};
				this.listLoading = true;
				getProjectListPage(para, this.pageSize, this.pageNum).then((resp) => {
					this.listLoading = false;
					if (resp.header.rspReturnCode !== '000000') {
						this.$message({ message: resp.header.rspReturnMsg, type: 'error' });
						return;
					}

					this.tableHeight = window.screen.availHeight - 450;

					this.total = resp.header.rspPageCount;
					this.jbxxList = resp.xmjbxxList;
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					removeProject(para).then((resp) => {
						this.listLoading = false;

						if (resp.header.rspReturnCode !== '000000') {
							this.$message({
								message: resp.header.rspReturnMsg,
								type: 'error'
							});
							return;
						}

						this.$message({
							message: '删除项目基本信息成功',
							type: 'success'
						});
						this.getProjectListPage();
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
					this.getProjectListPage();
				}
				
			}
		},
		mounted() {
			this.getProjectListPage();
		},
		components: {
			'ams-project-form': ProjectForm,
		}
	}
</script>

