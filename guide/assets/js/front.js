$(()=>{
  $guide.init();

  $(document).find("a[href='#']").on("click", function(e){ e.preventDefault() });
});


const $guide = {
  init: ()=>{
    const guide = $(document).find("body.guide");
    if( !guide.length ) return;
    $guide.navLink();
  },
  navLink: function(){
    const link = $(document).find("#header nav ul li a");
    const iframe = $(document).find("#iframe");
    link.on("click", function(){
      link.parents("li").removeClass("on");
      $(this).parents("li").addClass("on");
      $guide.iframe(iframe);
    });
  },
  status: function(elem){ // elem : iframe
    // const iframeBody = elem.contentWindow.document.body;
    const body = $(elem).contents().find("body");   // iframe in body
    const guideTable = body.find("#guide_table");   // iframe in table

    const ing = guideTable.find("tbody tr.ing").length;
    const end = guideTable.find("tbody tr.end").length;
    const modify = guideTable.find("tbody tr.modify").length;
    const all = ing + end + modify;
    const per = ((end/all) * 100).toFixed(2);

    const HTML = `
      <div id="guide_status">
        <div class="sort">
          <select id="sort_status">
            <option value="0">진행상태 전체</option>
            <option value="ing">진행중</option>
            <option value="end">퍼블완료</option>
            <option value="modify">수정</option>
          </select>
        </div>
        <div class="graph">
          <span>${per} %</span>
          <span class="body"><span class="per" style="width:${per}%"></span></span>
        </div>
        <dl class="info">
          <dt>전체</dt>
          <dd>${all}</dd>
          <dt>진행중</dt>
          <dd>${ing}</dd>
          <dt>완료</dt>
          <dd>${end}</dd>
        </dl>
      </div>
    `;
    body.prepend(HTML);

    // select
    const select = body.find("#sort_status");
    select.on("change", function(){
      const value = $(this).find("option:selected").val();
      const tr = guideTable.find("tbody tr");
      const ing = guideTable.find("tbody tr.ing");
      const end = guideTable.find("tbody tr.end");
      const modify = guideTable.find("tbody tr.modify");
      
      tr.css({"display": "none"});

      switch(value){
        case "ing" :      ing.css({"display": ""});     break;
        case "end" :      end.css({"display": ""});     break;
        case "modify" :   modify.css({"display": ""});  break;
        default:          tr.css({"display": ""});
      }
    })
  },
  iframe: function(elem){
    $guide.status(elem);
    $guide.iframeHeight(elem);
  },
  iframeHeight: function(elem){
    $(elem).css({"height": ""});
    // const height = elem.contentWindow.document.body.scrollHeight;
    const height = $(elem).contents().outerHeight(true);
    $(elem).css({"height": `${height}px`});
  }
}