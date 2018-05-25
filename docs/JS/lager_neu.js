$(document).ready(function(){
  $(document).click(function(event){
    let target = event.target;
    if(target.id == "add-form-background" || target.id == "add-back")hideAdd(); //hide Form
  });

  $("#add-open").click(showAdd); // show Form

  //submit Form
  $("#add").submit( function(event){
    event.preventDefault();
    let data = {Barcode: $("#add-code").val(), Name: $("#add-name").val(), Anzahl: $("#add-anzahl").val(), Ort: $("#add-ort").val(), Kategorie: $("#add-kategorie").val(), Einheit: $("#add-einheit").val(), InUse: 'false',  Store: $("#add-store").val()};
    dbAddLager(data);
    hideAdd();
    });

    $("#add-kategorie").change(function(){
      let state = $("#add-kategorie").val() == "Getränke" ? "inline-flex" : "none";
      $("#add-einheit").css("display", state);
    });
});

function showAdd(){
  $("#add-form-wrapper").toggleClass("visible");
  $(".overlay").css("display", "block");
  $(".add-input").each(function(){
    $(this).val("");
  });
  $(".add-select").each(function(){
    loadDrpdown("#" + this.id);
  })
};

function hideAdd(){
  $("#add-form-wrapper").toggleClass("visible");
  $(".overlay").css("display", "none");
};

function loadDrpdown(e){
  let sname = e.substring(e.indexOf("-") +1);
  $(e).empty();
  $(e).append('<option value="" disabled selected>Bitte wählen</option>');
  let store = getObjectStore(sname.capitalize(), 'readonly');
  let req = store.openCursor();
  req.onsuccess = function(event){
    let cursor = event.target.result;
    if(cursor){
      $(e).append('<option value="' + cursor.key + '">' + cursor.key + '</option>');
      cursor.continue();
    }
  };
  req.onerror = function(event){
     console.error("loadDrpdown", this.error);
  };

};

function dbAddLager(data){
  console.log(data);
  let store = getObjectStore("Lager", "readwrite");
  let req = store.get(data.Barcode);
  req.onsuccess = function(event){
    if(event.target.result == undefined){
      dbAdd(data, "Lager");
    } else {
      if(confirm("Wollen Sie " & data.Name & "(" & data.Barcode & ") überschreiben?")){
        dbUpdate(data, "Lager");
      };
    };
  };
  req.onerror = function(){
    console.log("dbAddLager", this.error);
  };
};

function loadListElements(){
  $("#list-element-container").empty();
  let store = getObjectStore("Lager", "readonly");
  let req = store.getAll();
  req.onsuccess = function(event){
    let data = event.target.result;
    data.forEach(function(val){
      let symbol =  val.Kategorie == "Getränke" ? val.Einheit : val.Kategorie;
      $("#list-element-container").append(
        '<div id="' + val.Barcode + '">' +
          '<a>' + val.Name + '</a>' +
          '<a id="anzahl">' + val.Anzahl + '</a>' +
          '<img src="css/pics/einheiten/' + symbol + '.svg">' +
        '</div>'
      );
    });
  };
  req.onerror = function(){
    console.error("loadListElements", this.error);
  };
}
