var _front = {
    init: function(){

    },
    formBtn: function(){

    },
    formTimer: function(){

    },
    form: function(){

    },
    switch: function(){

    },
    select: function(){
        
    }
}

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

var _calendar = {
    idCal: '',
    idInput: '',
    format: '-',
    valY: '',
    valM: '',
    valD: '',
    minH: '',
    maxH: '',

    /**
     * _calendar.open( idCal, idInput, dateVal, format )    : 달력 레이어팝업 호출
     * @param {string} idCal        : 달력 팝업 내  DIV ID
     * @param {string} idInput      : 달력에서 날짜 선택 시 날짜를 입력받을 input id
     * @param {string} dateVal      : 기본 선택되어 있는 날짜 (20230223)
     * @param {string} format       :0000-00-00
     */
    open: function( idCal, idInput, dateVal, format ){
        _calendar.idInput = idInput;
        _calendar.format = (format!=undefined) ? foramt : "-";

        if( $(`#${idCal}`).length < 1 ){
            let HTML = `<div id="${idCal}" class="layerHTML"></div>`;
            $("body").append(HTML);
        }

        _calendar.show( idCal, dateVal );
        $.ohyLayer({
            title: "날짜선택",
            content: `#${idCal}`,
            type: 'calendar'
        })
    },

    /**
     * _calendar.show( idCal, dateVal ) : 달력 보이기
     * @param {string} idCal
     * @param {string} dateVal 
     */
    show: function( idCal, dateVal ){
        var strDate = dateVal;
        var year = "";
        var month = "";
        var date = "";

        // 기본 날짜 유효성 체크
        if( _calendar.isDate(strDate) ){
            if( strDate.length == 8 ){
                year = strDate.substring(0,4);
                month = strDate.substring(4,6);
                date = strDate.substring(6);
            } else {
                year = strDate.substring(0,4);
                month = strDate.substring(5,7);
                date = strDate.substring(8);
            }
        } else {
            var today = new Date();
            year = today.getFullYear();
            month = today.getMonth() + 1;
            date = today.getDate();
        }

        _calendar.makeCalendar( idCal, valY, valM, valD, dateVal );
    },


    makeCalendar: function( idCal, valY, valM, valD, dateVal ){
        _calendar.idCal =idCal;
        _calendar.valY = Number(valY);
        _calendar.valM = Number(valM);
        _calendar.valD = Number(valD);

        // 캘린더 담을 타겟 설정
        let calendar = $(`#${idCal}`);
        if( $(`#${idCal}-wrap`).length > 0 ){
            calendar = $(`#${idCal}-wrap`).parents(".ly_con");
        }

        //해당 월의 마지막 데이트 검증
        let valDD = _calendar.getLastDayOfMonth(valY, valM-1) < valD ? _calendar.getLastDayOfMonth(valY, valM-1): valD;
        if( _calendar.valD!= valDD ){ _calendar.valD = valDD; }

        // 오늘 날짜 설정용
        let strToday = new Date();
        let strTodayYear = strToday.getFullYear();
        let strTodayMonth = strToday.getMonth() + 1;
        let strTodayDay = strToday.getDate();

        let today = new Date( _calendar.valY,_calendar.valM-1, _calendar.valD );
        let year = today.getFullYear();
        let nextyear = year + 1;
        let lastyear = year - 1;
        let month = today.getMonth();
        let date = today.getDate();
        let strMonth = month+1 < 10 ? '0'+(month+1) : (month+1);

        let strPreMonth = (Number(strMonth)-1)+"";
        let strPreYear = year;
        let strNextMonth = (Number(strMonth)+1)+"";
        let strNextYear = year;

        if( (Number(strMonth)-1) == 0 ){
            strPreMonth = "12";
            strPreYear = year - 1;
        } else if( (Number(strMonth)+1) == 13 ){
            strNextMonth = "1";
            strNextYear = year + 1;
        }

        // text 설정
        let day = new Array("일", "월","화", "수", "목", "금", "토");
        let txtYearMonth = `${year}.${strMonth}`;
        let txtCaption = "달력";
        let txtConfirm = "확인";
        // let txtCancel = "취소";
        let txtToday = "오늘";

        let firstOfMonth = new Date( year, month, 1);
        let firstDay = firstOfMonth.getDay();
        let lastDate = _calendar.getLastDayOfMonth( year, month );

        let HTML = `
            <div class="ly_cnt" style="max-height: ${_calendar.maxH * 0.1}rem; min-height: ${_calendar.minH * 0.1}rem;">
                <div class="ly_calendar" id="${idCal}-wrap">
                    <div class="cal_month">
                        <button type="button" class="btn_ico first" onclick="_calendar.makeCalendar('${idCal}', '${lastyear}', '${strMonth}', '${date}', '${dateVal}')"><span class="hidden">전년도</span></button>
                        <button type="button" class="btn_ico prev" onclick="_calendar.makeCalendar('${idCal}', '${strPreYear}', '${strPreMonth}', '${date}', '${dateVal}')"><span class="hidden">이전달</span></button>
                        <span class="year_txt">${txtYearMonth}</span>
                        <button type="button" class="btn_ico next" onclick="_calendar.makeCalendar('${idCal}', '${strNextYear}', '${strNextMonth}', '${date}', '${dateVal}')"><span class="hidden">다음달</span></button>
                        <button type="button" class="btn_ico end" onclick="_calendar.makeCalendar('${idCal}', '${lastyear}', '${strMonth}', '${date}', '${dateVal}')"><span class="hidden">다음년도</span></button>
                        <button type="button" class="today" onclick="_calendar.makeCalendar('${idCal}', '${strTodayYear}', '${strTodayYear}', '${strTodayDay}', '${dateVal}')">${txtToday}<span class="hidden">선택</span></button>
                    </div>
                    <table id="${idCal}-table" class="cal_tbl">
                        <caption>${txtCaption}</caption>
                        <thead>
                            <tr>
                                <th scope="col" class="sunday">${day[0]}</th>
                                <th scope="col">${day[1]}</th>
                                <th scope="col">${day[2]}</th>
                                <th scope="col">${day[3]}</th>
                                <th scope="col">${day[4]}</th>
                                <th scope="col">${day[5]}</th>
                                <th scope="col" class="saturday">${day[6]}</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        let dayNum = 1;
        let curCol = 1;
        let weekcount = 0;

        // loop
        for(let i=1; i<Math.ceil((lastDate+firstDay)/7); i++){
            HTML += `<tr>`;
            for(let j=1; j<=7; j++){
                // 요일설정
                if(j==1){               HTML =+ `<td class="sunday">`;
                } else if(j==7) {       HTML =+ `<td class="saturday">`;
                } else {                HTML =+ `<td>`;
                }

                weekcount = weekcount + 1;

                if( curCol < firstDay + 1 || dayNum > lastDay ){
                    HTML += `&nbsp;`;
                    curCol++;
                } else {
                    if( dayNum == date ){
                        HTML += `<button type="button" class="on" title="선택 됨" onclick="_calendar.selectDay(this, '${idCal}', '${year}', '${strMonth}', '${dayNum}')" >${dayNum}</button>`;
                    } else {
                        switch(j){
                            default:
                                HTML += `<button type="button" onclick="_calendar.selectDay(this, '${idCal}', '${year}', '${strMonth}', '${dayNum}')" >${dayNum}</button>`;
                        }
                    }
                    dayNum++;
                }
                HTML += `</>`;
            }
            HTML += `</tr>`;
        }

        HTML += `
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="btn_pop_confirm_wrap">
                <div class="btn_area">
                    <button type="button" class="btn primary" onclick="_calendar.setYMD('${idCal}')">${txtConfirm}</button>
                </div>
            </div>
        `;
        calendar.html(HTML);
    },

    /**
     * _calendar.selectDay( obj, idCal, valY,valM, valD )   : 달력에서 선택한 년월일을 전역 변수에 저장
     * @param {object} obj      : DOM object
     * @param {string} idCal    : DOM id
     * @param {string} valY     : 년
     * @param {string} valM     : 월
     * @param {string} valD     : 일
     */
    selectDay: function( obj, idCal, valY, valM, valD ){
        $(`#${idCal}-table`).find("button").removeClass("on");
        $(`#${idCal}-table`).find("button").removeAttr("title");
        $(obj).attr("title", "선택 됨");
        $(obj).addClass("on");

        _calendar.idCal = idCal;
        _calendar.valY = valY;
        _calendar.valM = valM;
        _calendar.valD = valD;
    },

    /**
     * _calendar.setYMD( idCal )    : 달력에서 선택한 년월일을 idInput value에 리턴 후 팝업 닫기
     * @param {string} idCal 
     */
    setYMD: function( idCal ){
        var idCal = _calendar.idCal;
        var idInput = _calendar.idInput;
        var valY = String(_calendar.valY);
        var valM = String(_calendar.valM).padStart(2, "0");
        var valD = String(_calendar.valD).padStart(2, "0");

        $(`#${idInput}`).val(`${valY}${_calendar.format}${valM}${_calendar.format}${valD}`);
        $(`#${idInput}`).attr("data-date", `${valY}${valM}${valD}`);

        this.onclose( idCal );
    },

    /**
     * _calendar.onclose( idCal )   : 해당 id를 가진 달력 팝업을 닫음
     * @param {string} idCal        :  
     */
    onclose: function( idCal ){
        var idCal = _calendar.idCal;
        var idInput = _calendar.idInput;

        $(`${idInput}`).keyup();    // btn_clear
        $(`${idCal}_dev`).click();  // close
    },

    /**
     * _calendar.getLastDayOfMonth( year, month )   : 해당 년 월의 마지막 일 계산
     * @param {number} year     : 년 (2023) 
     * @param {number} month    : 월 (2)
     * @returns {number}        : 마지막날짜 (31)
     */
    getLastDayOfMonth: function( year, month ){
        var tempDay = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
        if( ((year%4==0) && (year%100!=0)) || (year%400==0) ) tempDay[1] =29;
        else tempDay[1] = 28;
        return tempDay[month];
    },

    /**
     * _calendar.isDate( yyyymmdd ) : 날짜 유효성 체크(병합된 yyyymmdd 값)
     * @param {string} yyyymmdd          : 검증 문자열
     * @returns {boolean}
     */
    isDate: function( yyyymmdd ){
        var isTrue = false;
        if( _calendar.isNumStr(yyyymmdd) ){
            var yyyy = eval(yyyymmdd.substring(0,4));
            var mm = eval(yyyymmdd.substring(4,6));
            var dd = eval(yyyymmdd.substring(6,8));
            if( _calendar.isYearMonthDay(yyyy,mm-1,dd) ) isTrue = true;
        } else if ( yyyymmdd == "" ){
            isTrue = false;
        }
        return isTrue;
    },

    /**
     * _calendar.isNumStr( value )  : 숫자로 구성된 문자열 체크
     * @param {string} value        : 검증 문자열
     * @returns {boolean}
     */
    isNumStr: function( value ){
        var ii;
        var str = null;
        str = new String(value);
        if( str==null || str.length ==0 ) return false;
        for( ii=0; ii<str.length; i++ ){
            if( !_calendar.isInt(str.charAt(ii)) )
            return false;
        }
        return true;
    },

    /**
     * _calendar.isInt( value ) : 한 글자가 숫자인지 체크
     * @param {string} value    : 검증 문자열
     * @returns {boolean}
     */
    isInt: function( value ){
        var j;
        var _intValue = "0123456789";
        for(j=0; j<_intValue.length; j++){
            if( value == _intValue.charAt(j) ) return true;
        }
        return false;
    },

    /**
     * _calendar.isYearMonthDay( yyyy,mm, dd ) : 날짜 유효성 체크 (분리된 yyyy, mm, dd 값)
     * @param {string} yyyy     : 검증 문자열 
     * @param {string} mm       : 검증 문자열
     * @param {string} dd       : 검증 문자열
     * @returns {boolean}
     */
    isYearMonthDay: function( yyyy, mm, dd ){
        var isTrue = false;
        var iMaxDay = _calendar.getLastDayOfMonth(yyyy,mm);
        if( yyyy == "" && mm == "" && dd == "" ){
            isTrue = true;
        } else {
            if( (yyyy>=1901) && (yyyy<=9999) &&(mm>=0) &&(mm<=11) && (dd>=1) && (dd<=iMaxDay) ){
                isTrue = true;
            }
        }
        return isTrue;
    }
}