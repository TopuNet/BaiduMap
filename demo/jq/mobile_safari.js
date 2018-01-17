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

            // $(window).on("resize", function() {
            //     var window_height_px = $(window).height();
            //     $(".wrapper div").css("height", window_height_px + "px");
            // });

            var query_j = {}; // 地址栏对象

            // 解析地址栏
            (function() {
                var query = decodeURI(location.search.substring(1));
                // alert(query);
                var regExp = new RegExp("(.+?)=(.+?)(?:\&|$)", "ig");
                var result;

                while (true) {
                    result = regExp.exec(query);
                    if (!result)
                        break;
                    query_j[result[1]] = result[2];
                }
            })();

            // alert(query);

            // 如果是微信浏览器，提示在浏览器中打开
            if ($func.judge_MicroMessenger()) {
                switch (query_j.app.toString()) {
                    case "1":
                    case "3":
                        $(".wrapper").addClass("iosToSafari");
                        // $(".iosToSafari").show(0);
                        break;
                    case "2":
                    case "4":
                        $(".wrapper").addClass("androidToMessenger");
                        // $(".androidToMessenger").show(0);
                        break;
                    default:
                        break;
                }
            } else { // 不是微信浏览器
                switch (query_j.app) {
                    case "1":
                    case "2":
                        $(".wrapper").addClass("download_tip_baidu");
                        // $(".download_tip_baidu").show(0);
                        break;
                    case "3":
                    case "4":
                        $(".wrapper").addClass("download_tip_amap");
                        // $(".download_tip_amap").show(0);
                        break;
                    default:
                        break;
                }

                // 尝试打开地图APP
                // alert(query_j.destination_title);
                // alert(decodeURI(query_j.destination_title));
                var bmp = new $baidu_map();
                bmp.locationToNavigator({
                    app: query_j.app,
                    mode: "driving",
                    origin_pos: {
                        lat: query_j.origin_pos_lat,
                        lng: query_j.origin_pos_lng
                    },
                    destination_pos: {
                        lat: query_j.destination_pos_lat,
                        lng: query_j.destination_pos_lng
                    },
                    destination_title: query_j.destination_title,
                    callback_gotoStore: function(store_uri) {
                        $(".ahref").unbind("click").on("click", function() {
                            location.href = store_uri;
                        });
                    }
                });
            }

        });
    });
});