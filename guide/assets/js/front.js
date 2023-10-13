$(()=>{
  $(document).find("a[href='#']").on("click", function(e){ e.preventDefault() });
});