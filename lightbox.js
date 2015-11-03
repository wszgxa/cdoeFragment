/** @preserve Copyright 2010-2015 Youmi.net. All Rights Reserved. */
/**
    lightbox 方法
    -------------

    @usage
 */
;(function(win, doc, $) {
/** 私有属性
 -----------------------------------------------------------------*/
    var $modal,
        $overlay,
        Lightbox = {};

/** 公有方法
 -----------------------------------------------------------------*/
    Lightbox = {
        /**
         *  =init
         *  @about    初始化
         */
        init: function() {
            if ( !$("#mbox-modal").length )
                $("body").append('<div id="mbox-overlay" class="overlay hide"></div><div id="mbox-modal" class="modal"></div>');

            $modal = $("#mbox-modal");
            $overlay = $("#mbox-overlay");

            $modal.on('touchmove', function() { return false; });
            //$overlay.on('touchmove', function() { return false; });
        },


        /**
         *  =show
         *  @about    显示弹窗
         *
         *  @param  {string}        m   内容
         *  @param  {function}      f   插入内容后到显示前需要执行的内容
         */
        show: function(m, f) {
            $overlay.attr('class', 'overlay fade in');
            $modal.html(m);
            // 如有需要执行的内容，则延迟显示
            if(f) {
                f();
                setTimeout( function(){ $modal.addClass('md-show'); } , 1 );
            }
            else
                $modal.addClass('md-show');
            return this;
        },


        /**
         *  =hide
         *  @about    隐藏弹窗
         */
        hide: function() {
            $modal.attr('class', 'modal md-hide').html('');
            $overlay.attr('class', 'overlay hide');
            return this;
        },


        /**
         *  =addClass
         *  @about    添加样式
         *
         *  @param    {string}  cs
         */
        addClass: function(cs) {
            $modal.addClass(cs);
            return this;
        }
    };

    win.Lightbox = Lightbox;
})(window, document, Zepto);
