/***
 *
 * yc.tao
 * denoui-theme    主题色插件
 * v0.10
 */


var denouiTheme = {

    styles: {},

    defaultOptions: {
        id: "denoui",
        color: "rgb(47,82,635)",
        data:{
            "theme-text": { "color": true },
            "theme-bg": { "background-color": true },
            "theme-bg-008": { "background-color": true, "opacity": 0.08 },
            "theme-border": { "border-color": true }
        }
    },

    get: function(id){
        return this.styles[id];
    },

    render: function(options){

        options = options || {}

        var defaultOptions = denouiTheme.defaultOptions

        if(!options.data || !denouiTheme.isObject(options.data)){
            options.data = {}
        }

        options.data = denouiTheme.extend(defaultOptions.data,options.data)

        var color = options.color || defaultOptions.color
        var rgbArr = [];

        if(!denouiTheme.isRgb(color)){
            // console.log("rgba值不合法，将使用默认值，"+defaultOptions.color)

            rgbArr = denouiTheme.getRgbArr(defaultOptions.color);
        }else{
            rgbArr = denouiTheme.getRgbArr(color);
        }

        var rgbNum = rgbArr.slice(0,3).join(",");

        options.rgbNum = rgbNum

        var _id = options.id || defaultOptions.id
        if(denouiTheme.get(_id)){
            _id = defaultOptions.id;
        }

        options.id = _id;

        var id = _id + "-theme-style";

        var style = denouiTheme.createStyle(id,options);

        style.reload()

        denouiTheme.styles[_id] = style;

    },

    extend: function(o,p){
        for(var k in p){
            o[k] = p[k]
        }
        return o
    },

    isObject: function(o){
        return o.constructor === Object;
    },

    // 判断rgb、rgba,此方法不准确
    isRgb: function(rgbaStr){
        var rgbaReg = /^[rR][gG][Bb][Aa]?[\(]([\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}[\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?[\s]*(0\.\d{1,2}|1|0)?[\)]{1}$/g;
        return rgbaReg.test(rgbaStr);
    },

    // 获取rgb数组
    getRgbArr: function(rgbStr){
        var firstN = rgbStr.indexOf("(");
        return rgbStr.slice(firstN,-1).replace("(","").replace(")","").split(",");
    },

    // rgba转16进制
    rgbaToHexify: function(rgba){
        // rgba 转 16进制
        function hexify(color) {
            var values = color
                .replace(/rgba?\(/, '')
                .replace(/\)/, '')
                .replace(/[\s+]/g, '')
                .split(',');
            var a = parseFloat(values[3] || 1),
                r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
                g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
                b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
            return "#" +
                ("0" + r.toString(16)).slice(-2) +
                ("0" + g.toString(16)).slice(-2) +
                ("0" + b.toString(16)).slice(-2);
        }
        return hexify(rgba)
    },

    // 16进制转rgba，此方法不准确
    hexifyToRgba: function(color){

        function fn(color) {
            var sColor = color.toLowerCase();
            //十六进制颜色值的正则表达式
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            // 如果是16进制颜色
            if (sColor && reg.test(sColor)) {
                if (sColor.length === 4) {
                    var sColorNew = "#";
                    for (var i=1; i<4; i+=1) {
                        sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1));
                    }
                    sColor = sColorNew;
                }
                //处理六位的颜色值
                var sColorChange = [];
                for (var i=1; i<7; i+=2) {
                    sColorChange.push(parseInt("0x"+sColor.slice(i, i+2)));
                }
                return "rgb(" + sColorChange.join(",") + ",1)";
            }
            return sColor;
        }
        return fn(color)
    },

    createStyleDom : function(){
        return  document.createElement("style")
    },

    // 创建style
    createStyle: function(id,options){

        function Style(id,options) {
            var style = denouiTheme.createStyleDom();
            style.setAttribute("type","text/css");
            style.setAttribute("id",id);
            document.head.appendChild(style);
            this.id = id;
            this.style = style;
            this.options = options;
        }

        Style.prototype.setContent = function (content) {
            this.style.innerHTML = content;
            return this
        }

        Style.prototype.getContent = function () {
            return this.style.innerHTML;
        }

        Style.prototype.appendContent = function (content) {
            var that = this;
            var _content = that.getContent();
            _content += content;
            style.setContent(_content)
        }

        Style.prototype.removeContent = function () {
            this.style.innerHTML = "";
        }

        Style.prototype.remove = function () {
            document.head.removeChild(this.style)
        }

        Style.prototype.load = function(opt){

            if(!denouiTheme.isObject(opt)){
                return this;
            }

            var load = false;

            if(opt.color){
                this.updateOption("color", opt.color);
                load = true;
            }

            if(denouiTheme.isObject(opt.data)){
                this.updateOption("data", opt.data);
                load = true;
            }

            if(load){
                this.reload()
            }

            return this

        }

        Style.prototype.reload = function(){
            var css = this.getCss();
            return this.setContent(css);
        }

        Style.prototype.getCss = function(){
            var options = this.options;
            return denouiTheme.getCssContent(options);
        }

        Style.prototype.updateOption = function(key,value){
            this.options[key] = value;
        }

        Style.prototype.updateStyle = function(name,opt){

            var options = this.options,
                data = options.data;

            if(!data[name]){
                return;
            }

            if(!denouiTheme.isObject(opt)){
                return;
            }

            data[name] = denouiTheme.extend(data[name],opt);

            return this.reload();
        }


        Style.prototype.updateColor = function (color) {

            if(!denouiTheme.isRgb(color)){
                console.log("rgba值不合法，更新失败")
                return;
            }

            var new_rgbNum = denouiTheme.getRgbArr(color).slice(0,3).join(",");

            var that = this;

            that.updateOption("color", color)

            that.updateOption("rgbNum", new_rgbNum);

            return that.reload();
        }

        return new Style(id,options);
    },


    getCssClass: function(options){
        var id = options.id,
            rgbNum = options.rgbNum;

        var styleData = options.data;
        var defaultClass = {}
        for(var key in styleData){

            var styleProp = styleData[key];

            var opacity = styleProp.opacity || 1;

            var clsName = id + "-" + key

            var clsValue = ""

            // 字体颜色
            if(styleProp["color"]){

                if(!styleProp["opacity"]){
                    clsValue += "color: rgb(" + rgbNum + ")!important;";
                }else{
                    clsValue += "color: rgba(" + rgbNum + ","+opacity+")!important;";
                }
            }

            // 背景颜色
            if(styleProp["background-color"]){

                if(!styleProp["opacity"]){
                    clsValue += "background-color: rgb(" + rgbNum + ")!important;";
                }else{
                    clsValue += "background-color: rgba(" + rgbNum + ","+opacity+")!important;";
                }
            }

            // 边框颜色
            if(styleProp["border-color"]){

                if(!styleProp["opacity"]){
                    clsValue += "border-color: rgb(" + rgbNum + ")!important;";
                }else{
                    clsValue += "border-color: rgba(" + rgbNum + ","+opacity+")!important;";
                }
            }
            defaultClass[clsName] = clsValue;
        }
        return defaultClass
    },

    // 获取css内容
    getCssContent: function (options) {

        var defaultClass = denouiTheme.getCssClass(options)

        var defaultCssContent = "";

        for(var cls in defaultClass){

            var content = defaultClass[cls]

            defaultCssContent += "."+cls + "{ "+content+"}";
        }


        var otherCssContent = "";

        var cssContent = defaultCssContent + otherCssContent;

        return cssContent

    }
}
