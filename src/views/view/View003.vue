<template>
	<section id="view003Page">
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-select v-model="filters.prjSN" filterable remote reserve-keyword placeholder="请录入许可证号" 
						:remote-method="filterPrjSNMethod" collapse-tags :title="filters.prjSN" style="width:350px">
						<el-option v-for="item in prjSNOptions" :key="item" :label="item" :value="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getView003">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="exportView003">导出</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<p v-if="isShowEmptyInfo" class="emptyInfo">
			<span v-if="showType === '1'">请您输入许可证号，查询统计数据</span>
			<span v-if="showType === '2'">该许可证下，未统计到任何数据</span>
		</p>

		<h3>{{prjClasfiName1}}</h3>
		<div v-for="prjClasfiName2Obj in prjClasfiName2List" style="width: 100%;">

			<p>{{prjClasfiName2Obj.title}}</p>

			<el-table :data="prjClasfiName2Obj.list" highlight-current-row v-loading="listLoading" style="width: 100%;" :height="tableHeight" stripe border>
				<el-table-column type="expand">
					<template slot-scope="scope">
						<el-table :data="scope.row.detailList" highlight-current-row v-loading="listLoading" stripe border>
							<el-table-column width="150">
								<template slot-scope="scope">
									{{ scope.row.detailName ||  scope.row.serialFunct}}
								</template>
							</el-table-column>
							
							<el-table-column label="总建筑面积(平方米)">
								<el-table-column prop="aboveGroundArea" label="地上" width="120"></el-table-column>
								<el-table-column prop="underGroundArea" label="地下" width="120"></el-table-column>
							</el-table-column>
							<el-table-column prop="blendArea" label="混合建筑面积" width="150"></el-table-column>
							<el-table-column prop="aboveGroundLen" label="地上建筑长度" width="150"></el-table-column>
							<el-table-column label="建筑类型" width="200">
								<template slot-scope="scope">
									<el-popover trigger="hover" placement="top">
										<p>{{ scope.row.buldType }}</p>
										<div slot="reference" class="name-wrapper">{{ scope.row.buldType }}</div>
									</el-popover>
								</template>
							</el-table-column>
						</el-table>
					</template>
				</el-table-column>
				<el-table-column prop="serialNumber" width="120" label="建筑序号"></el-table-column>
				<el-table-column label="项目性质" width="200">
					<template slot-scope="scope">
						<el-popover trigger="hover" placement="top">
							<p>{{ scope.row.prjNature }}</p>
							<div slot="reference" class="name-wrapper">{{ scope.row.prjNature }}</div>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column prop="sumArea" label="总建筑面积(平方米)" width="150"></el-table-column>
				<el-table-column label="总建筑面积(平方米)">
					<el-table-column prop="aboveGroundSumArea" label="地上" width="120"></el-table-column>
					<el-table-column prop="underGroundSumArea" label="地下" width="120"></el-table-column>
				</el-table-column>
				<el-table-column prop="sumLen" label="总建筑长度(米)" width="150"></el-table-column>
				<el-table-column label="层数">
					<el-table-column prop="aboveGroundLev" label="地上" width="120"></el-table-column>
					<el-table-column prop="underGroundLev" label="地下" width="120"></el-table-column>
				</el-table-column>
				<el-table-column label="高度">
					<el-table-column prop="aboveGroundHet" label="地上" width="120"></el-table-column>
					<el-table-column prop="underGroundHet" label="地下" width="120"></el-table-column>
				</el-table-column>
				<el-table-column prop="buildings" label="栋数" width="150"></el-table-column>
				<el-table-column prop="housingStockNum" label="住房套数" width="150"></el-table-column>
				<el-table-column prop="buldStatus" label="工程状态" width="150"></el-table-column>
				<el-table-column label="平时用途" width="150">
					<template slot-scope="scope">
					<el-popover trigger="hover" placement="top">
						<p><span>{{scope.row.peacetimeUses}}</span></p>
						<div slot="reference" class="name-wrapper nowrap-text">
							<span>{{scope.row.peacetimeUses}}</span>
						</div>
					</el-popover>
				</template>
				</el-table-column>
				<el-table-column label="结构类型" width="150">
					<template slot-scope="scope">
						<el-popover trigger="hover" placement="top">
							<p>{{ scope.row.strucType }}</p>
							<div slot="reference" class="name-wrapper">{{ scope.row.strucType }}</div>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column label="验线文号" width="150">
					<template slot-scope="scope">
						<el-button v-if="scope.row.checkDocSN" size="small" @click="showImg(scope.row.checkDocSN)">{{scope.row.checkDocSN}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="checkDocDate" label="验线时间" width="150"></el-table-column>
				<el-table-column label="验收文号" width="120">
					<template slot-scope="scope">
						<el-button v-if="scope.row.checkSN" size="small" @click="showImg(scope.row.checkSN)">{{scope.row.checkSN}}</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="checkDate" label="验收日期" width="120"></el-table-column>
				<el-table-column prop="cancelSN" label="撤（注）销证号" width="240">
					<template slot-scope="scope">
						<el-popover trigger="hover" placement="top">
							<p>
								<template v-for="cancelSNItem in remarkAddClickTag(scope.row.cancelSN)">
									<span v-if="!cancelSNItem.isHref">{{cancelSNItem.val}}</span>
									<el-button v-if="cancelSNItem.isHref" size="small" @click="goProject(cancelSNItem.val)">{{cancelSNItem.val}}</el-button>
								</template>
							</p>
							<div slot="reference" class="name-wrapper nowrap-text">
								<template v-for="cancelSNItem in remarkAddClickTag(scope.row.cancelSN)">
									<span v-if="!cancelSNItem.isHref">{{cancelSNItem.val}}</span>
									<el-button v-if="cancelSNItem.isHref" size="small" @click="goProject(cancelSNItem.val)">{{cancelSNItem.val}}</el-button>
								</template>
							</div>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column prop="cancelDate" label="撤（注）销日期" width="120"></el-table-column>
				<el-table-column label="影像判读结果" width="120">
					<template slot-scope="scope">
						<el-popover trigger="hover" placement="top">
							<p>{{ scope.row.imgJudgeRes }}</p>
							<div slot="reference" class="name-wrapper">{{ scope.row.imgJudgeRes }}</div>
						</el-popover>
					</template>
				</el-table-column>
				<el-table-column prop="exproprInfo" label="代征用地情况" width="120">
					<template slot-scope="scope">
						<el-popover trigger="hover" placement="top">
							<p>{{ scope.row.exproprInfo }}</p>
							<div slot="reference" class="name-wrapper">{{ scope.row.exproprInfo }}</div>
						</el-popover>
					</template>
				</el-table-column>
				</el-table-column>
				<el-table-column label="备注" width="120">
					<template slot-scope="scope">
						<el-popover trigger="hover" placement="top">
							<p>{{ scope.row.remark }}</p>
							<div slot="reference" class="name-wrapper">{{ scope.row.remark }}</div>
						</el-popover>
					</template>
				</el-table-column>
			</el-table>
		</div>

		
		<el-dialog :visible.sync="isShowImg" :fullscreen=true  title="查看">
			<ams-show-img v-if="isShowImg" :fileName="fileName" :prjSN="filters.prjSN"></ams-show-img>
		</el-dialog>

		<el-dialog :visible.sync="projectViewParam.show" title="查询项目基本信息" top="3vh">
			<ams-project-view v-if="projectViewParam.show" :prjSN="projectViewParam.prjSN"></ams-project-view>
		</el-dialog>

		<div style="height:0;width:0;overflow:hidden;">
			<div id="exportTable1" style="width: 5000px;">
				<h2>{{prjClasfiName1}}</h2>
				<div v-for="prjClasfiName2Obj in prjClasfiName2List">
					<h1>{{prjClasfiName2Obj.title}}</h1>
					<table>
						<thead>
							<tr>
								<th rowspan="2" style="width:180px;">建筑序号</th>
								<th rowspan="2" style="width:180px;">项目性质</th>
								<th rowspan="2" style="width:180px;">总建筑面积(平方米)</th>
								<th colspan="2" style="width:180px;">总建筑面积(平方米)</th>
								<th rowspan="2" style="width:180px;">总建筑长度(米)</th>
								<th colspan="2" style="width:180px;">层数</th>
								<th colspan="2" style="width:180px;">高度</th>
								<th rowspan="2" style="width:180px;">栋数</th>
								<th rowspan="2" style="width:180px;">住房套数</th>
								<th rowspan="2" style="width:180px;">工程状态</th>
								<th rowspan="2" style="width:180px;">平时用途</th>
								<th rowspan="2" style="width:180px;">结构类型</th>
								<th rowspan="2" style="width:180px;">验线文号</th>
								<th rowspan="2" style="width:180px;">验线时间</th>
								<th rowspan="2" style="width:180px;">验收文号</th>
								<th rowspan="2" style="width:180px;">验收时间</th>
								<th rowspan="2" style="width:180px;">撤（注）销证号</th>
								<th rowspan="2" style="width:180px;">撤（注）销日期</th>
								<th rowspan="2" style="width:180px;">影像判读结果</th>
								<th rowspan="2" style="width:180px;">代征用地情况</th>
								<th rowspan="2" style="width:180px;">备注</th>
							</tr>
							<tr>
								<th>地上</th>
								<th>地下</th>
								<th>地上</th>
								<th>地下</th>
								<th>地上</th>
								<th>地下</th>
							</tr>
						</thead>

						<tbody>
							<template v-for="item in prjClasfiName2Obj.list">
								<tr>
									<td>{{item.serialNumber}}</td>
									<td>{{item.prjNature}}</td>
									<td>{{item.sumArea}}</td>
									<td>{{item.aboveGroundSumArea}}</td>
									<td>{{item.underGroundSumArea}}</td>
									<td>{{item.sumLen}}</td>
									<td>{{item.aboveGroundLev}}</td>
									<td>{{item.underGroundLev}}</td>
									<td>{{item.aboveGroundHet}}</td>
									<td>{{item.underGroundHet}}</td>
									<td>{{item.buildings}}</td>
									<td>{{item.housingStockNum}}</td>
									<td>{{item.buldStatus}}</td>
									<td>{{item.peacetimeUses}}</td>
									<td>{{item.strucType}}</td>
									<td>{{item.checkDocSN}}</td>
									<td>{{item.checkDocDate}}</td>
									<td>{{item.checkSN}}</td>
									<td>{{item.checkDate}}</td>
									<td>{{item.cancelSN}}</td>
									<td>{{item.cancelDate}}</td>
									<td>{{item.imgJudgeRes}}</td>
									<td>{{item.exproprInfo}}</td>
									<td>{{item.remark}}</td>
								</tr>
								<tr>
									<td colspan="27">
										<table>
											<thead>
												<tr>
													<th rowspan="2" style="width: 150px;">&nbsp;</th>
													<th colspan="2" style="width: 150px;">总建筑面积（平方米）</th>
													<th rowspan="2" style="width: 150px;">混合建筑面积</th>
													<th rowspan="2" style="width: 150px;">地上建筑长度</th>
													<th rowspan="2" style="width: 150px;">建筑类型</th>
												</tr>
												<tr>
													<th>地上</th>
													<th>地下</th>
												</tr>
											</thead>
											<tbody>
												<template v-for="item1 in item.detailList">
													<tr v-if="item1.detailName">
														<td colspan="6" style="text-align: left;">{{item1.detailName}}</td>
													</tr>
													<tr v-if="!item1.detailName">
														<td>{{item1.serialFunct}}</td>
														<td>{{item1.aboveGroundArea}}</td>
														<td>{{item1.underGroundArea}}</td>
														<td>{{item1.blendArea}}</td>
														<td>{{item1.aboveGroundLen}}</td>
														<td>{{item1.buldType}}</td>
													</tr>
												</template>
											</tbody>
										</table>
									</td>
								</tr>
							</template>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
	import { getView003, queryDataByLike } from '../../api/api';
	import FileSaver from 'file-saver';
	import ProjectViewVue from '../project/ProjectView.vue';
	import ShowImg from './ShowImg';

	export default {
		data() {
			return {
				filters: {
					prjSN: ''
				},
				showType: '1',
				isShowEmptyInfo: true,
				prjClasfiName1: '',
				prjClasfiName2List: [],
				prjSNOptions: [],
				listLoading: false,
				fileName: '',
				isShowImg: false,
				tableHeight: 0,
				projectViewParam: {
					prjSNTem: '',
					show: false
				},
			}
		},
		methods: {
			goProject(prjSN) {
				this.projectViewParam.prjSN = prjSN;
				this.projectViewParam.show = true;
			},
			showImg(_fileName) {
				this.fileName = _fileName;
				this.isShowImg = true;
			},
			filterPrjSNMethod(query) {

				if (!query) {
					return;
				}

				queryDataByLike({tab: 'xmjbxx', key: 'prjSN', val: query}).then(resp => {

					if (resp.header.rspReturnCode !== '000000') {
						this.$message({message: resp.header.rspReturnMsg, type: 'error'});
						return;
					}
					this.prjSNOptions = resp.list;
				});
			},
			exportView003() {
				if (!this.prjClasfiName1) {
					this.$message({ message: '请您先输入正确的许可证号，统计相应的数据后，再进行导出', type: 'error' });
					return;
				}

				const a = document.getElementById('exportTable1');
				html2canvas(a).then(canvas => {
					FileSaver.saveAs(canvas.toDataURL(), `项目详情统计.png`);
				});
			},
			getView003() {
				if (!this.filters.prjSN) {
					this.$message({ message: '请您先选择过滤条件', type: 'error' });
					return;
				}

				getView003({prjSN: this.filters.prjSN}).then(resp => {
					if (resp.header.rspReturnCode !== '000000') {
						this.$message({ message: resp.header.rspReturnMsg, type: 'error' });
						return;
					}

					const arr = Object.keys(resp.viewList);

					if (arr.length) {
						this.isShowEmptyInfo = false;
						for (let prjClasfiName1 in resp.viewList) {
							this.prjClasfiName1 = prjClasfiName1 + ':';
							this.prjClasfiName2List = [];
							for (let prjClasfiName2Title in resp.viewList[prjClasfiName1]) {

								const prjClasfiName2ListTem = [];

								for (let prjClasfiName2Obj in resp.viewList[prjClasfiName1][prjClasfiName2Title]) {
									const tj = resp.viewList[prjClasfiName1][prjClasfiName2Title][prjClasfiName2Obj].tongj;
									if (tj) {
										tj.detailList = [];
										for (let detailName in resp.viewList[prjClasfiName1][prjClasfiName2Title][prjClasfiName2Obj].detail) {
											tj.detailList.push({detailName: detailName});
		
											if (!!resp.viewList[prjClasfiName1][prjClasfiName2Title][prjClasfiName2Obj].detail[detailName]) {
												for (let i in resp.viewList[prjClasfiName1][prjClasfiName2Title][prjClasfiName2Obj].detail[detailName]) {
													tj.detailList.push(resp.viewList[prjClasfiName1][prjClasfiName2Title][prjClasfiName2Obj].detail[detailName][i]);
												}
											}
										}
										prjClasfiName2ListTem.push(tj);
									}
								}

								
								this.prjClasfiName2List.push(
									{
										title: prjClasfiName2Title + ':',
										list: prjClasfiName2ListTem
									}
								);
							}
						}
					} else {
						this.$message({ message: '该许可证下，未统计到任何数据', type: 'error' });
						this.showType = '2';

						window.setTimeout(() => {
							this.showType = '1';
						}, 5000);
					}

					
				});
			}
		},
		components: {
			'ams-show-img': ShowImg,
			'ams-project-view': ProjectViewVue
		},
		mounted() {
			this.tableHeight = window.screen.availHeight - 500;
			this.filters.prjSN = this.$route.params.prjSN;
			if (this.filters.prjSN) {
				this.getView003();
			}
		}
	}
</script>

<style lang="scss" scoped>
	#exportTable1 {
		th {background-color: #b7b5b5;}
		td {border: 1px solid #000;}
	}

	#view003Page {
		.el-table {
			div.cell {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				.name-wrapper {
					overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				}
			}
		}

		.emptyInfo {
			display: inline-block;
			width: 100%;
			font-size: 20px;
			text-align: center;
		}
	}
</style>