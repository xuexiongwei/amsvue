<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				<span v-if="!collapsed">{{sysName}}</span>
				<span v-if="!collapsed" style="font-size: 10px;">{{sysVersion}}</span>
			</el-col>
			<el-col :span="10">
				<div class="tools" @click.prevent="collapse">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar" /> {{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>我的消息</el-dropdown-item>
						<el-dropdown-item>设置</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<el-menu :default-active="activeMenuId" unique-opened v-show="!collapsed" @select="handleSelect">
					<el-submenu v-for="item in menuTree" :index="item.id" :key="item.id">
						<template slot="title"><i :class="item.iconCls"></i>{{item.menuName}}</template>
						<el-menu-item v-for="child in item.children" :index="child.id" :key="child.id">{{child.menuName}}</el-menu-item>
					</el-submenu>
				</el-menu>
				<!--导航菜单-折叠后-->
				<ul class="el-menu collapsed" v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in menuTree" class="el-submenu item">
						<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
							<i :class="item.iconCls"></i>
						</div>
						<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"> 
							<li v-for="child in item.children" :key="child.id" class="el-menu-item" style="padding-left: 40px;" 
								:class="$route.path==child.menuLink?'is-active':''" @click="$router.push(child.menuLink)">{{child.menuName}}</li>
						</ul>
					</li>
				</ul>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{breadcrumbData.length === 2 ? breadcrumbData[1].name : ''}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in breadcrumbData" :key="item.id">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>

	import { getMenuTree, logout } from '../api/api';
	import util from '../common/js/util';

	export default {
		data() {
			return {
				activeMenuId: '',
				sysName:'ams 系统',
				sysVersion: '1.0.7',
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '../../static/user.png',
				menuTree: [],
				breadcrumbData: [],
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}
			}
		},
		methods: {
			handleSelect(key, keyPath) {
				this.breadcrumbData = [];
				let menuItem;
				for(let i = 0; i < this.menuTree.length; i++) {
					if (this.menuTree[i].id === keyPath[0]) {
						this.breadcrumbData.push(
							{
								id: keyPath[0],
								name: this.menuTree[i].menuName
							}
						);
						menuItem = this.menuTree[i];
						break;
					}
				}

				for(let j = 0; j < menuItem.children.length; j++) {
					if (menuItem.children[j].id === keyPath[1]) {
						this.breadcrumbData.push(
							{
								id: keyPath[1],
								name: menuItem.children[j].menuName
							}
						);
						menuItem = menuItem.children[j];
						break;
					}
				}
				
				this.activeMenuId = menuItem.id;
				this.$router.push(menuItem.menuLink);	
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					logout({}).then(resp => {
						if (resp.header.rspReturnCode !== '000000') {
							this.$message({
								message: resp.header.rspReturnMsg,
								type: 'error'
							});
						} else {
							sessionStorage.removeItem('user');
							_this.$router.push('/login');
						}
					});
					
				});
			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			},
			getMenuTree(userId) {

				this.menuTree = util.menuTree;

				const a = this.$route.fullPath;
				util.menuTree.forEach(parentMenu => {
					parentMenu.children.forEach(menuItem => {
						if (menuItem.menuLink === a) {
							this.activeMenuId = menuItem.id;
							this.breadcrumbData.push(
								{ id: parentMenu.id, name: parentMenu.menuName }
							);
							this.breadcrumbData.push(
								{ id: menuItem.id, name: menuItem.menuName }
							);
						}
					})
				});
			}
		},
		mounted() {
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.sysUserName = user.name || '';
			}

			this.getMenuTree(user.id);
		}
	}

</script>

<style scoped lang="scss">
	@import '~scss_vars';
	
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: $color-primary;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				//width:230px;
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:230px;
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				.el-menu{
					height: 100%;
					width: 100%!important;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
						background: #fff;
    					min-width: 200px;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				flex:1;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}
</style>