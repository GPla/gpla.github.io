// IDEA: use functions if async is poss. else use transaction.complete in function
var db;
(function(){
  const Orte = [{Ort:"Keller"}, {Ort:"Küche"}];
  const Kategorien = [{Kategorie:"Tiefkühl"}, {Kategorie:"Obst & Gemüse"}, {Kategorie: "Getränke"}, {Kategorie: "Snacks"}];
  const Einheiten = [{Einheit:"Packung(en)"}, {Einheit:"Flasche(n)"}, {Einheit: "Kiste(n)"}];
  const Store = [{Store: "Scheune"}];

  //check for support
  if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
    return;
  }

  databaseOpen(function(){
    $(document).ready(function(){
      let path = window.location.pathname;
      let page = path.split("/").pop();
      switch (page) {
        case "lager_neu.html":
          loadListElements();
          break;
      };
    });
  });

  function databaseOpen(callback) {
    let request = indexedDB.open("Lebensmittel", 1);
   request.onupgradeneeded = function(event){
      console.log("DB Upgrade needed.")
      db = this.result;

    //Lager
     let objectStore =  db.createObjectStore("Lager", {keyPath: "Barcode"});
     objectStore.createIndex ("Name", "Name", {unique: true});
     objectStore.createIndex ("Anzahl", "Anzahl", {unique: false});
     objectStore.createIndex ("Ort", "Ort" ,{unique: false});
     objectStore.createIndex ("Kategorie", "Kategorie", {unique: false});
     objectStore.createIndex ("Einheit", "Einheit", {unique: false});
     objectStore.createIndex("Store", "Store", {unique:false});
     objectStore.createIndex("InUse", "InUse", {unique: false});
     objectStore.createIndex("Einkaufsliste", "Einkaufsliste", {unique: false})

     //Kategorie
     objectStore = db.createObjectStore("Kategorie", {keyPath:"Kategorie"});
     for (let i in Kategorien){
       objectStore.add(Kategorien[i]);
     };

     //Ort
      objectStore = db.createObjectStore("Ort", {keyPath:"Ort"});
      for(let i in Orte){
        objectStore.add(Orte[i]);
      };

      //Einheit
     objectStore =db.createObjectStore ("Einheit", {keyPath:"Einheit"});
     for(let i in Einheiten){
       objectStore.add(Einheiten[i]);
     };

     //Einkaufsliste
     objectStore = db.createObjectStore("Einkaufsliste", {keyPath:"Name"});

     //Store
     objectStore = db.createObjectStore("Store", {keyPath: "Store"});
     for(let i in Store){
       objectStore.add(Store[i]);
     }
   };
    request.onsuccess = function(event) {
      console.log("databaseOpen successful")
      db = event.target.result;
      callback();
    };
    request.onerror = function(event){
      console.error("databaseOpen", this.error);
    };
  };
})();

function getdb(){
  return db;
}

//open transaction
function getObjectStore(store_name, mode) {
  let tx = db.transaction(store_name, mode);
  return tx.objectStore(store_name);
};

//add to objectStore
function dbAdd(data, db){
  let store = getObjectStore(db, "readwrite");
  console.log("dbAdd", arguments);
  let req = store.add(data);
  req.onsuccess = function (evt) {
    console.log("dbAdd", db, "successful");
    loadListElements();
   };
  req.onerror = function() {
    console.error("dbAdd", this.error);
  };
};

//delete from db
function dbDelete(key, db){
  console.log("dbDelete:" + key +"(" + typeof key + ")", db);
  let store = getObjectStore(db, "readwrite")
  let request = store.get(key);
  request.onsuccess = function(event){
   let record = event.target.result;
   console.log("record:", record)
   if (typeof record == 'undefined'){
     console.log("record not found");
     return;
   }
   let req  = store.delete(key)
   req.onsuccess = function(event){
     console.log("dbDelete successful");
     loadListElements();
   }
   req.onerror = function(event) {
     console.error("dbDelete", this.error);
   }
  }
}

//update DB
function dbUpdate(data, db){
  console.log("updateEditDB", arguments);
  let store = getObjectStore(db, "readwrite");
  let req = store.openCursor(data.Barcode);
  req.onsuccess = function(event){
    let cursor = event.target.result;
    if (cursor){
      cursor.update(data);
    };
    loadListElements();
  };
  req.onerror = function(event){
    console.error("updateDB", this);
  };
};

//-----------------------------------------Einheit---------------------------------
//cut Einheit
function cEinheit(Einheit, Anzahl){
  let index = Einheit.indexOf("(");
  if(index > -1){
    if (Anzahl == 1){
     Einheit = Einheit.substring (0, index);
    }else{
      Einheit = Einheit.replace(/[()]/g, "");
    };
  };
  return Einheit;
};
