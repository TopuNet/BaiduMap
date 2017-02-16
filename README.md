# 百度地图 JS插件 v3.1.1
###安装：npm install TopuNet-BaiduMap

文件结构：
-------------
        1. jq/baidu_map.js 放入项目文件夹jq（原生规范）或widget/lib（AMD规范）中
        2. demo中的demo.html为功能展现最全面的页面；demo_requireJs.html是amd规范的测试；demo_mobile.html是移动端测试

页面引用：
-------------
原生引用

        1. 页面底端引用 http://api.map.baidu.com/api?v=2.0&ak=cQoqZZ4o1Yy96sEiIlIVkkek
        2. 后引用最新版 /inc/Jquery.min.js#1.x.x 或 zepto.min.js
        3. 后引用 /jq/baidu_map.js

requireJS引用

        依赖baidu_map.js和jquery.min.js#1.x 或 zepto.min.js，成功后返回对象baidu_map

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
        });

        // 为地图增加气泡标记点，并将第一个标记点作为地图中心点，同时调整zoom。可反复调用。调用前如想清空地图，可调用init方法
        map1.PointMarker({
            Zoom: 14, // 调整地图的zoom
            Points: [{
                Keywords: "银河SOHO", // 关键词
                Bounce: true, // 是否跳跃。当地图内有多个气泡时，偶发不跳跃的bug。后续增加的气泡均不能跳跃，true也无效。
                click_callback: null // 点击气泡回调
            }, {
                Keywords: "悠唐生活广场",
                Bounce: false,
                click_callback: function(){
                    console.log("这是悠唐生活广场");
                }
            }]
        });

        // 为地图增加搜索气泡标记点，地图自动调整中心点和zoom。可反复调用。调用前如想清空地图，可调用init方法
        map1.Search({
            SearchKeywords: "SOHO" // 关键词
        });

        // 创建第二个地图对象，后略
        var map2 = new baidu_map();
        map2.init({
            map_obj_id: "baidu_map_2"
        });


更新日志：
-------------
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
        