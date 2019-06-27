<template>
	<section id="view001" 
		v-loading="loading" element-loading-text="导出数据中"
		element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :class="isShowFilter ? 'show filter-form' : 'hide filter-form'" :model="filters">
				<el-form-item style="width:31%;">
					<el-select v-model="filters.prjYear" multiple placeholder="请选择年份"  style="width:100%"
						:title="filters.prjYear">
						<el-option v-for="item in yearOptions" :key="item" :label="item" :value="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="width:31%;">
					<el-select v-model="filters.prjAdr" multiple filterable remote reserve-keyword placeholder="请录入建设位置" 
							:remote-method="filterPrjAdrMethod" :title="filters.prjAdr" style="width:100%">
							<el-option v-for="item in prjAdrOptions" :key="item" :label="item" :value="item"></el-option>
						</el-select>
				</el-form-item>
				<el-form-item style="width:31%;">
					<el-select v-model="filters.prjClasfiName1" multiple filterable remote reserve-keyword placeholder="请录入一级分类" 
						:remote-method="filterPrjClasfiName1Method" :title="filters.prjClasfiName1"  style="width:100%">
						<el-option v-for="item in prjClasfiName1Options" :key="item" :label="item" :value="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="width:31%;">
					<el-select v-model="filters.prjClasfiName2" multiple filterable remote reserve-keyword placeholder="请录入二级分类" 
						:remote-method="filterPrjClasfiName2Method" :title="filters.prjClasfiName2"  style="width:100%">
						<el-option v-for="item in prjClasfiName2Options" :key="item" :label="item" :value="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="width:31%;">
					<el-select v-model="filters.prjClasfiName3" multiple filterable remote reserve-keyword placeholder="请录入三级分类" 
						:remote-method="filterPrjClasfiName3Method" :title="filters.prjClasfiName3"  style="width:100%">
						<el-option v-for="item in prjClasfiName3Options" :key="item" :label="item" :value="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="width:31%;">
					<el-select v-model="filters.prjClasfiName4" multiple filterable remote reserve-keyword placeholder="请录入四级分类" 
						:remote-method="filterPrjClasfiName4Method" :title="filters.prjClasfiName4"  style="width:100%">
						<el-option v-for="item in prjClasfiName4Options" :key="item" :label="item" :value="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="width:31%;">
					<el-select v-model="filters.prjClasfiName5" multiple filterable remote reserve-keyword placeholder="请录入五级分类" 
						:remote-method="filterPrjClasfiName5Method" :title="filters.prjClasfiName5"  style="width:100%">
						<el-option v-for="item in prjClasfiName5Options" :key="item" :label="item" :value="item"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<el-form :inline="true" :model="filters">
				<el-form-item style="width:55%;">
					<label>选择显示列信息：</label>
					<el-select v-model="showCol" multiple placeholder="请选择显示列"  style="width:80%">
						<el-option v-for="item in showColOption" :key="item.value" :label="item.label" :value="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="width:13%;">
					是否显示筛选：<el-switch
						v-model="isShowFilter"
						active-color="#13ce66"
  						inactive-color="#ff4949">
					</el-switch>
				</el-form-item>
				<el-form-item style="width:27%;">
					<el-button type="primary" v-on:click="getView001">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="viewList" highlight-current-row v-loading="listLoading" style="width: 100%;"  stripe border>
			<template v-for="colObj in showCol">
				<el-table-column  :prop="colObj.value" :label="colObj.label" width="150"></el-table-column>
			</template>	
			<el-table-column prop="count" label="项目个数" width="120"></el-table-column>
			<el-table-column prop="sumArea" label="总建筑面积(平方米)" width="180"></el-table-column>
			<el-table-column prop="sumLen" label="总建筑长度(米)" width="180"></el-table-column>
			<el-table-column prop="aboveGroundSumArea" label="地上建筑面积(平方米)" width="180"></el-table-column>
			<el-table-column prop="underGroundSumArea" label="地下建筑面积(平方米)" width="180"></el-table-column>
			<el-table-column prop="buildings" label="栋数" width="80"></el-table-column>
			<el-table-column prop="housingStockNum" label="住房套数" width="120"></el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="success" v-on:click="exportCurrentPageExcel"><i class="el-icon-download"></i>&nbsp;导出当前页</el-button>
			<el-button type="primary" v-on:click="exportExcel"><i class="el-icon-download"></i>&nbsp;导出全部</el-button>
			<el-pagination layout="sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange"
				:page-size="pageSize" :total="total" :page-sizes="paginationSize" style="float:right;">
			</el-pagination>
		</el-col>

		<table id="exportTable">
			<tr>
				<template v-for="colObj in showCol">
					<td>{{colObj.label}}</td>
				</template>
				<td>项目个数</td>
				<td>总建筑面积(平方米)</td>
				<td>总建筑长度(米)</td>
				<td>地上建筑面积(平方米)</td>
				<td>地下建筑面积(平方米)</td>
				<td>栋数</td>
				<td>住房套数</td>
			</tr>
			<tr v-for="item in viewList">
				<template v-for="colObj in showCol">
					<td>{{item[colObj.value]}}</td>
				</template>
				<td>{{item.count}}</td>
				<td>{{item.sumArea}}</td>
				<td>{{item.sumLen}}</td>
				<td>{{item.aboveGroundSumArea}}</td>
				<td>{{item.underGroundSumArea}}</td>
				<td>{{item.buildings}}</td>
				<td>{{item.housingStockNum}}</td>
			</tr>
		</table>
	</section>
</template>

<script>
	import { getView001, getPrjClasfiNames, queryDataByLike, downloadView001 } from '../../api/api';
	import util from '../../common/js/util';
	import FileSaver from 'file-saver';

	export default {
		data() {
			return {
				loading: false,
				isShowFilter: true,
				showColOption: [
					{ label: '年份', value: 'prjYear'},
					{ label: '建设位置', value: 'prjAdr'},
					{ label: '一级分类', value: 'prjClasfiName1'},
					{ label: '二级分类', value: 'prjClasfiName2'},
					{ label: '三级分类', value: 'prjClasfiName3'},
					{ label: '四级分类', value: 'prjClasfiName4'},
					{ label: '五级分类', value: 'prjClasfiName5'}
				],
				showCol: [],
				filters: {
					prjYear: [],
					prjAdr: [],
					prjClasfiName1: [],
					prjClasfiName2: [],
					prjClasfiName3: [],
					prjClasfiName4: [],
					prjClasfiName5: []
				},
				yearOptions: [],
				prjAdrOptions: [],
				prjClasfiName1Options: [],
				prjClasfiName2Options: [],
				prjClasfiName3Options: [],
				prjClasfiName4Options: [],
				prjClasfiName5Options: [],
				viewList: [],
				listLoading: false,
				total: 0,
				pageNum: 1,
				pageSize: util.paginationSize[0],
				paginationSize: util.paginationSize
			}
		},
		methods: {
			handleSizeChange(pageSize) {
				this.pageSize = pageSize;
				this.getView001();
			},
			handleCurrentChange(pageNum) {
				this.pageNum = pageNum;
				this.getView001();
			},
			getView001() {
				const param = {};
				let isQuery = false;
				for (let key in this.filters) {
					if (this.filters[key].length) {
						isQuery = true;
						param[key] = this.filters[key];
					}
				}

				if (!isQuery) {
					this.$message({ message: '请您先选择过滤条件', type: 'error' });
					return;
				}
				this.listLoading = true;

				getView001(param, this.pageSize, this.pageNum).then((resp) => {
					this.listLoading = false;
					if (resp.header.rspReturnCode !== '000000') {
						this.$message({
							message: resp.header.rspReturnMsg,
							type: 'error'
						});
						return;
					}

					this.total = resp.header.rspPageCount;
					this.viewList = resp.viewList;
				});
			},

			filterPrjAdrMethod(query) {
				if (!query) { return; }
				queryDataByLike({tab: 'xmjbxx', key: 'prjAdr', val: query}).then(resp => {

					if (resp.header.rspReturnCode !== '000000') {
						this.$message({message: resp.header.rspReturnMsg, type: 'error'});
						return;
					}
					this.prjAdrOptions = resp.list;
				});
				
			},

			queryPrjClasfiName(query, type) {
				if (!query) {
					this[`prjClasfiName${type}Options`] = [];
					return;
				}
				const param = {
					name: query,
					type: 'FJ',
					other: type
				};

				getPrjClasfiNames(param).then(resp => {
					if (resp.header.rspReturnCode !== '000000') {
						this.$message({
							message: resp.header.rspReturnMsg,
							type: 'error'
						});
						return;
					}

					this[`prjClasfiName${type}Options`] = resp.classifiDicList;
				});
			},
			filterPrjClasfiName1Method(query) {
				this.queryPrjClasfiName(query, '1');
			},

			filterPrjClasfiName2Method(query) {
				this.queryPrjClasfiName(query, '2');
			},

			filterPrjClasfiName3Method(query) {
				this.queryPrjClasfiName(query, '3');
			},

			filterPrjClasfiName4Method(query) {
				this.queryPrjClasfiName(query, '4');
			},

			filterPrjClasfiName5Method(query) {
				this.queryPrjClasfiName(query, '5');
			},
			exportExcel() {
				
				const param = {};
				const filterArray = [];
				let isQuery = false;
				for (let key in this.filters) {
					if (this.filters[key].length) {
						isQuery = true;
						param[key] = this.filters[key];
						filterArray.push(`<input name="${key}" value="${this.filters[key]}"/>`);
					}
				}

				if (!isQuery) {
					this.$message({ message: '请您先选择过滤条件', type: 'error' });
					return;
				}

				const col = ['count', 'sumArea', 'sumLen', 'aboveGroundSumArea', 'underGroundSumArea', 'buildings', 'housingStockNum'];
				const col1 = this.showCol.map((item) => item.value);
				param.export = true;
				param.vhead = [...col1, ...col];
				this.loading = true;
				downloadView001(param, 99999, 1).then((resp) => {
					this.loading = false;
					const data = new Blob([resp], {
						type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
					});
					FileSaver.saveAs(data, `复合统计(全部).xlsx`);
				}).catch(error => {
					this.loading = false;
					this.$message({ message: error, type: 'error' });
				});
			},
			exportCurrentPageExcel() {
				const table = document.getElementById('exportTable');
				util.exportExcel(table, '复合统计(当前页)');
			}

		},
		mounted() {
			const y = new Date().getFullYear();
			for (let i = 0; i < 20; i++) {
				this.yearOptions.push(y - i);
			}
		}
	}
</script>

<style scope>
	#exportTable {display: none;}
	#view001 .el-form-item__content {width: 100%;}

	.filter-form {
		transition: height 1s;
		-moz-transition: height 1s;	/* Firefox 4 */
		-webkit-transition: height 1s;	/* Safari 和 Chrome */
		-o-transition: height 1s;	/* Opera */
		overflow: auto;
	}
	.show{height: 150px;}
	.hide{height: 0;}
</style>