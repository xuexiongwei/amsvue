<template>
	<section id="view002" v-loading="loading" element-loading-text="导出数据中"
		element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
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
					<el-input v-model="filters.prjName" placeholder="工程名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.prjType" placeholder="请选择建设类型" style="width: 100%;">
						<el-option v-for="item in prjTypeOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.prjStatus" placeholder="请选择项目状态" style="width: 100%;">
						<el-option v-for="item in prjStatusOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.prjSNType" placeholder="请选择许可证类型" style="width: 100%;">
						<el-option v-for="item in prjSNTypeOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.prjMark" placeholder="请选择许可证类型" style="width: 100%;">
						<el-option v-for="item in prjMarkOptions" :key="item.id" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="width:23%;">
					<el-button type="primary" v-on:click="getView002">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table v-if="tableHeight > 0" :data="viewList" highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight" stripe border>
			<el-table-column type="expand">
				<template slot-scope="props">
					<el-form label-position="left" class="demo-table-expand">
						<el-form-item label="许可证号"><span>{{ props.row.prjSN }}</span></el-form-item>
						<el-form-item label="项目状态"><span>{{ props.row.prjStatus }}</span></el-form-item>
						<el-form-item label="建设单位"><span>{{ props.row.prjUnit }}</span></el-form-item>
						<el-form-item label="建设位置"><span>{{ props.row.prjAdr }}</span></el-form-item>
						<el-form-item label="工程名称"><span>{{ props.row.prjName }}</span></el-form-item>
						<el-form-item label="项目类型"><span>{{ props.row.prjType }}</span></el-form-item>
						<el-form-item label="项目性质"><span>{{ props.row.prjXz }}</span></el-form-item>
						<el-form-item label="联系人"><span>{{ props.row.contacts }}</span></el-form-item>
						<el-form-item label="联系方式"><span>{{ props.row.contactInf }}</span></el-form-item>
						<el-form-item label="特别告知事项"><span>{{ props.row.specialNotifi }}</span></el-form-item>
						<el-form-item label="附带临建批号">
							<template v-for="prjTemSNItem in remarkAddClickTag(props.row.prjTemSN)">
								<span v-if="!prjTemSNItem.isHref">{{prjTemSNItem.val}}</span>
								<el-button v-if="prjTemSNItem.isHref" size="small" @click="goProject(prjTemSNItem.val)">{{prjTemSNItem.val}}</el-button>
							</template>
						</el-form-item>
						<el-form-item label="备注">
							<template v-for="remarkItem in remarkAddClickTag(props.row.remark)">
								<span v-if="!remarkItem.isHref">{{remarkItem.val}}</span>
								<el-button v-if="remarkItem.isHref" size="small" @click="goProject(remarkItem.val)">{{remarkItem.val}}</el-button>
							</template>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>
			<el-table-column prop="prjSN" label="许可证号" width="200">
				<template slot-scope="scope">
					<a @click="goDetailReport(scope.row.prjSN)">{{scope.row.prjSN}}</a>
				</template>
			</el-table-column>
			<el-table-column prop="prjStatus" label="项目状态" width="130"></el-table-column>
			<el-table-column label="建设单位" width="200">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p><span>{{scope.row.prjUnit}}</span></p>
						<div slot="reference" class="name-wrapper nowrap-text">
							<span>{{scope.row.prjUnit}}</span>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column label="建设位置" width="200">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p><span>{{scope.row.prjAdr}}</span></p>
						<div slot="reference" class="name-wrapper nowrap-text">
							<span>{{scope.row.prjAdr}}</span>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column  label="工程名称" width="150">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p><span>{{scope.row.prjName}}</span></p>
						<div slot="reference" class="name-wrapper nowrap-text">
							<span>{{scope.row.prjName}}</span>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="prjType" label="项目类型" width="150"></el-table-column>
			<el-table-column label="项目性质" width="150">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p><span>{{scope.row.prjXz}}</span></p>
						<div slot="reference" class="name-wrapper nowrap-text">
							<span>{{scope.row.prjXz}}</span>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="contacts" label="联系人" width="150"></el-table-column>
			<el-table-column prop="contactInf" label="联系方式" width="200"></el-table-column>
			<el-table-column prop="prjMark" label="项目标识" width="150"></el-table-column>
			<el-table-column prop="prjSNType" label="许可证类型" width="150"></el-table-column>
			<el-table-column label="延期文号" width="150">
				<template slot-scope="scope">
					<el-button v-if="scope.row.delaySN" size="small" @click="showImg(scope.row.delaySN, scope.row.prjSN)">{{scope.row.delaySN}}</el-button>
				</template>
			</el-table-column> 
			<el-table-column prop="delayCountDay" label="延长期" width="150"></el-table-column>
			<el-table-column label="补正证号" width="150"> 
				<template slot-scope="scope">
					<el-button v-if="scope.row.correctionSN" size="small" @click="showImg(scope.row.correctionSN, scope.row.prjSN)">{{scope.row.correctionSN}}</el-button>
				</template>
			</el-table-column>  
			<el-table-column prop="correctionDate" label="补正日期" width="150"></el-table-column>
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
			<el-table-column label="附带临建批号" width="250">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p>
							<template v-for="prjTemSNItem in remarkAddClickTag(scope.row.prjTemSN)">
								<span v-if="!prjTemSNItem.isHref">{{prjTemSNItem.val}}</span>
								<el-button v-if="prjTemSNItem.isHref" size="small" @click="goProject(prjTemSNItem.val)">{{prjTemSNItem.val}}</el-button>
							</template>
						</p>
						<div slot="reference" class="name-wrapper nowrap-text">
							<template v-for="prjTemSNItem in remarkAddClickTag(scope.row.prjTemSN)">
								<span v-if="!prjTemSNItem.isHref">{{prjTemSNItem.val}}</span>
								<el-button v-if="prjTemSNItem.isHref" size="small" @click="goProject(prjTemSNItem.val)">{{prjTemSNItem.val}}</el-button>
							</template>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column prop="prjXz" label="影像" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="viewMapHandler(scope.row.prjSN)">查看地图</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="remark" label="备注" width="150">
				<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p>
							<template v-for="remarkItem in remarkAddClickTag(scope.row.remark)">
								<span v-if="!remarkItem.isHref">{{remarkItem.val}}</span>
								<el-button v-if="remarkItem.isHref" size="small" @click="goProject(remarkItem.val)">{{remarkItem.val}}</el-button>
							</template>
						</p>
						<div slot="reference" class="name-wrapper nowrap-text">
							<template v-for="remarkItem in remarkAddClickTag(scope.row.remark)">
								<span v-if="!remarkItem.isHref">{{remarkItem.val}}</span>
								<el-button v-if="remarkItem.isHref" size="small" @click="goProject(remarkItem.val)">{{remarkItem.val}}</el-button>
							</template>
						</div>
					</el-popover>
				</template>
			</el-table-column>
			<el-table-column label="附图" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="viewImgHandler(scope.row.prjSN)">附图</el-button>
				</template>
			</el-table-column>
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
				<td>项目状态</td>
				<td>建设单位</td>
				<td>建设位置</td>
				<td>工程名称</td>
				<td>项目类型</td>
				<td>项目性质</td>
				<td>联系人</td>
				<td>联系方式</td>
				<td>项目标识</td>
				<td>许可证类型</td>
				<td>延期文号</td>
				<td>延长期</td>
				<td>补正证号</td>
				<td>补正日期</td>
				<td>特别告知事项</td>
				<td>附带临建批号</td>
				<td>影像</td>
				<td>备注</td>
			</tr>
			<tr v-for="item in viewList">
				<td>{{item.prjStatus}}</td>
				<td>{{item.prjUnit}}</td>
				<td>{{item.prjAdr}}</td>
				<td>{{item.prjName}}</td>
				<td>{{item.prjType}}</td>
				<td>{{item.prjXz}}</td>
				<td>{{item.contacts}}</td>
				<td>{{item.contactInf}}</td>
				<td>{{item.prjMark}}</td>
				<td>{{item.prjSNType}}</td>
				<td>{{item.delaySN}}</td>
				<td>{{item.delayCountDay}}</td>
				<td>{{item.correctionSN}}</td>
				<td>{{item.correctionDate}}</td>
				<td>{{item.specialNotifi}}</td>
				<td>{{item.prjTemSN}}</td>
				<td>{{item.prjXz}}</td>
				<td>{{item.remark}}</td>
			</tr>
		</table>

		<el-dialog :visible.sync="isShowMap" :fullscreen=true title="查看地图">
			<ams-map v-if="isShowMap" :prjSN="prjSNToMap"></ams-map>
		</el-dialog>

		<el-dialog :visible.sync="projectViewParam.show" title="查询项目基本信息" top="3vh">
			<ams-project-view v-if="projectViewParam.show" :prjSN="projectViewParam.prjSN"></ams-project-view>
		</el-dialog>

		<el-dialog :visible.sync="isShowImg" :fullscreen=true  title="查看">
			<ams-show-img v-if="isShowImg" :fileName="fileName" :prjSN="prjSN" :moreImg="moreImg"></ams-show-img>
		</el-dialog>

	</section>
</template>

<script>
	import { getView002, downloadView002 } from '../../api/api';
	import util from '../../common/js/util';
	import AmsMapVue from '../AmsMap.vue';
	import ProjectViewVue from '../project/ProjectView.vue';
	import ShowImg from './ShowImg';
	import FileSaver from 'file-saver';

	export default {
		data() {
			return {
				loading: false,
				prjSNToMap: '',
				isShowMap: false,
				filters: {
					prjSN: '',
					prjUnit: '',
					prjSNType: '',
					prjStatus: '',
					prjAdr: '',
					prjName: '',
					prjType: '',
					prjMark: ''
				},
				viewList: [],
				listLoading: false,
				total: 0,
				pageNum: 1,
				pageSize: util.paginationSize[0],
				paginationSize: util.paginationSize,
				prjSNTypeOptions: util.prjSNTypeOptions,
				prjStatusOptions: util.prjStatusOptions,
				prjTypeOptions: util.prjTypeOptions,
				prjMarkOptions: util.prjMarkOptions,
				projectViewParam: {
					prjSNTem: '',
					show: false
				},
				tableHeight: 0,
				isShowImg: false,
				fileName: '',
				prjSN: '',
				moreImg: false
			}
		},
		methods: {
			goDetailReport(prjSN) {
				this.$router.push({ path: `/view003/${prjSN}` });
			},
			viewImgHandler(_prjSN) {
				this.moreImg = true;
				this.prjSN = _prjSN;
				this.isShowImg = true;
			},
			showImg(_fileName, _prjSN) {
				this.moreImg = false;
				this.fileName = _fileName;
				this.prjSN = _prjSN;
				this.isShowImg = true;
			},
			goProject(prjSN) {
				this.projectViewParam.prjSN = prjSN;
				this.projectViewParam.show = true;
			},
			viewMapHandler(prjSN) {
				this.prjSNToMap = prjSN;
				this.isShowMap = true;
			},
			handleSizeChange(pageSize) {
				this.pageSize = pageSize;
				this.getView002();
			},
			handleCurrentChange(pageNum) {
				this.pageNum = pageNum;
				this.getView002();
			},
			getView002() {
				this.listLoading = true;
				const param = this.filters;
				getView002(param, this.pageSize, this.pageNum)
				.then((resp) => {
					this.listLoading = false;
					if (resp.header.rspReturnCode !== '000000') {
						this.$message({
							message: resp.header.rspReturnMsg,
							type: 'error'
						});
						return;
					}

					this.viewList = resp.viewList;
					this.total = resp.header.rspPageCount;
					this.tableHeight = window.screen.availHeight - 450;
				}).catch(error => {
					this.loading = false;
					this.$message({ message: error, type: 'error' });
				});
			},
			exportCurrentPageExcel() {
				const table = document.getElementById('exportTable');
				util.exportExcel(table, '项目信息统计数据（当前页）');
			},
			exportExcel() {
				this.loading = true;
				const param = this.filters;
				param.export = true;
				downloadView002(param, 99999, 1).then((resp) => {
					this.loading = false;
					const data = new Blob([resp], {
						type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
					});
					FileSaver.saveAs(data, `项目信息统计数据(全部).xlsx`);
				}).catch(error => {
					this.loading = false;
					this.$message({ message: error, type: 'error' });
				});
			}
		},
		mounted() {
			const index = this.$route.params.prjSNType;
			if (!isNaN(index)) {
				this.filters.prjSNType = this.prjSNTypeOptions[Number(index)].value;
			} else {
				this.filters.prjSNType = '';
			}
			this.getView002();
			
		},
		watch: {
			'$route' (to, from) {
				const index = to.params.prjSNType;
				if (!isNaN(index)) {
					this.filters.prjSNType = this.prjSNTypeOptions[Number(index)].value;
				} else {
					this.filters.prjSNType = '';
				}
				this.getView002();
			}
		},
		filters: {
			remarkFilter(value) {
				const valueArray = [];
				valueArray.push(
					{val: '111', isHref: false},
					{val: '222', isHref: true},
					{val: '333', isHref: false},
					{val: '444', isHref: false}
				);
				return valueArray;
			}
		},
		components: {
			'ams-map': AmsMapVue,
			'ams-project-view': ProjectViewVue,
			'ams-show-img': ShowImg
		}
	}
</script>

<style lang="scss" scoped>
	#view002 {
		.el-dialog__body {padding-top: 0;}

		#exportTable { display: none; }

		a {
			cursor: pointer;
		}
	}

	a.remark-a {
		color: red;
		cursor: pointer;
		&:hover {
			color: blue;
		}
	}

</style>
