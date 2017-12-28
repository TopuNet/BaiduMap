require(["/inc/zepto.min.js", "baidu_map", "mobile_stop_moved", "landscape_mask"], function($zepto, $baidu_map, $mobile_stop_moved, $landscape_mask) {

    $(function() {
        var opt = {
            selector: ".wrapper", // 容器盒选择器（resize_toWindow为false时，需要在样式表中将此盒定高），无默认值
            scroll: true, // 盒内可滚动，默认true
            resize_toWindow: true // 将容器盒自动设置为有效窗口高度(window.innerHeight)，并监听窗口大小改变——解决ios safari浏览器底部工具栏遮挡页面的问题，默认true
        };
        $mobile_stop_moved.init(opt);
        $landscape_mask.init();

        var baidu_map_para = {
            map_obj_id: "baidu_map", // 地图容器ID。无默认值。
            scroll_obj_selector: ".wrapper", // overflow为scroll的外盒。
            /* 当地图容器存在于一个overflow为scroll的外盒中时，
            需开启入场后再加载地图功能，以防止气泡不显示。*/
            enableScrollWheelZoom: false, // 允许滚轮缩放。默认值：true
            NavigationControl: true, // 左上角缩放尺。默认值：true
            ScaleControl: false, // 左下角比例尺。默认值：true
            OverviewMapControl: false, // 右下角小地图：true
            CurrentCity: "北京", // 当前城市。默认值：北京
            MapTypeControl: true, // 右上角地图种类，仅当设置当前城市后可用。默认值：true
            MapClickEnable: false

        };

        var map_obj = new $baidu_map();

        map_obj.init(baidu_map_para);

        map_obj.getCurrentPos(function(point) {
            map_obj.PointMarker({
                Zoom: 14,
                Points: [{
                    Keywords: "银河SOHO",
                    Bounce: false,
                    click_callback: function(marker) {

                        console.log("距离：" + map_obj.getDistance(point, marker.point));
                        // map_obj.locationToNavigator(point, marker.point);
                        // location.href = "http://api.map.baidu.com/direction?destination=39.89778,116.709684&mode=driving&region=北京&output=html";
                    }
                }, {
                    Keywords: "悠唐生活广场",
                    Label: "点marker弹层",
                    Bounce: true,
                    click_callback: function(marker) {
                        console.log("这是悠唐生活广场");

                        map_obj.PointMarkerInfo.apply(map_obj, [{
                            marker: marker, // 必须有
                            content: "这里是概述，支持html标签", // 内容，支持html标签
                            para: {
                                title: "悠唐", //标题
                                width: 300, //宽度
                                height: 50, //高度
                                // panel: "panel", //检索结果面板
                                enableAutoPan: true, //自动平移
                                searchTypes: [
                                    BMAPLIB_TAB_SEARCH, //周边检索
                                    BMAPLIB_TAB_TO_HERE, //到这里去
                                    BMAPLIB_TAB_FROM_HERE //从这里出发
                                ]
                            }
                        }]);
                    }
                }]
            });
        });


        /*
            Points: [{
                Keywords: "盈科中心 北京市朝阳区工人体育场北路甲2号",
                Bounce: true,
                click_callback: null
            }, {
                Keywords: "美林大厦",
                Bounce: false,
                click_callback: function() {
                    alert("这是美林大厦");
                }
            }],
            // SearchKeywords: "礼士宾馆", // 搜索关键词。无默认值
            Zoom: 16 // 默认缩放比例。默认值：16
        */
    });
});