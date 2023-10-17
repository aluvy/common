$(()=>{
  $(document).on("click", "a[href='#']", function(e){ e.preventDefault() });
  
  $tab.init();
  $accordion.init();
  $toggle.init();
  $pagination.init();
  $input.init();
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
    $(document).find(".toggle_ttl[aria-expanded='false'] + .toggle_panel").css({"display": "none"});
  },
  click: ()=>{
    $(document).on("click", ".toggle_wrap .toggle_ttl", (e)=>{
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















const $input = {
  init: ()=>{
    $input.setup();
    $input.input();
    $input.isFocus();
    $input.clear();
  },
  setup: ()=>{
    $(document).find(".form_group .input input").each((idx, a)=>{
      const _this = $(a);
      $input.hasVal(_this);

      if( _this.attr("required") == "required" ) _this.parents(".form_group").addClass("required");
      
    });
  },
  input: ()=>{
    $(document).on("input", ".form_group .input input", function(e){
      const _this = $(e.target);
      $input.hasVal(_this);
    })
  },
  isFocus: function(){
    $(document).on("focus", ".form_group .input input", function(e){
      const _this = $(e.target);
      const _input = _this.parents(".input");
      _input.addClass("focus");
    })
    $(document).on("blur", ".form_group .input input", function(e){
      const _this = $(e.target);
      const _input = _this.parents(".input");
      
      $input.hasVal(_this);
      _input.removeClass("focus");
    })
  },
  hasVal: function(elem){
    const _this = elem;
    const _input = _this.parents(".input");
    const _formBtn = _input.find(".form_btn");

    if( _formBtn.length ){
      setTimeout(()=>{
        const paddingRight = Math.ceil(_formBtn.outerWidth(true)) * 0.1;
        _this.css({"padding-right" : `${paddingRight}rem`});
      }, 10);
    }

    (_this.val().length) ? _input.addClass("hasVal") : _input.removeClass("hasVal");
  },
  clear: function(){
    $(document).on("click", ".form_group .input .btn_clear", function(e){
      const _this = $(e.target);
      const _input = _this.parents(".input").find("input");
      _input.val("").focus();
      $input.hasVal(_input);
    })
  }
}




const $popup = {
  item: {},
  open: function(elem){
    $scroll.noScroll();
    $(document).find(".wrap").attr('tabindex', -1);

    const focusBtn = $(elem);
    const popupId = $(elem).data("popup");
    const popup = $(document).find(`.layer_wrap[data-popup="${popupId}"]`);

    $popup.selectBtn(focusBtn, 'open'); // form_group in select_btn check

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

    // select_btn check
    $popup.selectBtn(focusBtn, 'close');

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
  closeAll: function(){
    Object.keys($popup.item).forEach((a, i)=>{ $popup.close(a) });
  },

  /**
   * .form_group 내의 .select_btn 클릭으로 팝업 오픈 시 .select에 'focus' 클래스 토글
   * @param {*} focusBtn 
   * @param {*} type string 'open', 'close'
   */
  selectBtn: function(focusBtn, type){
    const isSelectBtn = focusBtn.hasClass("select_btn");
    const isSelect = focusBtn.parent().hasClass("select");
    if( !isSelectBtn && !isSelect ) return;
    
    (type == 'open') ? focusBtn.parents(".select").addClass("focus") : focusBtn.parents(".select").removeClass("focus");
  }
};


const $scroll = {
  scroll: ()=>{
    $("body, html").removeClass("noScroll");
  },
  noScroll: ()=>{
    $("body, html").addClass("noScroll");
  }
}