/** @preserve Copyright 2010-2015 Youmi.net. All Rights Reserved. */
/**
    通用方法api
    -----------
 */
;(function(win, doc, $) {
/** 私有属性
 -----------------------------------------------------------------*/
    var API = {};

/** 公有属性&方法
 -----------------------------------------------------------------*/
    API = {
        timestamp:    0,  // 时间戳
        isIpad:       (/ipad/gi).test(navigator.appVersion),


        /**
         *  =host
         *  @about     获取主域名
         *
         *  @return    {string}  主域名
         */
        host: function() {
            return API.strFormat("http://{0}/offer/", win.location.hostname);
        },


        /**
         *  =sdk
         *  @about    sdk 接口调用
         *
         *  @param    {string}  url
         */
        _sdk: function(url) {
            $(this.strFormat('<a href="{0}"></a>', url)).trigger('click');
        },


        /**
         *  =log
         *  @about    log 信息输出
         *
         *  @param    {string}  m  输出信息
         */
        _log: function(m) {
            this._sdk("youmi://browser/log?log="+ this.encode('JS: '+m));
        },


        /**
         *  =ping
         *  @about    访问链接
         *
         *  @param    {string}   url  访问地址
         */
        _ping: function(url) {
            this._sdk('youmi://wall/ping?url='+ API.encode(url));
        },


        /**
         *  =checkURI
         *  @about    检查 uri，是否已安装
         *
         *  @param    {number}  id
         *  @param    {string}  uri
         *  @param    {string}  aid
         *
         *  @callback     wall.canopen(boolean, number);
         */
        _checkURI: function(id, uri, aid) {
            this._sdk(this.strFormat('youmi://wall/canopenurl?url={0}&true_js={1}&false_js={2}&appid={3}',
                this.encode(uri),
                this.encode(this.strFormat('YM.EXPORTS.canopen(1,{0})', id)),
                this.encode(this.strFormat('YM.EXPORTS.canopen(0,{0})', id)),
                aid
            ));
        },


        /**
         *  =check installed
         *  @about    任务应用是否已经安装或者打开
         *
         *  @param    {number}  id
         *  @param    {string}  pn
         *  @param    {string}  uri
         *  @param    {string}  cn
         *
         *  @callback     wall.installed(number wadid, number code, number isclicked);
         */
        _checkInt: function(id, pn, uri, cn) {
            this._sdk(this.strFormat('youmi://wall/effective?wadid={0}&appid={1}&uri={2}&cn={3}&callback=YM.EXPORTS.installed', id, pn, uri, cn));
        },


        /**
         *  =orient
         *  @about    处理屏幕翻转
         *
         *  @callback     wall.orient(number);
         */
        _orient: function() {
            API._sdk( API.strFormat('youmi://wall/orientation?portrait_js={0}&landscape_js={1}',
                API.encode('YM.EXPORTS.orient(0)'), API.encode('YM.EXPORTS.orient(1)')) );
        },


        /**
         *  =get protocol
         *  @about    获取协议版本
         *
         *  @callback    wall.protocol(string);
         */
        _getPro: function() {
            API._sdk('youmi://info/infos?protocol=1&connection=1&platform=1&callback='+ API.encode('YM.EXPORTS.protocol'));
        },


        /**
         *  =get version
         *  @about    获取 sdk 版本
         *
         *  @callback    wall.version(string);
         */
        _getVer: function() {
            API._sdk('youmi://info/sdkv?callback='+ API.encode('YM.EXPORTS.version'));
        },


        /**
         *  =get os version
         *  @about    获取 osv
         */
        _getOSV: function() {
            var ua = navigator.userAgent, i;

            if ( ua.indexOf('iPhone') === -1
                && ua.indexOf('iPad') === -1
                && ua.indexOf('iPod') === -1 ) return 'none';

            i = ua.indexOf('OS') + 3;

            return ua.substring(i, ua.indexOf(' ', i)).replace(/_/g, '.');
        },


        /**
         *  =stat
         *  @about    计数统计
         *
         *  @param    {number}  t  统计类型
         */
        stat_: function(t, opts) {
            var pms = {
                entc  :  1,
                key   :  '',   // 统计项目
                ex    :  '',   // ex参数
                ver   :  0,    // 版本
                time  :  0,    // 消耗时间
                arg   :  '',   // 请求地址参数
                rate  :  50    // 发送概率
            },

            aside = '',

            TYPE = [
                'count',    // [0] 计数统计
                'runtime',  // [1] 时间统计
                'error'     // [2] 错误统计
            ];

            $.extend(pms, opts);

            // 处理入口
            switch(pms.entc) {
                // 积分墙
                case 1:
                case 32: pms.entc = 3; break;

                // 积分banner
                case 2:
                case 4: pms.entc = 1; break;

                // 积分spot
                case 128: pms.entc = 2; break;
            }


            // 处理参数
            switch(t) {
                case 1: aside = '&v=' + pms.time; break;  // 时间统计
                case 2: aside = '&arg=' + pms.arg; break; // 错误统计
            }

            // 发送统计
            if (API.random(100) < pms.rate) {
                API._ping( API.strFormat('http://stat.gw.youmi.net/stat/v2/{0}?pid=5&pd={1}&ver={2}&k={3}&e={4}{5}', TYPE[t], pms.entc, pms.ver, pms.key, API.encode(pms.ex), API.encode(aside)) );
            }
        },


        /**
         *  =effect
         *  @about    效果记录发送
         *
         *  @param    {number}  id    任务id
         *  @param    {number}  at    效果类型
         *  @param    {json}    c     全局参数
         */
        effect_: function(id, at, c) {
            API._ping( API.strFormat('http://ios.wall.youmi.net/v2/jseff?cid={0}&app={1}&rsd={2}&rt={3}&ad={4}&at={5}&prop=wall&e={6}&entc={7}', c.cid, c.aid, c.oil, API.timeGap(0) - _mi_hjml, id, at, c.ede, c.entc) );
        },


        /**
         *  =event
         *  @about    事件统计
         *
         *  @param    {string}  ac    Action 标签
         *  @param    {all}     val   值
         *  @param    {string}  aid
         *  @param    {string}  cid
         *  @param    {number}  tsp   延时发送时间间隔
         *  @param    {string}  entc  label 标签
         *  @param    {string}  ver   SDK Version
         */
        event_: function(ac, val, aid, cid, tsp, entc, ver) {
            if (API.random(100) < 50) { // 50%概率发送
                API._ping( API.strFormat('http://t.youmi.net/v1/event?appid={0}&cid={1}&tsp={2}&ac={3}&pt=i_wall&lb={4}&val={5}&ver={6}', aid, cid, tsp, ac, entc, val, ver) );
            }
        },


        /**
         *  =track
         *  @about    用户统计
         *
         *  @param    {string}  aid
         *  @param    {string}  cid
         *  @param    {string}  sdkv  sdk版本
         *  @param    {string}  pf    平台型号
         */
        track_: function(aid, cid, sdkv, pf) {
            var ft = API.getItem('_mi_ft_wall'),
                ts = 0;

            if (ft) {
                ts = API.getItem('_mi_ts_wall');
                // 一天只发一次
                if ( new Date/1000 - ts < 24*3600 ) return false;
            }
            else {
                ft = 0;
            }

            // 发送统计记录
            $.ajax({
                type:         'GET',
                url:          'http://t.youmi.net/v1/active',
                data: {
                    appid:    aid,
                    cid:      cid,
                    dv:       pf,
                    ts:       ts,
                    ft:       ft,
                    pt:       'i_wall',
                    ver:      sdkv,
                    osv:      API._getOSV()
                },
                dataType:     'json',
                timeout:      12000,
                success:      function(d) {
                    if (!d.c) {
                        if (!ft) API.setItem('_mi_ft_wall', d.ft, 7776000); // 缓存3个月
                        API.setItem('_mi_ts_wall', d.ts, 7776000); // 缓存3个月
                    }
                }
            });
        },


        /**
         *  =fixJack
         *  @about    防止劫持
         */
        fixJack: function() {
            document.write = function(str) { return false; };
        },


        /**
         *  =timeGap
         *  @about    获取间隔时间
         *
         *  @param    {number}  when
         */
        timeGap: function(w) {
            if (w) {
                return (new Date).getTime() - this.timestamp;
            }
            else {
                this.timestamp = (new Date).getTime();
                return this.timestamp;
            }
        },


        /**
         *  =getStamp
         *  @about    获取间断时间戳
         *
         *  @param    {number}  w  间断分钟
         *  @return   {number}
         */
        getStamp: function(w) {
            var t = new Date();

            t = new Date(
                t.getFullYear(),
                t.getMonth(),
                t.getDay(),
                t.getHours(),
                Math.floor(t.getMinutes() / w) * w,
                0,
                0
            );

            return t.getTime();
        },


        /**
         *  =getRequest
         *  @about    获取 url 参数
         *
         *  @return   {object}   参数集合
         */
        getRequest: function()  {
            var url = win.location.search,  // 获取url中"?"后面的字符串
                i = 0,
                args, arg,
                back = {};

            if (url == '') return 0;

            if ( url.indexOf('?') != -1 ) {
                args = url.substr(1).split('&');

                for (; i < args.length; i++) {
                    arg = args[i].split('=');
                    back[ arg[0] ] = arg[1];
                }
            }

            return arguments[0] ? back[arguments[0]] : back;
        },


        /**
         *  =getItem
         *  @about    获取数据
         *
         *  @param    {string}  key  数据名称
         *  @param    {boolean} hl   是否处理数据
         *  @return   {string/json}
         */
        getItem: function(key, hl) {
            hl = hl || 0;
            var value = win.localStorage.getItem(key);
            if (value) {
                return hl ? JSON.parse(value) : value;
            }
            return null;
        },


        /**
         *  =setItem
         *  @about    获取数据
         *
         *  @param    {string}  key    数据名称
         *  @param    {boolean} value  数据
         */
        setItem: function(key, value) {
            if ($.isArray(value) || $.isPlainObject(value)) value = JSON.stringify(value);
            win.localStorage.setItem(key, value);
            return 1;
        },


        /**
         *  @about    获取位置信息
         */
        getScrollTop: function() { return window.scrollY; }, // 上滚动距离
        getWidth: function() { return screen.width || win.innerWidth; },
        getHeight: function() { return screen.height || win.innerHeight; },


        /**
         *  =get max scrolly
         *  @about    获取 maxScrollY
         *
         *  @param    {number}  orient   屏幕翻转
         *  @param    {number}  clientH  页面高度
         */
        getMaxScrollY: function(orient, clientH) {
            return orient ?
                (clientH - API.getWidth()) :
                    (clientH - API.getHeight());
        },


        /**
         *  @about    随机数
         */
        random: function(n) { return parseInt(Math.random() * n); },


        /**
         *  =secondTranslate
         *  @about    获取间隔时间
         *
         *  @param    {number}  when
         */
        secondTranslate: function(s) {
            return ( s / 60 < 10 ? "0" + Math.floor( s / 60 ) : Math.floor( s / 60 ) ) + ":" + ( s % 60 < 10 ?　"0" + s % 60 : s % 60 );
        },


        /**
         *  =encode
         *  @about    字符串 encode
         *
         *  @param    {string}  s 需要 encode 的字符串
         *  @return   {string}
         */
        encode: function(s) { return encodeURIComponent(s); },


        /**
         *  =decode
         *  @about    编码decode
         *
         *  @param    {string}  s  需要decode的字符串
         *  @return   {string}
         */
        decode: function(s) { return decodeURIComponent(s); },


        /**
         *  =escape
         *  @about    (包含中文)数据容错处理
         *
         *  @param    {string}  s  需要处理的数据字符串
         *  @return   {json}    c  1，数据为空
         *                         2, 数据无法解析
         */
        escape: function(s) {
            var d = { c: 1 };

            if (!!s) {
                // 数据容错处理
                try {
                    //d = s.replace(/(\r\n|\r|\n)/g, '\\n'); // 特殊字符处理
                    d = s.replace(/(\r\n|\r|\n)/g, ''); // 干掉换行符
                    d = JSON.parse(d);
                }
                catch(e) {
                    // 输出数据错误信息
                    API._log('Data Error:'+ e);
                    d.c = 2;
                }
            }

            return d;
        },


        /**
         *  =format number
         *  @about    数字格式化
         *
         *  @param    {number}  num     需要格式化的string
         *  @param    {unit}    string  单位
         *  @param    {u}       bool    是否后面加单位
         */
        numFormat: function (num, unit, u) {
            unit = unit ? unit : '';
            // 当单位为元并且汇率为100时特殊处理
            num = unit == "元" ? parseFloat(num) / 100 : parseFloat(num);
            // 保留 fixed 小数位数
            num = num.toFixed( unit == "元" ? 2 : ( arguments[3] || 0 ) );

            // 加上逗号
            num += '';
            var x = num.split('.'),
                x1 = x[0],
                x2 = (x.length > 1) ? ('.' + x[1]) : '',
                rgx = /(\d+)(\d{3})/;

            while (rgx.test(x1)) x1 = x1.replace(rgx, '$1' + ',' + '$2');

            return u && unit == "元" ? x1 + x2 + unit : x1 + x2 ;
        },


        /**
         *  =format string
         *  @about    string 格式化
         *
         *  @param    {string}  d    需要格式化的string
         *  @param    {all}     1~n  {n} 替换内容
         *  @return   {string}       格式化后的string
         */
        strFormat: function(s) {
            if (arguments.length == 0) return null;

            var args = Array.prototype.slice.call(arguments, 1);
            return s = s.replace(/\{(\d+)\}/g, function(m, i) {
                return args[i];
            });
        }
    };

    win.API = API;


    /**
        =template
        @about    简易模板

        @usage

        HTML:
        <script type="text/template" id="tpl-article"><h1>{{title}}</h1></script>

        JavaScript:
        $('#tpl-article').tmpl(data).appendTo($item);
     */
    (function($){
        $.fn.tmpl = function(d) {
            var s = $(this[0]).html().trim();
            if ($.isArray(d)) {
                var li = '',
                    tm = {}, i = 0, len = d.length;

                for (; i < len; i++) {
                    tm = d[i];
                    li += s.replace(/\{\{(\w+)\}\}/g, function(all, match) {
                        return tm[match];
                    });
                }
                s = li;
            }
            else {
                s = s.replace(/\{\{(\w+)\}\}/g, function(all, match) {
                    return d[match];
                });
            }

            return $(s);
        };
    })($);


    /**
        =pages
        @about    页面切换
     */
    (function($) {
        /**
         *  @param    {string}    p  页面标识
         *  @param    {function}  f  后续执行
         */
        $.fn.pages = function(p, before, after) {
            $(this).each(function(index) {
                var $this = $(this);
                if ( $this.data('page') === p ) {
                    setTimeout(function() {
                        (before || function() {})($this);
                        $this.attr('class', 'ui-page ui-page-active fade in');
                        setTimeout(function() {
                            $this.removeClass('fade in');
                        }, 225);
                        (after || function() {})($this);
                    }, 124);
                }
                else {
                    if ( $this.hasClass('ui-page-active') ) {
                        $this.attr('class', 'ui-page ui-page-active fade out');
                        setTimeout(function() {
                            $this.removeClass('ui-page-active fade out');
                        }, 125);
                    }
                }
            });
        };
    })($);
})(window, document, Zepto);
