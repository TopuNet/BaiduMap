# 百度地图 JS插件 v3.3.1
###安装：npm install TopuNet-BaiduMap

文件结构：
-------------
        1. jq/baidu_map.js 放入项目文件夹jq（原生规范）或widget/lib（AMD规范）中
        2. demo中的demo.html为功能展现最全面的页面；demo_requireJs.html是amd规范的测试；demo_mobile.html是移动端测试

页面引用：
-------------
原生引用

        1. 页面底端引用 http://api.map.baidu.com/api?v=2.0&ak=cQoqZZ4o1Yy96sEiIlIVkkek
        2. 后引用 http://api.map.baidu.com/library/SearchInfoWindow/1.5/src/SearchInfoWindow_min.js
        3. 后引用最新版 /inc/Jquery.min.js#1.x.x 或 zepto.min.js
        4. 后引用 /jq/baidu_map.js

requireJS引用

        1. 页面底端引用require.js前，引用 http://api.map.baidu.com/api?v=2.0&ak=cQoqZZ4o1Yy96sEiIlIVkkek
        2. 后引用 http://api.map.baidu.com/library/SearchInfoWindow/1.5/src/SearchInfoWindow_min.js
        3. 依赖baidu_map.js和jquery.min.js#1.x 或 zepto.min.js，成功后返回对象baidu_map

功能配置及启用：
--------------
1. 调用方法：

        // 创建地图对象
        var map1 = new baidu_map();

        // 初始化地图。也可用此方法得到一个干净的地图。
        map1.init({
            map_obj_id: "baidu_map_1", // 地图容器ID。无默认值。
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
        });

        // 为地图增加气泡标记点，并将第一个标记点作为地图中心点，同时调整zoom。可反复调用。
        map1.PointMarker({
            clearOld: true, // 清除原有marker
            Zoom: 14, // 调整地图的zoom
            Points: [{
                Keywords: "银河SOHO", // 关键词
                Label: "拓扑高科", // 气泡旁标注。可以为空字符串，也可以没有此key
                Bounce: false, // 是否跳跃。默认false
                click_callback: null // 点击气泡回调
            }, 
            {
                Keywords: "悠唐生活广场",
                // Label: "悠唐",
                Bounce: false,
                click_callback: function(marker){
                    console.log("这是悠唐生活广场");

                    // 点击气泡显示信息框
                    map1.PointMarkerInfo.apply(map1, [{
                        marker: marker, // 必须有
                        content: "这里是概述，支持html标签", // 内容，支持html标签
                        para: {
                            title: "悠唐", //标题
                            width: 300, //宽度，默认300
                            height: 50, //content高度，默认50
                            enableAutoPan: true, //自动平移，默认true
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

        // 为地图增加搜索气泡标记点，地图自动调整中心点和zoom。可反复调用。调用前如想清空地图，可调用init方法
        map1.Search({
            SearchKeywords: "礼士宾馆" // 关键词
        });

        // 创建第二个地图对象，后略
        var map2 = new baidu_map();
        map2.init({
            map_obj_id: "baidu_map_2"
        });


更新日志：
-------------
v3.3.1

        1. 增加参数FontStyle，设置信息窗的文字样式

v3.2.2

        1. 史拓成修改line #183 多了一个逗号，引起的ie7报错

v3.2.1

        1. 解决多个地图设气泡，有些气泡不能跳跃的问题——设置跳跃的语句要放到addOverlay后面
        2. 解决多个地图设气泡，第二个加载完的地图无法平移的问题——在加载气泡前，先要设置一次中心点和zoom
        3. 增加功能：设置地图的底图元素是否可点
        4. 增加功能：设置气泡时，可以设置是否清空地图上原有气泡，而不需要重新初始化地图（Search时清空还是要初始化的）
        5. 增加功能：点击气泡可弹出信息层
        6. 增加功能：气泡旁可显示气泡的标注（label）
        7. 改变amd模式的引用规则
        8. 修改demo

v3.1.1

        1. 重构，单页面内支持多个地图显示
        2. 可多次调用气泡标记或关键词搜索方法，为地图增加气泡标记点
        3. 可通过调用init方法清空已有地图（还原、重新初始化）
        4. 修改demo

v2.2.3

        1. 气泡标注点支持多个
        2. 修改demo

v2.2.1 ~ v2.2.2

        1. 取消配套样式css文件，项目中不再需要引用
        2. 标尺改为默认不显示

v2.1.1 ~ v2.1.2

        1. 增加参数scroll_obj_selector（overflow为scroll的外盒）
            解决移动端使用固定高度和overflow为scroll的外盒、且地图在可视区域外加载时，气泡不显示的bug
        2. 修改demo，增加demo_mobile.html
        3. 修改readme，为新增加参数添加注释

v2.0.3
        
        1. 通过jshint验证

v2.0.2

        1. 在dist文件夹中，增加package.json
        2. 将dist发布到npm：TopuNet-BaiduMap

v2.0.1

        1. 兼容原生JS和AMD规范
        2. 修改demo

v1.1.1

        1. 加入样式文件，重写部分样式（和公司通用样式有冲突）
        