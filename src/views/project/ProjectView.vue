<template>
	<section id="projectViewPage">

		<!--查看项目基本详情页面-->
		<el-form label-width="150px" size="medium" v-loading="listLoading">
			<el-form-item label="许可证号:" >{{formData.prjSN}}</el-form-item>
			<el-form-item label="建设单位:">{{formData.prjUnit}}</el-form-item>
			<el-form-item label="建设位置:">{{formData.prjAdr}}</el-form-item>
			<el-form-item label="工程名称:">{{formData.prjName}}</el-form-item>
			<el-form-item label="建设类型:">{{formData.prjType}}</el-form-item>
			<el-form-item label="联系人:">{{formData.contacts}}</el-form-item>
			<el-form-item label="联系方式:">{{formData.contactInf}}</el-form-item>
			<el-form-item label="附带临建批号:">{{formData.prjTemSN}}</el-form-item>
			<el-form-item label="许可证类型:">{{formData.prjSNType}}</el-form-item>
			<el-form-item label="发件日期:">{{formData.noticeTime}}</el-form-item>
			<el-form-item label="有效期:">{{formData.effectiveTime}}</el-form-item>
			<el-form-item label="延期文号:">{{formData.delaySN}}</el-form-item>
			<el-form-item label="延长期(月):">{{formData.delayCountDay}}</el-form-item>
			<el-form-item label="补正证号:">{{formData.correctionSN}}</el-form-item>
			<el-form-item label="补正日期:">{{formData.correctionDate}}</el-form-item>
			<el-form-item label="特别告知事项:">{{formData.specialNotifi}}</el-form-item>
			<el-form-item label="备注:">{{formData.remark}}</el-form-item>
		</el-form>
	</section>
</template>

<script>
	import util from '../../common/js/util';
	import { getProjectListPage } from '../../api/api';

	export default {
		data() {
			return {
				formData: {},
				listLoading: false
			};
		},
		methods: {
            getProjectListPage() {
				this.listLoading = true;
				const param = {prjSN: this.prjSN};
				getProjectListPage(param, 10, 1).then(resp => {
					this.listLoading = false;
					if (resp.header.rspReturnCode !== '000000') {
						this.$message({ message: resp.header.rspReturnMsg, type: 'error' });
						return;
					}

					if (!resp.xmjbxxList.length) {
						this.$message({ message: `未查询到许可证号为【${this.prjSN}】的项目基本信息`, type: 'error' });
						return;
					}

					if (resp.xmjbxxList.length > 1) {
						this.$message({ message: `许可证号为【${this.prjSN}】的项目基本信息有多条记录,默认取第一条数据`, type: 'error' });
					}

					this.formData = resp.xmjbxxList[0];

				});
			}
		},
		mounted() {
			if (!this.prjSN) {
				this.$message({ message: `许可证号【${this.prjSN}】不存在，不能查看相关基本信息页面`, type: 'error' });
				return;
			}

			this.getProjectListPage();
		},
        props: ['prjSN']
	}

</script>