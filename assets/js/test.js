$(()=>{
    _test.init();
    console.log("test");
});

var elem = $("#data");
var _test = {
    init: function(){
        _test.getWinH();
    },
    getWinH: function(){
        let winH = $(window).height();
        $("#data").html(winH);
    }

};