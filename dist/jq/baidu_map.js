// v3.3.2
/*
    that:{
        opt_init: init方法接收的参数,
        map_obj: map对象
    }
*/
function baidu_map() {
    return {
        // 初始化，一个地图盒只调用一次
        init: function(opt) {
            var that = this;

            var opt_default = {
                map_obj_id: null, // 地图容器ID。无默认值。
                scroll_obj_selector: null, // overflow为scroll的外盒选择器。
                /* 当地图容器存在于一个overflow为scroll的外盒中时，
                需开启入场后再加载地图功能，以防止气泡不显示。*/
                enableScrollWheelZoom: true, // 允许滚轮缩放。默认值：true
                NavigationControl: true, // 左上角缩放尺。默认值：true
                ScaleControl: false, // 左下角比例尺。默认值：false
                OverviewMapControl: true, // 右下角小地图：true
                CurrentCity: "北京", // 当前城市。默认值：北京
                MapTypeControl: true, // 右上角地图种类，仅当设置当前城市后可用。默认值：true
                MapClickEnable: true, // 底图可点
                FontStyle: "font-size: 12px;" // 文字样式。默认值：font-size:12px;
            };
            that.opt_init = $.extend(opt_default, opt);

            // 创建map对象
            that.createMap.apply(that);

            // 设置地图属性
            that.setMapAttr.apply(that);

            // 设置文字样式
            that.setFontStyle.apply(that);
        },
        // 创建map对象
        createMap: function() {
            var that = this;

            that.map_obj = new BMap.Map(that.opt_init.map_obj_id, { enableMapClick: that.opt_init.MapClickEnable }); // 创建地图实例 

            // 重写样式
            $("div.BMap_bubble_content span,div.BMap_bubble_content a").css("font-size", "12px!important");
            $("div.BMap_bubble_content span img").css("display", "inline!important");

            that.map_obj.centerAndZoom(new BMap.Point(116.404, 39.915), 1);
        },
        // 设置地图属性
        setMapAttr: function(opt) {
            var that = this;

            if (that.opt_init.enableScrollWheelZoom)
                that.map_obj.enableScrollWheelZoom(); // 允许滚轮缩放
            if (that.opt_init.NavigationControl)
                that.map_obj.addControl(new BMap.NavigationControl()); // 左上角缩放尺
            if (that.opt_init.ScaleControl)
                that.map_obj.addControl(new BMap.ScaleControl()); // 左下角比例尺
            if (that.opt_init.OverviewMapControl)
                that.map_obj.addControl(new BMap.OverviewMapControl()); // 右下角小地图
            if (that.opt_init.MapTypeControl)
                that.map_obj.addControl(new BMap.MapTypeControl()); // 右上角地图种类
            if (that.opt_init.CurrentCity)
                that.map_obj.setCurrentCity(that.opt_init.CurrentCity); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用
        },
        // 根据参数决定直接执行方法 或 监听滚动，在确定地图入场后再执行方法。callback为要执行的方法
        PrepareDoAction: function(callback) {
            var that = this;

            if (!that.opt_init.scroll_obj_selector) {
                callback();
            } else {

                var map_box = $("#" + that.opt_init.map_obj_id);
                var wrapper_box = $(that.opt_init.scroll_obj_selector);

                var map_top_px = map_box.position().top; // 地图盒初始top
                var map_height_px = map_box.height(); // 地图盒高度
                var wrapper_height_px = wrapper_box.height(); // scroll盒高度

                // mobile_stop_moved模块有重置scroll盒高度功能，so…首次赋值，比较盒高度和窗口高度，取小值
                var window_height_px = $(window).height();
                wrapper_height_px = wrapper_height_px < window_height_px ? wrapper_height_px : window_height_px;

                var scrollTop_px; // 已滚动距离
                var listenScroll = true; // 监听scroll，显示地图后，不再监听

                // 测试地图盒是否已入场
                var test = function() {
                    scrollTop_px = wrapper_box.scrollTop();

                    // console.log(map_top_px + ":" + scrollTop_px + ":" + wrapper_height_px);
                    if (map_top_px - scrollTop_px < wrapper_height_px - map_height_px / 2) { // 减去地图盒高度的一半是为了兼容安卓微信浏览器。等于地图盒入场一半高度时，才会加载地图
                        callback();
                        listenScroll = false;
                    }
                };

                // 监听scroll盒滚动
                wrapper_box.scroll(function() {
                    if (!listenScroll)
                        return;
                    wrapper_height_px = wrapper_box.height();
                    test();
                });

                // 打开页面时，先执行一次测试。如果地图盒在可视范围内，则直接显示。
                test();
            }
        },
        // 增加定点标注
        PointMarker: function(opt) {
            var that = this;

            var opt_default = {
                clearOld: true, // 清除原有marker
                Zoom: 14,
                Points: [{
                    Keywords: "北京天安门",
                    Bounce: true,
                    click_callback: null
                }]
            };

            opt = $.extend(opt_default, opt);

            if (opt.clearOld)
                that.map_obj.clearOverlays();

            var marking = function() {

                // 创建地址解析器实例
                var myGeo = new BMap.Geocoder();

                var makingPoints = function(_i) {

                    if (_i >= opt.Points.length) {
                        return;
                    }

                    // 将地址解析结果显示在地图上,并调整地图视野
                    myGeo.getPoint(opt.Points[_i].Keywords, function(point) {

                        if (point === null) {
                            console.log("baidu_map", "135", "地点未找到: ", opt.Points[_i].Keywords);
                            opt.Points[_i].Keywords = "北京天安门";
                            makingPoints(_i);
                        } else {
                            var marker = new BMap.Marker(point); // 创建标注   

                            if (opt.Points[_i].click_callback)
                                marker.addEventListener("click", function(e) {
                                    opt.Points[_i].click_callback(marker);
                                });

                            that.map_obj.addOverlay(marker);

                            if (opt.Points[_i].Bounce)
                                marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画 

                            if (opt.Points[_i].Label) {
                                var label = new BMap.Label(opt.Points[_i].Label, { offset: new BMap.Size(20, -10) });
                                marker.setLabel(label);
                            }

                            if (_i === 0)
                                that.map_obj.centerAndZoom(point, opt.Zoom);

                            makingPoints(_i + 1);
                        }
                    }, opt.CurrentCity);

                };

                makingPoints(0);
            };

            that.PrepareDoAction.apply(that, [marking]);
        },
        PointMarkerInfo: function(opt) {
            var that = this;

            var opt_default = {
                marker: null,
                content: null // 内容，支持html标签
            };

            var para_default = {
                title: "北京天安门", //标题
                width: 300, //宽度
                height: 50, //content高度
                panel: "panel", //检索结果面板
                enableAutoPan: true, //自动平移
                searchTypes: [
                    BMAPLIB_TAB_SEARCH, //周边检索
                    BMAPLIB_TAB_TO_HERE, //到这里去
                    BMAPLIB_TAB_FROM_HERE //从这里出发
                ]
            }

            var opt = $.extend(opt_default, opt);
            opt.para = $.extend(para_default, opt.para);

            if (!that.map_obj || opt.marker === null)
                return;

            var searchInfoWindow = null;
            searchInfoWindow = new BMapLib.SearchInfoWindow(that.map_obj, opt.content, opt.para);

            searchInfoWindow.open(opt.marker);
        },
        // 关键词搜索，增加搜索结果
        Search: function(opt) {
            var that = this;

            var opt_default = {
                SearchKeywords: "北京天安门"
            };

            opt = $.extend(opt_default, opt);

            var searching = function() {

                var local = new BMap.LocalSearch(that.map_obj, {
                    renderOptions: { map: that.map_obj }
                });
                local.search(opt.SearchKeywords);
            };

            that.PrepareDoAction.apply(that, [searching]);
        },
        // 设置文字样式
        setFontStyle: function() {
            var that = this;
            var style_obj = document.getElementById("baidu_map_style");
            if (style_obj)
                return;
            style_obj = document.createElement("div");
            style_obj.innerHTML = "xxx<style id=\"baidu_map_style\">.BMapLib_SearchInfoWindow *,.tangram-suggestion-main *{" + that.opt_init.FontStyle + "}</style>"
            document.getElementsByTagName("head")[0].appendChild(style_obj.lastChild);
        }
    };
}

(function(path) {
    var a = document.createElement("link");
    a.type = "text/css";
    a.rel = "stylesheet";
    a.href = path;
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(a);
})("http://api.map.baidu.com/library/SearchInfoWindow/1.5/src/SearchInfoWindow_min.css");

if (typeof define === "function" && define.amd) {
    define(function() {
        return baidu_map;
    });
}
