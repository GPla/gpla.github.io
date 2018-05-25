$(document).ready(function(){
  let db = getdb();
  //overlay
  $(".overlay").click(function(){
    if ($(".search-wrapper").css("display") == "block") closeSearch();
    if($(".sidebar-wrapper").css("display") == "block") closeSidebar();
  });

  //search
  $("#navbar-search").click(showSearch);
  $("#search-back").click(closeSearch);

  //menu
  $("#navbar-menu").click(openSidebar);
  $("#sidebar-liste").click(addListeDetails);

  //select
$(document).on("click", "#list-element-container div", openSelect);
});

function showSearch(){
  $(".search-wrapper").css("display", "block");
  $("#search-input").trigger("focus");
  $(".overlay").css("display", "block");
  //$(".overlay").addClass("navbar-visible");
};
function closeSearch(){
  $(".search-wrapper").css("display", "none");
  $(".overlay").css("display", "none");
  //$(".overlay").removeClass("navbar-visible");
};

function openSidebar(){
  $(".sidebar-wrapper").css("display", "block");
  $(".overlay").css("display", "block");
};
function closeSidebar(){
  $(".sidebar-wrapper").css("display", "none");
  $(".overlay").css("display", "none");
  if($("#sidebar-liste-details-wrapper").hasClass("visible") == false) {$("#sidebar-liste-details-wrapper").toggleClass("visible");}
};

function addListeDetails(){
  $("#sidebar-liste-details-wrapper").toggleClass("visible");
  $("#sidebar-liste-arrow").toggleClass("up");
  $(".sidebar-liste-details").empty();
  let tx = db.transaction("Einkaufsliste", "readonly");
  let store = tx.objectStore("Einkaufsliste");
  let req = store.getAll();
  req.onsuccess = function(event){
    let data = event.target.result;
    data.forEach(function(i){
      $(".sidebar-liste-details").append('<li><a>' + i.Name + '</a></li>');
    });
  };
  req.onerror = function(event){
    console.error("addListeDetails", this.error);
  };
  tx.oncomplete = function(){
    $(".sidebar-liste-details").append('<li><a>Liste hinzuf&uumlgen</a></li>');
  };
};

function openSelect(){
  $(".select-wrapper").css("display", "block");
};

function closeSelect(){

};
