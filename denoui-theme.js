

/***
 *
 * yc.tao
 * denoui-theme    主题色插件
 * v0.10
 */

(function () {

    var root = (typeof self == 'object' && self.self === self && self) ||
        (typeof global == 'object' && global.global === global && global) ||
        this || {};

    var denouiTheme = {

        styles: {},

        classList: {},

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

        set: function(name,value){
            this.styles[name] = value
        },

        setClassName: function(name, value){
            this.classList[name] = value;
        },

        getClassName: function(name){
            if(name){
                return this.classList[name]
            }
            return this.classList
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
                console.log("rgba值不合法，将使用默认值，"+defaultOptions.color)

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

            denouiTheme.set(_id, style)

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

        getIEOpacityToFilter: function(hexifyStr,opacity){

            opacity = opacity < 0.1  ? 0.1 : opacity

            var iEOpacityToFilter = {
                "0.1": "19",
                "0.2": "33",
                "0.3": "4C",
                "0.4": "66",
                "0.5": "7F",
                "0.6": "99",
                "0.7": "B2",
                "0.8": "C8",
                "0.9": "E5",
            }

            var filterStr = iEOpacityToFilter[opacity]

            if(filterStr){
                filterStr = "#" + filterStr + hexifyStr
            }

            return filterStr

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
                var headDom = document.head || (document.getElementsByTagName('head').length && document.getElementsByTagName('head')[0])
                headDom.appendChild(style);
                this.id = id;
                this.style = style;
                this.options = options;
            }

            Style.prototype.setContent = function (content) {
                var style = this.style
                if ('styleSheet' in style) {
                    style.setAttribute('type', 'text/css')
                    style.styleSheet.cssText = content
                } else {
                    style.innerHTML = content
                }
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
                var style = this.style
                if ('styleSheet' in style) {
                    style.setAttribute('type', 'text/css')
                    style.styleSheet.cssText = ''
                } else {
                    style.innerHTML = ''
                }
                return this
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

            var getCssText = function (styleProp,propName,rgbNum,opacity) {
                var clsValue = ""
                if(!styleProp["opacity"]){
                    clsValue += ""+propName+": rgb(" + rgbNum + ")!important;";
                }else{

                    clsValue += ""+propName+": rgb(" + rgbNum + ")!important;"+propName+": rgba(" + rgbNum + ","+opacity+")!important;";
                    var hexifyStr = denouiTheme.rgbaToHexify("rgba(" + rgbNum + ","+opacity+")").replace("#","")
                    var iEOpacityToFilter = denouiTheme.getIEOpacityToFilter(hexifyStr,opacity)
                    if(iEOpacityToFilter){

                        if(opacity > 0.1){
                            clsValue += "filter:progid:DXImageTransform.Microsoft.gradient(startColorstr="+iEOpacityToFilter+",endColorstr="+iEOpacityToFilter+");"
                        }else{
                            clsValue += "filter:progid:DXImageTransform.Microsoft.Alpha(opacity=50);"
                        }
                    }

                }
                return clsValue
            }


            for(var key in styleData){

                var styleProp = styleData[key];

                var opacity = styleProp.opacity || 1;

                var clsName = id + "-" + key

                denouiTheme.setClassName(key,clsName)

                var clsValue = ""

                // 字体颜色
                if(styleProp["color"]){
                    clsValue += getCssText(styleProp,'color',rgbNum,opacity)
                }

                // 背景颜色
                if(styleProp["background-color"]){
                    clsValue += getCssText(styleProp,'background-color',rgbNum,opacity)
                }

                // 边框颜色
                if(styleProp["border-color"]){
                    clsValue += getCssText(styleProp,'border-color',rgbNum,opacity)
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

                defaultCssContent += "."+cls + "{ "+content+"};:root ."+cls+"{filter: none;}";
            }


            var otherCssContent = "";

            var cssContent = defaultCssContent + otherCssContent;

            return cssContent

        }
    }



    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = denouiTheme;
        }
        exports.denouiTheme = denouiTheme;
    } else {
        root.denouiTheme = denouiTheme;
    }


}())
