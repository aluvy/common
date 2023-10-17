$(()=>{
  $(document).on("click", "a[href='#']", function(e){ e.preventDefault() });
  
  $tab.init();
  $accordion.init();
  $toggle.init();
  $pagination.init();
});


const $tab = {
  init: ()=>{
    $tab.click();
  },
  click: ()=>{
    $(document).on("click", ".tab_wrap [role='tab']", (e)=>{
      const _this = $(e.target);
      const _thisId = _this.attr("aria-controls");
      const _thisPanel = _this.parents(".tab_wrap").find(`#${_thisId}`);

      _this.attr("aria-selected", true);
      _this.parents("li").siblings().find("button").attr("aria-selected", false);

      _thisPanel.attr("tabindex", 0);
      _thisPanel.siblings().attr("tabindex", -1);


    })
  }
};

const $accordion = {
  init: ()=>{
    $accordion.setup();
    $accordion.click();
  },
  setup: ()=>{
    $(document).find(".acd_wrap .on button").attr("aria-expanded", true);
    $(document).find(".acd_wrap .on .acd_panel").css({"display":"block"});
  },
  click: ()=>{
    $(document).on("click", ".acd_wrap .acd_ttl button", (e)=>{
      const _this = $(e.target);
      const isOpen = _this.parents("li").hasClass("on");
      const isToggle = _this.parents(".acd_wrap").attr("accordion-option") == "toggle";

      if( isOpen ){
        _this.attr("aria-expanded", false);
        _this.parents("li").removeClass("on");
        _this.parents("li").find(".acd_panel").slideUp(100);
        return;
      }
      
      _this.attr("aria-expanded", true);
      _this.parents("li").addClass("on");
      _this.parents("li").find(".acd_panel").slideDown(100);

      if( !isToggle ){
        _this.parents("li").siblings().removeClass("on").find("button").attr("aria-expanded", false);
        _this.parents("li").siblings().find(".acd_panel").slideUp(100);
      }
    })
  }
}



const $toggle = {
  init: ()=>{
    $toggle.setup();
    $toggle.click();
  },
  setup: ()=>{
    $(document).find(".toggle_tit[aria-expanded='false'] + .toggle_panel").css({"display": "none"});
  },
  click: ()=>{
    $(document).on("click", ".toggle_wrap .toggle_tit", (e)=>{
      const _this = $(e.target);
      const isOpen = eval(_this.attr("aria-expanded"));
      const panel = _this.next(".toggle_panel");

      (isOpen) ? panel.slideUp(100) : panel.slideDown(100);
      _this.attr("aria-expanded", !isOpen);
    });
  }
}


const $pagination = {
  init: ()=>{
    $pagination.click();
  },
  click: ()=>{
    $(document).on("click", ".pagination ul button", (e)=>{
      const _this = $(e.target);
      _this.attr("title", "현재 페이지")
      _this.parents("li").addClass("on");
      _this.parents("li").siblings().removeClass("on").find("button").removeAttr("title");
    })
  }
}

















var _front = {
  init : function(){
    var $dragUse = ($(".list_drag").length > 0) ? true : false;
    _front.$deviceH = $(window).height();
    _front.$deviceV = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sab"));
    _front.$deviceS = (isNaN(_front.$deviceV)) ? 0 : _front.$deviceV;
    /* [전담반 Biz-069] : 20220407 swiper pannel 높이가 device 크기보다 작을 경우 처리 */
    let $header = $("#header").eq(0);
    _front.$hdH = ($header != undefined)?(parseInt($header.outerHeight(true)+($header.innerHeight()-$header.height()))):0; 
    /* //[전담반 Biz-069] : 20220407 swiper pannel 높이가 device 크기보다 작을 경우 처리 */
    
    _front.form();
    _front.scroll();
    
    
    if($dragUse) _front.drag();        
    $(document).on("click", "a[href='#'], a[href='#none']", function(e){ e.preventDefault();});

    // Content 여백(cmd 버튼)
    !$(".btn_confirm_wrap").length > 0 ? $('#content').addClass('type2') : $('#content').removeClass('type2');

    //hr aria-hidden 추가 : 접근성
    $('hr').attr('aria-hidden','true'); 
  },
  scroll : function(){
    var _isStep = ($targetPage().find(".js_step").length > 0) ? true : false;
    if(_isStep) {
      _front.step();
    } else {
      $(document).off('scroll');
    }
  },
  step : function() {
  var _step = $targetPage().find(".js_step");
    var _stepH = parseInt(_step.outerHeight());
    var _hdH = $targetPage().find("#header").outerHeight() == undefined ? 0 : parseInt($targetPage().find("#header").outerHeight());
    var _aniVal = _stepH + _hdH + 20;

    $(document).off('scroll').on("scroll", function(){
      var _st = $(document).scrollTop();

      //[Biz-056] 송금국가 선택시 검색 기능 제공(바텀시트 노출시 스탭 유지)
      if (_st > _aniVal || $('.layer_wrap').hasClass('open')) {
        if (!$('.js_step').hasClass('on')) _step.clone().prependTo('#content').addClass("on");
      } else {
        $('.js_step.on').remove();
      }
    });
  },
  drag : function(){
    $(".js_drag_set .ico_set").on("click", function(){
        // [Biz-007] 계좌순서 변경 기능 개선
      var _this = $(this).closest(".js_drag_set").addClass("on");
      $('.sel_drag_sort .drag_move input[type=radio]').prop('checked', true);
      orderList.compareOff('re');
    });
  },
  form : function(){
    var _doc = $(document);
    var _langRem = 10;
    // [전담반 Biz-158] 전자금융 이용해지 프로세스 신설
    if ($('#content').attr('class') !== undefined) {
      var _classArg = $('#content').attr('class').split(' ');
      _langRem = ($.inArray('global_int_btn', _classArg) != -1) ? 9 : 10; //다국어,국문 구분
    }

    //textarea init
    $(".textarea").each(function(){
      var _this = $(this);
      var _textarea = _this.find("textarea");
      var _numInfo = _this.find(".num_info");
      var _numInfoLen = _numInfo.length;

      _textarea.val().length > 0 ? _textarea.addClass('finished') : _textarea.removeClass('finished');

      if (_numInfoLen > 0) {_this.addClass("textarea_count")}
      if (_textarea.is('[readonly]')){
        _this.addClass("textarea_readonly");
      } else if (_textarea.is('[disabled]')){
        _this.addClass("textarea_disabled");
      }

      _doc.off("keyup", _textarea).on("keyup", _textarea, function(){
        _textarea.val().length > 0 ? _textarea.addClass('finished') : _textarea.removeClass('finished');
      });
    });

    //input init
    $(".input input").each(function(e){
      var _this = $(this);
      var _parent = _this.parent(".input");
      var _valueL = _this.val().length;

      _this.val().length > 0 ? _this.addClass('finished') :  _this.removeClass('finished');

      // 단위 추가
      if(_this.data('unit') && _this.is(':not(.js_money)') && _this.is(':not([type=hidden])')) {
        var _dataUnit = _this.data('unit');

        _this.siblings('.unit').remove();
        _this.after('<span class="unit">' + _dataUnit + '</span>');

        var _unit = _this.siblings('.unit'),
          _unitTxt = _unit.text(),
          _unitGwalho = _unitTxt.match(/[()]/gi),
          _unitBlk = _unitTxt.match(' '),
          _unitBlkL = _unitTxt.replace(' ', '').length;

        if (/[a-z]/.test(_unitTxt)) {
          if ((/[cm%]/gi).test(_unitTxt)) {
            _unitW = _unitBlkL * 1 + (_unitBlk ? 1 : 1.2);
          } else {
            _unitW = _unitBlkL * 1 + (_unitBlk ? 1 : 0.5);
          }
          if (_unitGwalho) _unitW = _unitW - 0.8;
        } else {
          _unitW = _unitBlkL * 1.641 + (_unitBlk ? 1 : 0.4);
          if (_unitGwalho) _unitW = _unitW - 1.8;
        }

        _this.css('padding-right', _unitW + (_parent.is('.outline') ? 0.6 : 0) + 'rem');
        if (_valueL) _this.siblings('.unit').addClass('on');
      }

      if(_this.closest('.input').hasClass('js_global_unit')){
        if (_valueL) _this.closest('.input').addClass('active').find('span.txt_unit').addClass('on');
      }

      _doc.off("keyup", ".input input").on("keyup", ".input input", function(){
        var _this = $(this);
        var _parent = _this.parent(".input");
        var _valueL = _this.val().length;
        var _btn = _this.siblings(".btn_clear");

        _this.next('.unit').addClass('on');
        if(!_valueL) _this.next('.unit').removeClass('on');

        if(_this.closest('.input').hasClass('js_global_unit')){
          _this.closest('.input').addClass('active').find('span.txt_unit').addClass('on');
          if(!_valueL) _this.closest('.input').removeClass('active').find('span.txt_unit').removeClass('on');
        }

        _btn.toggle(Boolean(_this.val()));
        if(_parent.is('.int_pencil')) {
          _parent.find('.btn_pencil').hide().siblings(".btn_clear").css('right', 0.6 + 'rem');
        }

        //input clear 추가
        if (!_this.parents('.form_group').is('.between') && !_this.parents('.form_row').is('.col') && !_parent.is('.outline') && _this.is(':not([type=tel])') && !_this.is('[readonly], [disabled]')) {
          var _inpBtn = _parent.find('.btn.point.round');
          var _inpBtnW = Math.round(_inpBtn.outerWidth()) / _langRem;
          
          _parent.find('.btn_clear').remove();
          _this.css('padding-right', 3.6 + 'rem').siblings(".btn_clear").css('right', 0.6 + 'rem');
          _parent.append('<button type="button" class="btn_clear"><span class="hidden">입력내용 초기화</span></button>');

          _this.val() == '' ? _parent.find('.btn_clear').hide() : _parent.find('.btn_clear').show();  

          if (_this.is('[type=password]')) _this.css('padding-right', 3.6 + 'rem');
          if (_this.siblings('.btn_sch')) _this.css('padding-right', (Math.round(_this.siblings('.btn_sch').outerWidth()) / _langRem) + 3.6 + 'rem').siblings('.btn_clear').css('right', _this.siblings('.btn_sch').outerWidth() / _langRem + 'rem');
        };

        //input 버튼 여백
        if (_parent.find('.btn.point.round').length) {
          var _inpBtn = $(this).parent().find('.btn.point.round');
          var _inpBtnW = Math.round(_inpBtn.outerWidth()) / _langRem;
          
          if (!_this.is('[type=tel]')) {
            _this.css('padding-right', _inpBtnW + 3.6 + 'rem').siblings(".btn_clear").css('right', _inpBtnW + 0.6 + 'rem');
          } else {
            _this.css('padding-right', _inpBtnW + 0.6 + 'rem');
          }
        };
      }).off("focusout").on("focusout", function(){
        var _this = $(this);
        var _parent = _this.parent(".input");
        var _valueL = _this.val().length;
        if(!_valueL) _parent.find('.unit').removeClass('on');

        _this.val().length > 0 ? _this.addClass('finished') :  _this.removeClass('finished'); //[Biz-035] 시인성개선
          
      }).off('click', '.input .btn_clear').on("click", ".input .btn_clear", function(){
        var _this = $(this);
        var _parent = _this.parent(".input");

        _this.removeAttr('style').hide().siblings('input').val('').focus();
        _parent.find('.unit').removeClass('on');

        if(_parent.is('.int_pencil')) _parent.find('.btn_clear').hide().siblings(".btn_pencil").show();
        if(_parent.find('.btn.point.round').length && !_this.is('[type=tel]')) {
          var _inpBtn = _parent.find('.btn.point.round');
          var _inpBtnW = Math.round(_inpBtn.outerWidth()) / 10;
          
          _this.css('right', _inpBtnW + 0.6 + 'rem').hide();
        };
      });
    });

    //select init
    $(".select").each(function(){
      var _this = $(this);
      var _select = _this.find("select");
      var _val =  _select.children("option[value='none']").index();
      var _selected =  _select.children("option:selected").index();

      _select.text().length > 0 ? _select.addClass('finished') :  _select.removeClass('finished');

      if(_val == 0 && _selected == 0) {
        _this.addClass("placeholder");
      }else{
        _this.removeClass("placeholder");
      }
      _select.on("change", function(){
        var _val = _select.children("option:selected").index();
        (_val !== 0) ? _this.removeClass("placeholder") : _this.addClass("placeholder");
      });
    });

    //select
    _doc.on("click touchstart mousedown", ".select_btn .btn_txt", function(){
      $(this).closest(".select_btn").addClass("active");
    }).on("touchend mouseup", ".select_btn .btn_txt", function(){
      $(this).closest(".select_btn").removeClass("active");
    });

    //switch
    $(".switch.rate").change(function(){
      var _chk = $(this).find('input');
      var _labelChild = _chk.next('label').children('span');

      _chk.is(':checked') ? _labelChild.text('하락') : _labelChild.text('상승');
    });

    //[Biz-065] 다크테마 .list_comp + checkbox 비활성화
    if($('.list_comp.check li, .acc_pannel.check').length > 0) { 
      $('.list_comp.check li, .acc_pannel.check').each(function() {
        let $el = $(this).find('input[type=radio], input[type=checkbox]');
          
        if(!($el.parent('.selection').css('display') === 'none') && $el.is('[disabled]')){
          $(this).addClass('disabled');
        }
      }); 
    }
  },

  layerTab : function(){
    $(document).on("click", ".layer_wrap .tab_list button", function(){
      $(".layer_wrap .tab_list button[aria-selected=true]").each(function(){
        var _id = $(this).attr("aria-controls");
        $("#"+_id).addClass("active").siblings().removeClass("active");
      });
    });
  },
  layerClose : function(_target){    
    _this = $(this);
    $(_target).closest(".ly_in").find(".btn.close").trigger("click");            
  },
};




const $popup = {
  item: {},
  open: function(elem){
    $scroll.noScroll();
    $(document).find(".wrap").attr('tabindex', -1);

    const focusBtn = $(elem);
    const popupId = $(elem).data("popup");
    const popup = $(document).find(`.layer_wrap[data-popup="${popupId}"]`);

    // tab check
    if( popup.find(".ly_cnt > .tab_wrap").length ){ popup.addClass('hasTab'); }

    $popup.item[popupId] = {
      popup : popup,
      focusBtn: focusBtn,
      depth: Object.keys($popup.item).length + 1
    };
    popup.addClass("open");
    popup.css({"z-index": $popup.item[popupId].depth+100 });
    popup.attr("popup-depth", $popup.item[popupId].depth);

    // focus event
    const ly_hd = (popup.find(".ly_hd").length) ? popup.find(".ly_hd") : popup.find(".ly_in");
    ly_hd.attr("tabindex", 0);
    const closeIcoBtn = popup.find(".btn_ico.close");
    setTimeout(()=>{ ly_hd.focus() }, 201);
    closeIcoBtn.on('keydown', (e)=>{ if ((e.key == 'Tab' && !e.shiftKey) || e.key == 'ArrowRight')  { e.preventDefault(); ly_hd.focus() } });
    ly_hd.on('keydown',       (e)=>{ if ((e.key == 'Tab' && e.shiftKey) || e.key == 'ArrowLeft')    { e.preventDefault(); closeIcoBtn.focus() } });

    // close event
    const closeBtn = popup.find('[data-action="close"]');
    const closeAllBtn = popup.find('[data-action="closeAll"]');
    closeBtn.on("click", ()=>{ $popup.close(popupId) });
    closeAllBtn.on("click", ()=>{ $popup.closeAll() });
  },
  close: function(popupId){
    const focusBtn = $popup.item[popupId].focusBtn;
    const popup = $popup.item[popupId].popup;

    popup.removeClass('open');
    popup.addClass('close');

    setTimeout(()=>{
      popup.removeClass('close');
      popup.removeAttr("style");
      popup.removeAttr("popup-depth");
      focusBtn.focus();

      delete $popup.item[popupId];
      if( Object.keys($popup.item).length < 1 ){ $scroll.scroll(); $(document).find(".wrap").removeAttr("tabindex"); };
    }, 201);
  },
  closeAll: function(popupId){
    Object.keys($popup.item).forEach((a, i)=>{ $popup.close(a) });
  },
};


const $scroll = {
  scroll: ()=>{
    $("body, html").removeClass("noScroll");
  },
  noScroll: ()=>{
    $("body, html").addClass("noScroll");
  }
}