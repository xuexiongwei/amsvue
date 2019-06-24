<template>
    <div id="map-root-div">
        <div id="map-filter-div">
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.jd"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.wd"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-on:click="makePoint">查询</el-button>
                    </el-form-item>
                    <el-form-item v-if="res.length">
                        <span>转换后,经度：{{res[0]}},维度：{{res[1]}}</span>
                    </el-form-item>
                </el-form>
            </el-col>
        </div>

        <div id="map-containt-div"></div>
    </div>
</template>

<script>

    import { getPointsByprjSN, convertZB } from '../api/api';

    export default {
		data() {
			return {
                filters: {
                    jd: '',
                    wd: ''
                },
                res: [],
				map: {}
			}
		},
		methods: {
            init() {
                this.map = new BMap.Map("map-containt-div");
                this.map.enableScrollWheelZoom();
                // 添加带有定位的导航控件
                var navigationControl = new BMap.NavigationControl({
                    // 靠左上角位置
                    anchor: BMAP_ANCHOR_TOP_LEFT,
                    // LARGE类型
                    type: BMAP_NAVIGATION_CONTROL_LARGE,
                    // 启用显示定位
                    enableGeolocation: true
                });
                this.map.addControl(navigationControl);
                this.map.setMapType(BMAP_HYBRID_MAP);//卫星&路网
            },
            drowBlock() {
                getPointsByprjSN({prjSN: this.prjSN}).then(resp => {
                    if (resp.header.rspReturnCode !== '000000') {
						this.$message({ message: resp.header.rspReturnMsg, type: 'error' });
						return;
					}

                    let points = resp.points;                    

                    for(let i = 0;i < points.length; i++){

                        let longlatVArray = points[i].longlatV.substring(0, points[i].longlatV.length - 1).split('|');
                        let psT = [];
                        for(var j = 0; j < longlatVArray.length; j++){
                            let p = longlatVArray[j].split(',');
                            
                            var mp = new BMap.Point(p[0], p[1]);
                            // 如果没有设置中心点 设置一个中心点
                            if (i === 0 && j === 0) {
                                if (points[i].entiryType === 'LWPOLYLINE') {
                                    this.map.centerAndZoom(mp, 14);
                                }
                                
                            }
                            psT.push(mp);

                            if (points[i].entiryType !== 'LWPOLYLINE') {
                                this.addMarker(mp, false);
                            }

                        }

                        if (points[i].entiryType === 'LWPOLYLINE') {
                            const a = new BMap.Polyline(psT);
                            // a.setStrokeColor('#ff8000');
                            this.map.addOverlay(a); // 画线         
                        }
                    }
                });
            },
            addMarker(point, enabledOperation) {
                var marker = new BMap.Marker(point);
                if (!enabledOperation) {
                    var url = './static/1.png';
                    
                    var icon = new BMap.Icon(url, new BMap.Size(20,60));
                    marker.setIcon(icon);
                    this.map.addOverlay(marker);
                    this.map.centerAndZoom(point, 18);
                    return;
                }
                marker.enableDragging();
                
                let label = new BMap.Label();
                
                label.setPosition(point);
                label.setOffset(new BMap.Size(10, -40));
                label.setStyle({fontSize: '16px', padding: '10px', border: '1px solid #fff', boxShadow: '0px 0px 30px 10px #abcdef', display: 'none'});
                marker.setLabel(label);
                
                marker.addEventListener('mouseover', () => {
                    const d = marker.getLabel();
                    if (!!d.content) {
                        marker.getLabel().setStyle({display: 'inline-block'});
                    }
                });

                marker.addEventListener('mouseout', () => {
                    marker.getLabel().setStyle({display: 'none'});
                });

                const menu = new BMap.ContextMenu();
                menu.addItem(new BMap.MenuItem('删除', (point, pixel, markerT) => {
                    this.map.removeOverlay(markerT);
                }, 100));
                menu.addItem(new BMap.MenuItem('维护名称', (pointT, pixel, markerT) => {
                    var opts = {
                        width : 200,
                        height: 60,
                        title : "维护节点名称",
                        enableMessage: false
                    }
                    const dd = document.createElement('input');
                    dd.value = markerT.getLabel().content || '';
                    var infoWindow = new BMap.InfoWindow(dd, opts);  // 创建信息窗口对象 
                    this.map.openInfoWindow(infoWindow, pointT);

                    dd.addEventListener('keyup', () => {
                        markerT.getLabel().setContent(infoWindow.getContent().value);
                    });

                }, 100));
                marker.addContextMenu(menu);
                this.map.addOverlay(marker);
                this.map.centerAndZoom(point, 18);
                
            },
            makePoint() {
                const param = {
                    jd: this.filters.jd,
                    wd: this.filters.wd
                };

                if (!param.jd || !param.wd) {
					this.$message({ message: '先输入大地坐标', type: 'error' });
					return;
				}

                convertZB(param).then(resp => {

                    if (resp.header.rspReturnCode !== '000000') {
						this.$message({ message: resp.header.rspReturnMsg, type: 'error' });
						return;
                    }
                    
                    this.res = resp.longlatV.split(',');
                    
                    const mp = new BMap.Point(this.res[0], this.res[1]);
                    this.addMarker(mp, true);
                });

                
            }
        },
        mounted() {
            this.init();
            this.drowBlock();
            
        },
        props: ['prjSN']
	}
</script>

<style scoped lang="scss">
    #map-containt-div {
        width: 100%;
        height: 728px;
    }
</style>