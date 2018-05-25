$(document).ready(function(){
  $("#overlay").click(function(){
    if($(".add").css("display").toLowerCase() == "block") closeFrmAdd(); //close Form
  });
  $("#btnAdd").click(openFrmAdd); //open Form
  $("#add_back").click(closeFrmAdd); //close Form
  $("#add_done").click(submitFrmAdd); //submit Form
});
//----------------------------------Form Add-----------------------------------
//open form add
function openFrmAdd(){
  $(".add").css("display", "block");
  $("#btnAdd").css("display", "none");
  $("#overlay").css({"display" : "block","z-index" : "4"});
  $(".add-select").each(function(){
    updDrpdwn(this.id, this.id.substring(4).capitalize());
  });
};
//close form add
function closeFrmAdd(){
  $(".add").css("display", "none")
  $("#btnAdd").css("display", "block");
  $("#overlay").css({"display" : "none", "z-index" : "2"});
};
//submit form add
function submitFrmAdd(){
  let data = {Barcode: $("#add-barcode").val(), Name: $("#add-name").text(), Kategorie: $("#add-kategorie").text(), Ort: $("#add-ort"), Store: $("#add-store").text(), Anzahl: $("#add-anzahl").text(), Einheit: $("#add-einheit").text();}
  console.log(data);
};

//update dropdowns
function updDrpdwn(drpdwn, storename){
  $("#" + drpdwn).empty();
  $("#" + drpdwn).append('<option value="" disabled selected>Bitte wählen</option>')
  let store = getObjectStore(storename, "readonly");
  let req = store.openCursor();
  req.onsuccess = function(event){
    let cursor = event.target.result;
    if (cursor){
      $("#" + drpdwn).append('<option value="' + cursor.key + '">' + cursor.key + '</option>');
      cursor.continue();
    };
  };
  req.onerror = function(event){
    console.error("updDrpdwn", event.error);
  };
};

//------------------------------------------Swipe------------------------------------
//swipe /scroll handler vertical
function swipe(event, phase, direction, distance) {
  if (direction  === null) return;
  let curPos = $(this).scrollTop();
  let newPos = curPos;
  if(direction == 'up'){
    newPos += distance;
    $(this).scrollTop(newPos);
  } else {
    newPos -= distance;
    $(this).scrollTop(newPos);
  };
};
//----------------------------------------list-elements------------------------------------
//Load list-elements
function loadListElements(){
  let store = getObjectStore("Lager", 'readonly');
  $("#list-container").empty();
  let req = store.openCursor()
  req.onsuccess = function(event){
    let cursor = event.target.result;
    if (cursor){
      $("#list-container").append(
        '<div id="' + cursor.key + '"> ' +
          '<div class="list-element-name">' +
            '<a>' + cursor.value.Name + '</a>' +
            '<a class="material-icons">expand_more</a>' +
          '</div>' +
          '<div class="list-element-code">' +
            '<a>' + cursor.value.Anzahl + ' ' +cursor.value.Einheit + '</a>' +
          '</div>' +
        '</div>'
      );
      console.log("loadListElements", cursor.key);
      cursor.continue();
    };
  };
  req.onerror = function(event){
    console.error("loadListElements:", this.error);
  };
};
//add content to list elements
function addContentToListElements(id){
  if ($("#" + id + "_content").length > 0){
    $("#"+id +" .list-element-name a").css("transform", "rotate(0deg)");
    $("#"+ id + "_content").remove();
  }else{
    let store = getObjectStore("Lager", "readonly");
    store.get(id).onsuccess = function(event){
      let cursor = event.target.result;
      $("#"+ cursor.Barcode).append(
        '<div class ="list-element-content" id="' + cursor.Barcode + '_content">' +
          '<ul>' +
            '<li><b>Barcode: </b>' + cursor.Barcode + '</li>' +
            '<li><b>Kategorie: </b>' + cursor.Kategorie + '</li>' +
            '<li><b>Ort: </b>' + cursor.Ort + '</li>' +
            '<li><b>Store: </b>' + cursor.Store + '</li>' +
          '</ul>' +
        '</div>'
      );
      $("#"+ id + " .list-element-name a").css("transform" , "rotate(180deg)");
    };
  };
};

//---------------------------------selectMode---------------------------------------------
//open selectMode
function openselectMode(){
  $(".top-bar").css({"display" : "block", "background-color" : "#fff"});
  $(".select-mode").css("display", "block");
  $("#btnAdd").css("display", "none");
  if($(".list-element-content").length > 0){
    $(".list-element-content").remove()
    $(".list-element-name a").css("transform", "rotate(0deg)");
  }
}
//select list-elements
function selectListElements(id){
  if ($("#" + id).hasClass("selected-list-elements")){
    $("#" +id).removeClass("selected-list-elements");
    if($(".selected-list-elements").length == 0){
      closeselectMode();
    }
  }else{
    $("#" + id ).addClass("selected-list-elements");
  }
  $("#select_counter").html($(".selected-list-elements").length);
}
//close selectMode
function closeselectMode(){
  $(".top-bar").css("display", "none");
  $(".select-mode").css("display", "none");
  $("#btnAdd").css("display", "block");
  $("div").removeClass("selected-list-elements");
}
