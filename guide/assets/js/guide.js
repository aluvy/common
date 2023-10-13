$(()=>{
  $guide.init();
});

const $guide = {
  init: ()=>{
    console.log('$guide');
    const guide = $(document).find("body#guide");
    if( !guide.length ) return;
    $guide.setGuideId();
    $guide.header();
  },
  gnb: [
    { idx: 0, url: 'list/guide.html', title: 'guide' },
    { idx: 1, url: 'list/common.html', title: 'common, etc' },
    { idx: 2, url: 'list/main.html', title: 'main' },
  ],

  /**
   * header markup setting, gnb click event binding
   */
  header: ()=>{
    const guideId = $guide.getGuideId();
    let HTML = `
      <h1><a href="#">logo</a></h1>
        <dl class="status_info">
          <dt>진행중</dt>
          <dd class="ing"></dd>
          <dt>완료</dt>
          <dd class="end"></dd>
          <dt>수정</dt>
          <dd class="modify"></dd>
        </dl>
        <nav>
          <ul>
      `;
      for(i in $guide.gnb){
        const data = $guide.gnb[i];
        let on = (guideId == i) ? "on" : "";
        HTML += `<li class="${on}"><a target="iframe" href="${data.url}">${data.title}</a></li>`;
      }
      HTML += `
          </ul>
      </nav>
    `;
    $(document).find("header#header").append(HTML);
    $guide.navLink();
  },

  /**
   * session Storage의 guideId check 및 setting
   * @returns guideId
   */
  getGuideId: ()=>{
    let guideId = sessionStorage.getItem('guideId');
    if( guideId == null ){
      sessionStorage.setItem('guideId', 0);   // sessionStorage
      guideId = 0;
    }
    return guideId;
  },
  
  /**
   * guideId로 iframe src setting
   */
  setGuideId: ()=>{
    const guideId = $guide.getGuideId();
    const iframe = $(document).find("#iframe");
    const url = $guide.gnb[guideId].url;
    iframe.attr("src", url);
  },

  /**
   * header gnb click event binding, session Storage 'guideId' setting
   */
  navLink: function(){
    const link = $(document).find("#header nav ul li a");
    const iframe = $(document).find("#iframe");
    link.on("click", function(){
      link.parents("li").removeClass("on");
      $(this).parents("li").addClass("on");

      const idx = $(this).parents("li").index();
      sessionStorage.setItem("guideId", idx);   // sessionStorage

      $guide.iframe(iframe);
    });
  },

  /**
   * iframe 주소 값 변경될 때마다 .guide_status setting
   * @param {} elem : iframe
   */
  setStatus: function(elem){
    const body = $(elem).contents().find("body");   // iframe in body
    const guideTable = body.find(".guide_table");   // iframe in table

    const ing = guideTable.find("tbody tr.ing").length;
    const end = guideTable.find("tbody tr.end").length;
    const modify = guideTable.find("tbody tr.modify").length;
    const all = guideTable.find("tbody tr:not(tr.hid):not(tr.guide)").length;
    // const all = ing + end + modify;
    const per = ((end/all) * 100).toFixed(2);

    const HTML = `
      <div class="guide_status">
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
  },

  /**
   * frame 주소 값 변경될 때마다 진행상태 selectbox event binding
   * @param {*} elem : iframe
   */
  setSorting: function(elem){
    const body = $(elem).contents().find("body");   // iframe in body
    const guideTable = body.find(".guide_table");   // iframe in table

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

  /**
   * iframe 주소 값 변경될 때마다 호출
   * @param {*} elem : iframe
   */
  iframe: function(elem){
    $guide.setStatus(elem);
    $guide.setSorting(elem);
    $guide.iframeHeight(elem);
  },
  
  /**
   * iframe 높이값 셋팅
   * @param {*} elem : iframe
   */
  iframeHeight: function(elem){
    $(elem).css({"height": ""});
    const height = $(elem).contents().outerHeight(true);
    $(elem).css({"height": `${height}px`});
  }
}