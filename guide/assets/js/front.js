$(()=>{
  $(document).on("click", "a[href='#']", function(e){ e.preventDefault() });

  $tab.init();
  $accordion.init();
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
      _this.parent("li").siblings().find("button").attr("aria-selected", false);

      _thisPanel.attr("tabindex", 0);
      _thisPanel.siblings().attr("tabindex", -1);
      console.log(_this);
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