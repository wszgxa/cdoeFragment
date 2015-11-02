/**
 *  =$
 *  @about 选择器（单个）
 *  @from  https://gist.github.com/ryanseddon/1009759
 *  @param {string}    a  选择目标
 *  @param {selector}  b  root
 */
function $(a ,b) {
    return (b || doc).querySelector(a);
}
/**
*  =$$
*  @about    选择器（一组）
*  @from     https://gist.github.com/ryanseddon/1009759
*
*  @param    {string}    a  选择目标
*  @param    {selector}  b  root
*/
function $$(a ,b) {
    return (b || doc).querySelectorAll(a)
}



/**
 *  =changeClass  删除增加删除样式
 *
 *  @param    {dom}     $a
 *  @param    {string}  delete class
 *  @param    {string}  add class
 */

// $a为dom节点，不是jq和zepto的节点
function changeClass($a, dlass, alass) {
    var s = 1, arr = [],
        dList = dlass.split(/\s+/g),
        aList = alass.split(/\s+/g);
    $a.getAttribute('class').split(/\s+/g).forEach(function(klass) {
        s = 1;
        dList.forEach(function(dlass) {
            if (klass === dlass) s = 0;
        });

        if (s) arr.push(klass);
    });

    aList.forEach(function (alass) {
        if (arr.indexOf(alass) === -1) {
            arr = arr.push(alass);
        };
    })

    $a.setAttribute('class', arr.join(" "));

    return $a;
}


/**
 *  =EventUtil  适应多浏览器的事件添加删除类
 *  各种参数一看就懂啊
 */

 var EventUtil = {
    addHandler: function(element, type, handler){
        if (element.addEventListener){
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent){
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    },
    removeHandler: function(element, type, handler){
        if (element.removeEventListener){
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent){
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    }
};


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
