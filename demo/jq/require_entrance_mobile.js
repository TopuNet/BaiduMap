require(["/inc/zepto.min.js"], function($zepto) {

    require(["functions", "baidu_map", "mobile_stop_moved", "landscape_mask"], function($func, $baidu_map, $mobile_stop_moved, $landscape_mask) {

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

                // 唤起app
                /*
                    @opt = {
                        app_kind: 0, // 1-百度地图 2-高德地图
                        destination: { // 目的地
                            lat: 0,
                            lng: 0,
                            title: "" // app_kind=1时有用。名称
                        }
                    }
                */
                var call_mapApp = function(opt) {
                    var app = $func.judge_mobile_os();
                    if (app == "ios")
                        app = 1;
                    else if (app == "android")
                        app = 2;
                    else
                        app = 0;
                    if (app != 0 && opt.app_kind == 2)
                        app += 2;

                    if ($func.judge_MicroMessenger()) {
                        location.href = encodeURI("demo_mobile_safari.html?app=" + app +
                            "&origin_pos_lat=" + point.lat + "&origin_pos_lng=" + point.lng +
                            "&destination_pos_lat=" + opt.destination.lat + "&destination_pos_lng=" + opt.destination.lng +
                            "&destination_title=" + opt.destination.title);
                    } else {
                        map_obj.locationToNavigator({
                            app: app,
                            mode: "driving",
                            origin_city: "北京",
                            origin_pos: point,
                            origin_title: "我的位置",
                            destination_city: "北京",
                            destination_pos: opt.destination,
                            destination_title: opt.destination.title,
                        });
                    }
                };

                map_obj.PointMarker({
                    Zoom: 14,
                    Points: [{
                        Keywords: "银河SOHO",
                        Label: "百度导航",
                        Bounce: false,
                        click_callback: function(marker) {
                            call_mapApp({
                                app_kind: 1,
                                destination: {
                                    lat: marker.point.lat,
                                    lng: marker.point.lng,
                                    title: "银河SOHO"
                                }
                            });
                        }
                    }, {
                        Keywords: "华润大厦",
                        Label: "高德导航",
                        Bounce: false,
                        click_callback: function(marker) {
                            var callback = function(r) {
                                call_mapApp({
                                    app_kind: 2,
                                    destination: {
                                        lat: r[1],
                                        lng: r[0],
                                        title: "香山" // 高德没用
                                    }
                                });
                            };
                            map_obj.coord_Baidu2Amap({
                                key: "73b91e3cb0a533a9ea9af731fafa9d28",
                                lat: marker.point.lat,
                                lng: marker.point.lng,
                                callback: callback
                            });
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

});