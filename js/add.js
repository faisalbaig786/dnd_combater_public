let fileName;
let file;

let existingCharacterAlts = [];
let existingCharacterImgs = [];

function addAdventurer(adventurerFile) {
    let adventurerName = $("#adventurer_add_name").val();
    let adventurerAlt = $("#adventurer_add_alt").val();

    if (adventurerAlt == "") {
        adventurerAlt = adventurerName;
    }

    if ((adventurerName == "") ||
    ($("#adventurer_upload").get(0).files.length == 0)) 
    {   
        characterAddFail("#unsuccessfully_added_adventurer_empty");        
        return 0;
    }

    if (existingCharacterAlts.indexOf(adventurerAlt) > -1) {
        characterAddFail("#unsuccessfully_added_adventurer_name");
        return 0;
    }

    if (existingCharacterImgs.indexOf(adventurerFile) > -1) {
        characterAddFail("#unsuccessfully_added_adventurer_file");
        return 0;
    }

    var adventurerObj = adventurerFile.replace(/\.[^/.]+$/, "");
    var dbAdventurerObj = firebase.database().ref(uid + "/adventurers/").child(adventurerObj); 

    uploadAdventurerImage(adventurerObj);
            
    dbAdventurerObj.update ({
        "alt" : adventurerAlt,
        "file" : adventurerFile,
        "name" : adventurerName
    })
}

function addCreature(creatureFile) {
    let creatureName = $("#creature_add_name").val();
    let creatureAlt = $("#creature_add_alt").val();
    let creatureSize = $("#creature_add_size").val();

    if (creatureAlt == "") {
        creatureAlt = creatureName;
    }   

    if ((creatureName == "") ||
    ($("#creature_upload").get(0).files.length == 0)) 
    {   
        characterAddFail("#unsuccessfully_added_creature_empty");        
        return 0;
    }

    if (existingCharacterAlts.indexOf(creatureAlt) > -1) {
        characterAddFail("#unsuccessfully_added_creature_name");
        return 0;
    }

    if (existingCharacterImgs.indexOf(creatureFile) > -1) {
        characterAddFail("#unsuccessfully_added_creature_file");
        return 0;
    }

    var creatureObj = creatureFile.replace(/\.[^/.]+$/, "");
    var dbCreatureObj = firebase.database().ref(uid + "/creatures/").child(creatureObj); 
    
    uploadCreatureImage(creatureObj);  
            
    dbCreatureObj.update ({
        "alt" : creatureAlt,
        "file" : creatureFile,
        "name" : creatureName,
        "size" : creatureSize
    })
}

function addBackground(backgroundFile) {
    let backgroundName = $("#background_add_name").val();

    let backgroundAlt = backgroundName;

    if ((backgroundName == "") ||
    ($("#background_upload").get(0).files.length == 0)) 
    {   
        characterAddFail("#unsuccessfully_added_background_empty");        
        return 0;
    }

    var backgroundObj = backgroundFile.replace(/\.[^/.]+$/, "");
    var dbBackgroundObj = firebase.database().ref(uid + "/backgrounds/").child(backgroundObj); 

    uploadBackgroundImage(backgroundObj);
            
    dbBackgroundObj.update ({
        "alt" : backgroundAlt,
        "file" : backgroundFile,
        "name" : backgroundName
    })
}

function uploadAdventurerImage(adventurerObj) {

    $("#adventurer_upload_bar .ui-progressbar-value").css("display", "block");

    var storageRef = firebase.storage().ref(uid + "/adventurers/" + fileName);

    let task = storageRef.put(file);

    task.on("state_changed",
    
    function progress(snapshot) {
        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        $("#adventurer_upload_bar .ui-progressbar-value").css("width", percentage + "%");
    },

    function error(err) {
        var dbDelIncAdv = firebase.database().ref(uid + "/adventurers/").child(adventurerObj);
        dbDelIncAdv.remove();
        unsuccessfullyAdded("#adventurer_upload_bar .ui-progressbar-value", 
        "#unsuccessfully_added_adventurer_image", resetAddAdventurer());
    },

    function complete() {      
        successfullyAdded("#adventurer_upload_bar .ui-progressbar-value", 
        "#successfully_added_adventurer", resetAddAdventurer());
        updateAdventurers(adventurerObj);
    }
    )
}

function uploadCreatureImage(creatureObj) {
    
    $("#creature_upload_bar .ui-progressbar-value").css("display", "block");

    var storageRef = firebase.storage().ref(uid + "/creatures/" + fileName);

    let task = storageRef.put(file);

    task.on("state_changed",
    
    function progress(snapshot) {
        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        $("#creature_upload_bar .ui-progressbar-value").css("width", percentage + "%");
    },

    function error(err) {
        var dbDelIncCre = firebase.database().ref(uid + "/creatures/").child(creatureObj);
        dbDelIncCre.remove();
        unsuccessfullyAdded("#creature_upload_bar .ui-progressbar-value", 
        "#unsuccessfully_added_creature_image", resetAddCreature());
    },

    function complete() {      
        successfullyAdded("#creature_upload_bar .ui-progressbar-value", 
        "#successfully_added_creature", resetAddCreature());
        updateCreatures(creatureObj);
    }
    )
}

function uploadBackgroundImage(backgroundObj) {
    
    $("#background_upload_bar .ui-progressbar-value").css("display", "block");

    var storageRef = firebase.storage().ref(uid + "/backgrounds/" + fileName);

    let task = storageRef.put(file);

    task.on("state_changed",
    
    function progress(snapshot) {
        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        $("#background_upload_bar .ui-progressbar-value").css("width", percentage + "%");
    },

    function error(err) {
        var dbDelIncBac = firebase.database().ref(uid + "/backgrounds/").child(backgroundObj);
        dbDelIncBac.remove();
        unsuccessfullyAdded("#background_upload_bar .ui-progressbar-value", 
        "#unsuccessfully_added_background_image", resetAddBackground());
    },

    function complete() {      
        successfullyAdded("#background_upload_bar .ui-progressbar-value", 
        "#successfully_added_background", resetAddBackground());
        updateBackgrounds(backgroundObj);
    }
    )
}

function updateAdventurers(adventurerObj) {
    var dbRefAdventurer = firebase.database().ref(uid + "/adventurers/").child(adventurerObj)            
    dbRefAdventurer.once("value")
        .then(function(snapshot) {
                let fileAdventurer = snapshot.child("file").val();
                if ($("#tabs-1 .character_container").length == 7) {
                    maxAdventurers();
                };
                
                var storage = firebase.storage();
                (storage.ref(uid + "/adventurers/" + fileAdventurer).getDownloadURL().then(function(url) {
                    let altAdventurer = snapshot.child("alt").val();
                    let nameAdventurer = snapshot.child("name").val();
                    let refAdventurer = snapshot.child("file").val().replace(/\.[^/.]+$/, "");

                    existingCharacterAlts.push(altAdventurer);
                    existingCharacterImgs.push(fileAdventurer);

                    let characterContainer = $('<div/>', {
                        class: "character_container",
                        id: refAdventurer + "_container"
                    }).insertBefore($("#new_adventurer"));
                    $('<img/>', {
                        alt: altAdventurer,
                        class: "sprite_image",
                        src: url
                    }).appendTo(characterContainer);
                    let pName = document.createElement("p");
                    pName.innerHTML = nameAdventurer;
                    characterContainer.append(pName);
                }));
            })
}

function updateCreatures(creatureObj) {
    var dbRefCreature = firebase.database().ref(uid + "/creatures/").child(creatureObj)            
    dbRefCreature.once("value")
        .then(function(snapshot) {
                let fileCreature = snapshot.child("file").val();
                if ($("#tabs-2 .character_container").length == 99) {
                    maxCreatures();
                };
                
                var storage = firebase.storage();
                (storage.ref(uid + "/creatures/" + fileCreature).getDownloadURL().then(function(url) {
                    let altCreature = snapshot.child("alt").val();
                    let nameCreature = snapshot.child("name").val();
                    let refCreature = snapshot.child("file").val().replace(/\.[^/.]+$/, "");
                    let sizeCreature = snapshot.child("size").val();

                    existingCharacterAlts.push(altCreature);
                    existingCharacterImgs.push(fileCreature);

                    let characterContainer;
                    if ($("#tabs-2 .character_container").length > 0) {
                        characterContainer = $('<div/>', {
                            class: "character_container",
                            id: refCreature + "_container"
                        }).insertBefore($("#tabs-2 .character_container")[0]);
                    }
                    else {
                        characterContainer = $('<div/>', {
                            class: "character_container",
                            id: refCreature + "_container"
                        }).appendTo("#tabs-2");
                    }
                    $('<img/>', {
                        alt: altCreature,
                        class: "sprite_image enemy " + sizeCreature,
                        src: url
                    }).appendTo(characterContainer);
                    let pName = document.createElement("p");
                    pName.innerHTML = nameCreature;
                    characterContainer.append(pName);
                }));
            })
}

function updateBackgrounds(backgroundObj) {
    var dbRefBackground = firebase.database().ref(uid + "/backgrounds/").child(backgroundObj)            
    dbRefBackground.once("value")
        .then(function(snapshot) {
                let fileBackground = snapshot.child("file").val();
                if ($("#tabs-3 .background_container").length == 99) {
                    maxBackgrounds();
                };
                
                var storage = firebase.storage();
                (storage.ref(uid + "/backgrounds/" + fileBackground).getDownloadURL().then(function(url) {
                    let altBackground = snapshot.child("alt").val();
                    let nameBackground = snapshot.child("name").val();
                    let refBackground = snapshot.child("file").val().replace(/\.[^/.]+$/, "");

                    let backgroundContainer;

                    if ($("#tabs-3 .background_container").length > 0) {
                        backgroundContainer = $('<div/>', {
                            class: "background_container",
                            id: refBackground + "_container"
                        }).insertBefore($("#tabs-3 .background_container")[0]);
                    }
                    else {
                        backgroundContainer = $('<div/>', {
                            class: "background_container",
                            id: refBackground + "_container"
                        }).appendTo("#tabs-3");
                    }
                    $('<img/>', {
                        alt: altBackground,
                        class: "background_image",
                        src: url
                    }).appendTo(backgroundContainer);
                    let pName = document.createElement("p");
                    pName.innerHTML = nameBackground;
                    backgroundContainer.append(pName);
                }));
            })
}