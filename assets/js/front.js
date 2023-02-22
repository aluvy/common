$(()=>{
    "use strict";

    var _w = window;
    $.ohyLayer = function(options, option2){
        if(typeof options === 'undefined') element = {};
        if(typeof options === 'string'){
            options = {
                content: options,
                title : (option2) ? option2 : false,
            };
        }
        return _w.johyLayer(options);
    }

    _w.johyLayer = function(options){
        if(typeof options === 'undefined') options = {}

        var pluginOptions= $.extend(true, {}, _w.johyLayer.pluginOptions);
        (_w.johyLayer.defaults) ? pluginOptions = $.extend(true, pluginOptions, _w.johyLayer.defaults) : '';
        pluginOptions = $.extend(true, {}, pluginOptions, options);

        var instance = new _w.JohyLayer(pluginOptions);
        _w.johyLayer.instance.push(instance);

        return instance;
    }

    _w.JohyLayer = function(options){
        $.extend(this, options);
        this.init();
    }

    _w.JohyLayer.prototype = {
        init: function(){
            if(this.openAuto == false) this.open();
        },
        buildHTML: function(){
            var _this = this;

            _this.$el = $(_this.template).appendTo(_this.container);
            _this.$parent = _this.$el.closet('.layer_wrap');
            _this.$layer = _this.$el.find('.ly_in');
            _this.$hd = _this.$el.find('.ly_hd');
            _this.$title = _this.$el.find(".ly_hd h1");
            _this.$con = _this.$el.find('.ly_con');
            _this.$closeDevBtn = _this.$el.find('.btn.close');

            _this.setContent();

            _this.$layer.attr('tabindex', 0).foucs();

            _this.$closeDevBtn.attr("id", (_this.content.replace("#",""))+"_dev");
            if(this.closeAct == true) _this.$closeDevBtn.attr("data-action", "close");

            _this.$parent.addClass(_this.type);
            var $closeBtn = _this.$el.find("[data-action='close']");
            $closeBtn.on("click", function(){
                _this.$layer.addClass("off");
                _this.close();
            })

            var $dim = _this.$el.find(".col_dim");
            $dim.on("click", function(){
                if(_this.$dimAct === true){
                    _this.$layer.addClass("off");
                    _this.close();
                }
            })
        },
        open: function(){
            var _this = this;
            var $lastFocused = $('body').find(':focus');
            var $focusId = $lastFocused.attr('id');

            _this.buildHTML();

            // 타이틀이 있는지 체크
            if(_this.$con.find(".ly_hd").length > 0){
                _this.$hd.remove();
            }

            (_this.title == '') ? _this.$title.html("알림") : _this.$title.html(_this.title);
            if(_this.closeUse === false) _this.$layer.addClass("noBtn");
            _this.$layer.focus().attr("rel", $focusId);

            // aria-hidden
            $(".wrap", window.parent.document).attr("aria-hidden", true);
            _this.$parent.prev(".layer_wrap").attr("aria-hidden", true);
            _this.$el.attr("aria-hidden", false);

            // 팝업이 이미 떠있는지 체크
            if($(document).find(".layer_wrap.open").length <=1){
                var $scrollTop = $(window).scrollTop();
                setTimeout(function(){
                    $(".wrap").css({
                        "top" : -$scrollTop,
                        "position" : "relative"
                    });
                    $("html, body").addClass("noScroll");
                }, 0);
            }

            (_this.type !== "alert") ? $("html, body").addClass("noScroll") : null;
            if(_this.titleUse === false) _this.$layer.addClass("noHd");

            // max, min height
            function getHeight(){
                let winH = Math.round($(window).height());
                let head = Math.round($(document).find(".header .inner_sub").height()) ||60;
                let pophead = Math.round(_this.$layer.find(".ly_hd").outerHeight());
                let btn = _this.$layer.find(".btn_pop_confirm_wrap").length > 0 ? Math.round(_this.$con.find(".btn_area").outerHeight()) : 0;
                let maxHeight = winH - pophead - btn;
                let minHeight = 410; // calendar
                let cnt = _this.$con.find(".ly_cnt");

                if(_this.type == "fullpopup"){
                    cnt.css({ "max-height" : `${maxHeight}px` });
                    cnt.css({ "min-height" : `${maxHeight}px` });
                } else {
                    maxHeight = maxHeight - head;
                    if(_this.type == "calendar"){
                        if(minHeight >= maxHeight){ minHeight = maxHeight }
                        cnt.css({ "max-height" : `${maxHeight * 0.1}rem` });
                        cnt.css({ "min-height" : `${minHeight * 0.1}rem` });

                        // 캘린더 세로값 셋팅
                        _calendar.minH = minHeight;
                        _calendar.maxH = maxHeight;
                    } else {
                        cnt.css({ "max-height" : `${maxHeight}px` });
                    }
                }
            }
            getHeight();

            $(window).on("resize", getHeight);

            $(_this.content).trigger("onload");
            // accordionButton.accordion_popup(_this.$el); //popup accordion

            return true;
        },
        setContent: function(){
            var _this = this;

            if(_this.type === 'alert'){
                var $html = '<div class="ly_cnt"><div class="section">' + _this.content + '</div></div>';
            } else {
                var $html = $(_this.content).html();
                $(_this.content).empty();
            }

            if(_this.type === 'confirm' || _this.type === 'confirm alert' || _this.type === 'alert confirm'){
                _this.$closeDevBtn.remove();
            }
            _this.$con.html($html);
        },
        close: function(){
            var _this = this;
            var $html = _this.$con.html();
            var $lastFocused = _this.$layer.attr("rel");
            var $scrollTop = parseInt($(".wrap").css("top"))* -1;
            var $win= $(window);

            $("#"+$lastFocused).focus().closet(".layer_wrap").removeAtter("aria-hidden");
            _this.$parent.prev(".layer_wrap").removeAttr("aria-hidden");

            setTimeout(() => {
                if(_this.type !== 'alert'){
                    if(_this.$el.prev(".layer_wrap").length > 0){
                        _this.$el.prev(".layer_wrap").attr("aria-hidden", false);
                    } else {
                        $("html, body").removeClass("noScroll");
                        $(".wrap").css("top", "");
                        $win.scrollTop($scrollTop);

                        let wrap = $(".wrap", window.parent.document);
                        wrap.css("position","");
                        wrap.removeAttr("aria-hidden");
                    }
                    $(_this.content).html($html);
                }
                _this.$el.remove();
                _w.johyLayer.instances.find(function(o,i){
                    if(o == _this){
                        _w.johyLayer.instances.splice(i, 1);
                    }
                })
            }, 250);
        }
    }

    _w.johyLayer.instance = [];
    _w.johyLayer.lastFocused = false;
    _w.johyLayer.pluginDefaults = {
        template: '' +
            '<div class="layer_wrap open"><div class="row"><div class="col"><div class="col_dim"></div><div class="ly_in">' +
            '<div class="ly_hd"><h1 class="pop_h1">알림</h1></div>' +
            '<div class="ly_con"></div>' +
            '<butto type="button" class="btn btn_ico close"><span class="hidden">레이어창 닫기</span></butto>' +
            '</div></div></div></div>',
        titleUse: true,
        title: '알림',
        closeUse: true,
        content: 'content',
        container: 'body',
        height: null,
        type: 'confirm',
        openAuto:false,
        closeAct: true,
        confirmType: null,
        dimAct: false
    }
})