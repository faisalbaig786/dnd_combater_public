var mainApp = {};
let signedIn;

(function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user && user.emailVerified) {
            uid = user.uid;
            signedIn = true;
        }
        else {            
            uid = null;
            window.location.replace("../index.html");
        }
    });
    
    function logOut() {
        firebase.auth().signOut();
    }

    mainApp.logOut = logOut;
    
})()

$( document ).ready(function() {

    $(".navbar-burger").click(function() {
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });

    var database = firebase.database();

    firebase.auth().onAuthStateChanged(function() {

        let spriteContainerId;
        let objectContainerId;
        let initialHealthCheck = 0;
        let previousPartialHealth;
        let characterForDeletion;
        // let spawnedCustomItem;

        var tabs1 = document.getElementById("tabs-1");    
        var tabs2 = document.getElementById("tabs-2");
        var tabs3 = document.getElementById("tabs-3");
        
        var dbRefAdventurers = firebase.database().ref().child(uid + "/adventurers/");
        var dbRefCreatures = firebase.database().ref().child(uid + "/creatures/");
        var dbRefBackgrounds = firebase.database().ref().child(uid + "/backgrounds/");

        $("#adventurer_upload").on("change", function(e) {
            file = e.target.files[0];
            fileName = file.name;
        });

        $("#creature_upload").on("change", function(e) {
            file = e.target.files[0];
            fileName = file.name;
        });

        $("#background_upload").on("change", function(e) {
            file = e.target.files[0];
            fileName = file.name;
        });

        var reads = [];

        // Downloading adventurers
        dbRefAdventurers.once("value")
            .then(function(snapshot) {                        
                snapshot.forEach(function(childSnapshot) {
                    let fileAdventurer = childSnapshot.child("file").val();
                    
                    var storage = firebase.storage();
                    reads.push(storage.ref(uid + "/adventurers/" + fileAdventurer).getDownloadURL().then(function(url) {
                        let altAdventurer = childSnapshot.child("alt").val();
                        let nameAdventurer = childSnapshot.child("name").val();
                        let refAdventurer = childSnapshot.child("file").val().replace(/\.[^/.]+$/, "");

                        existingCharacterAlts.push(altAdventurer);
                        existingCharacterImgs.push(fileAdventurer);

                        let characterContainer = $('<div/>', {
                            class: "character_container",
                            id: refAdventurer + "_container"
                        }).appendTo(tabs1);
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
            })

        // Downloading creatures
        dbRefCreatures.once("value")
            .then(function(snapshot) {                        
                snapshot.forEach(function(childSnapshot) {
                    let fileCreature = childSnapshot.child("file").val();
                    
                    var storage = firebase.storage();
                    reads.push(storage.ref(uid + "/creatures/" + fileCreature).getDownloadURL().then(function(url) {
                        let altCreature = childSnapshot.child("alt").val();
                        let nameCreature = childSnapshot.child("name").val();
                        // let refCreature = childSnapshot.child("file").val().replace(/\.[^/.]+$/, "");
                        let sizeCreature = childSnapshot.child("size").val();

                        existingCharacterAlts.push(altCreature);
                        existingCharacterImgs.push(fileCreature);

                        let characterContainer = $('<div/>', {
                            class: "character_container",
                            id: nameCreature + "_container"
                        }).appendTo(tabs2);
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
            });

        // Downloading backgrounds
        dbRefBackgrounds.once("value")
            .then(function(snapshot) {                        
                snapshot.forEach(function(childSnapshot) {
                    let fileBackground = childSnapshot.child("file").val();
                    
                    var storage = firebase.storage();
                    reads.push(storage.ref(uid + "/backgrounds/" + fileBackground).getDownloadURL().then(function(url) {
                        let altBackground = childSnapshot.child("alt").val();
                        let nameBackground = childSnapshot.child("name").val();
                        // let refBackground = childSnapshot.child("file").val().replace(/\.[^/.]+$/, "");

                        let backgroundContainer = $('<div/>', {
                            class: "background_container",
                            id: nameBackground + "_container"
                        }).appendTo(tabs3);
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
                Promise.all(reads).then(function() {
                    $("#loading-wrapper").fadeOut(300);
                    handleNewAdventurerButton();
                    handleAddCreatureButton();
                    handleAddBackgroundButton();
                    alphabetize($("#tabs-2"), $("#tabs-2 div"));
                    alphabetize($("#tabs-3"), $("#tabs-3 div"));
                    wireEventListeners();
                })
            });
    });


function wireEventListeners() {
    $( function() {
        $( "#tabs" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
        $( "#tabs" ).tabs({
            collapsible: true
          });
        $( "#tabs li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
        $( "#tabs li" ).click( function() {
            if ($("#ui-id-2").parents("li").hasClass("ui-state-active")) { 
                $("#search-creature").removeClass("hide");
            }
            else {
                $("#search-creature").addClass("hide");                
            }
            if ($("#ui-id-3").parents("li").hasClass("ui-state-active")) { 
                $("#search-background").removeClass("hide");
            }
            else {
                $("#search-background").addClass("hide");                
            }
        });
        $( function() {
            $( "#main_menu" ).menu();
        } );        

        $( ".widget input[type=submit], .widget a, .widget button" ).button();
        $( "#combat_arena" ).resizable();
        $( "#combat_accordion" ).accordion({
            collapsible: true,
            active: false
        });
        $( "#conditions_selector_accordion" ).accordion({
            collapsible: true,
            active: false,
            heightStyle: "content"
        });
        $( "#conditions_selector" ).controlgroup({
            "direction": "vertical",
        });
        conditionSelector();
        $( "#combat_toolbar input" ).checkboxradio({
            icon: false,
            disabled: true
        });
        $( "#clear_arena" ).button();
        $( "#turn_order" ).draggable();
        $( "#dnd_dice" ).draggable();        
        $( "#sortable_turn_order" ).sortable({
            axis: "x"
        });
        $( "input" ).tooltip();
        
        $( "#adventurer_upload_bar" ).progressbar({
            value: 0
        });
        $( "#creature_upload_bar" ).progressbar({
            value: 0
        });
        $( "#background_upload_bar" ).progressbar({
            value: 0
        });

        $("#night_mode").click(function(event) {
            $("body").toggleClass("night_mode_body");               
        });

        if (signedIn == true) {
            mainCookies();
        }

        $("#general_intro").click(function(event) {
            $("#combat_accordion").accordion("option","active", 0);
            startIntro();              
        });

        $("#custom_backgrounds_tutorial").click(function(event) {
            $("#combat_accordion").accordion("option","active", 0);
            startCustomBackgrounds();              
        });

        $("#clear_arena").click(function(event) {
            $("#combat_arena .spawned_sprite").remove();
            $("#sortable_turn_order li").remove();
            turnOrderArray.length = 0;
        });

        $("#hide_background").click(function(event) {
            $("canvas").fadeToggle();
            $('#move_background').prop('disabled', function(i, v) { return !v; });
            $("#move_background").prop("checked", false);            
            $("#combat_toolbar input").checkboxradio("refresh");
            moveBackground();
        });

        $("#move_background").click(function(event) {
            moveBackground();            
        });

        $("#hide_characters").click(function(event) {
            $("#combat_arena .spawned_sprite").fadeToggle();
        });

        $("#danger_mobile_device .delete").on("click", function() {
            $("#danger_mobile_device").remove();
        });

        $("#info_message .delete").on("click", function() {
            $("#info_message").remove();
        });

        let sourceBackground;
        let widthBackground;
        let heightBackground;
        let unmoved = true;
        let setBackground = false;
        var element = document.getElementById('combat_arena');
        new ResizeSensor(element, function() {
            widthBackground = element.clientWidth;
            heightBackground = element.clientHeight - 8;
            unmoved = false;
            if (setBackground) {
                receiveImage(sourceBackground, widthBackground, heightBackground);
            }
        });

        $("#tabs-3").on("click", ".background_image",function() {
            sourceBackground = $(this).prop("src");
            setBackground = true;
            handleBackgroundControls();
            if (unmoved) {
                widthBackground = 1323;
                heightBackground = 563.2;
            }
            receiveImage(sourceBackground, widthBackground, heightBackground);
        });

        $( "#new_adventurer" ).click(function( event ) {
            $( "#context_menu_add_adventurer" ).dialog({
                autoOpen: false,
                resizable: false,
                draggable: true,
                width: 450,
                minHeight: 150,
                title: "Add Adventurer",
                show: { effect: "", duration: 150 },
                position: { my: "center", at: "center", of: window },
                buttons: [
                    {
                        text: "Add",
                        icon: "ui-icon-circle-check",
                        click: function() {
                            addAdventurer(fileName);
                        }
                    }
                  ]
            });            
            $( "#context_menu_add_adventurer" ).dialog( "open" );
            $("#adventurer_form").removeClass("hide");
        });

        $( "#add_creature" ).click(function( event ) {
            $( "#context_menu_add_creature" ).dialog({
                autoOpen: false,
                resizable: false,
                draggable: true,
                width: 450,
                minHeight: 150,
                title: "Add Creature",
                show: { effect: "", duration: 150 },
                position: { my: "center", at: "center", of: window },
                buttons: [
                    {
                        text: "Add",
                        icon: "ui-icon-circle-check",
                        click: function() {
                            addCreature(fileName);
                        }
                    }
                  ]
            });            
            $( "#context_menu_add_creature" ).dialog( "open" );
            $("#creature_form").removeClass("hide");
        });

        $( "#add_background" ).click(function( event ) {
            $( "#context_menu_add_background" ).dialog({
                autoOpen: false,
                resizable: false,
                draggable: true,
                width: 450,
                minHeight: 150,
                title: "Add Background",
                show: { effect: "", duration: 150 },
                position: { my: "center", at: "center", of: window },
                buttons: [
                    {
                        text: "Add",
                        icon: "ui-icon-circle-check",
                        click: function() {
                            addBackground(fileName);
                        }
                    }
                  ]
            });            
            $( "#context_menu_add_background" ).dialog( "open" );
            $("#background_form").removeClass("hide");
        });

        let deleteAdventurerMenu = $("#context_menu_delete_adventurer").menu().hide();
        $("#tabs-1").on("contextmenu", ".character_container",function (event) {
            characterForDeletion = $(this);
            event.preventDefault();
            deleteAdventurerMenu.show().position({
                my: "center",
                at: "center",
                of: characterForDeletion
            });

            $( document ).one( "click", function() {
                deleteAdventurerMenu.hide();
            });
        });

        $("#delete_adventurer").click(function() {
            $( "#delete-adventurer-confirm" ).dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: {
                    "Delete adventurer": function() {
                        $( this ).dialog( "close" );
                        deleteAdventurer();
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                    }
                }
            });
            $("#delete-adventurer-confirm").removeClass("hide");
        });

        function deleteAdventurer() {
            let adventurerRef = characterForDeletion.attr("id").replace(/_container/g, "");
            var dbAdventurerRef = firebase.database().ref(uid + "/adventurers/").child(adventurerRef)
            .once("value").then(function(snapshot) {
                altDel = snapshot.val().alt;
                fileDel = snapshot.val().file;                
                var fileDelRef = firebase.storage().ref(uid + "/adventurers/").child(fileDel);
                fileDelRef.delete().then(function() {
                    var dbAdventurerDel = firebase.database().ref(uid + "/adventurers/").child(adventurerRef)
                    dbAdventurerDel.remove();
                    characterForDeletion.remove();
                    existingCharacterAlts.splice(existingCharacterAlts.indexOf(altDel), 1);
                    existingCharacterImgs.splice(existingCharacterImgs.indexOf(fileDel), 1);
                    notMaxAdventurers();
                }).catch(function(error) {
                    alert("Error Deleting Adventurer");
                });
            })
        }
        
        let deleteCreatureMenu = $("#context_menu_delete_creature").menu().hide();
        $("#tabs-2").on("contextmenu", ".character_container", function (event) {
            characterForDeletion = $(this);
            event.preventDefault();
            deleteCreatureMenu.show().position({
                my: "center",
                at: "center",
                of: characterForDeletion
            });

            $( document ).one( "click", function() {
                deleteCreatureMenu.hide();
            });
        });

        $("#delete_creature").click(function() {
            $( "#delete-creature-confirm" ).dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: {
                    "Delete creature": function() {
                        $( this ).dialog( "close" );
                        deleteCreature();
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                    }
                }
            });
            $("#delete-creature-confirm").removeClass("hide");
        });

        function deleteCreature() {
            let creatureRef = characterForDeletion.attr("id").replace(/_container/g, "");
            var dbCreatureRef = firebase.database().ref(uid + "/creatures/").child(creatureRef)
            .once("value").then(function(snapshot) {
                altDel = snapshot.val().alt;
                fileDel = snapshot.val().file;
                var fileDelRef = firebase.storage().ref(uid + "/creatures/").child(fileDel);
                fileDelRef.delete().then(function() {
                    var dbCreatureDel = firebase.database().ref(uid + "/creatures/").child(creatureRef)
                    dbCreatureDel.remove();
                    characterForDeletion.remove();
                    existingCharacterAlts.splice(existingCharacterAlts.indexOf(altDel), 1);
                    existingCharacterImgs.splice(existingCharacterImgs.indexOf(fileDel), 1);
                    notMaxCreatures();                    
                }).catch(function(error) {
                    alert("Error Deleting Creature");
                });
            })
        }

        let deleteBackgroundMenu = $("#context_menu_delete_background").menu().hide();
        $("#tabs-3").on("contextmenu", ".background_container", function (event) {
            characterForDeletion = $(this);
            event.preventDefault();
            deleteBackgroundMenu.show().position({
                my: "center",
                at: "center",
                of: characterForDeletion
            });

            $( document ).one( "click", function() {
                deleteBackgroundMenu.hide();
            });
        });

        $("#delete_background").click(function() {
            $( "#delete-background-confirm" ).dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: {
                    "Delete background": function() {
                        $( this ).dialog( "close" );
                        deleteBackground();
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                    }
                }
            });
            $("#delete-background-confirm").removeClass("hide");
        });

        function deleteBackground() {
            let backgroundRef = characterForDeletion.attr("id").replace(/_container/g, "");
            var dbBackgroundRef = firebase.database().ref(uid + "/backgrounds/").child(backgroundRef)
            .once("value").then(function(snapshot) {
                altDel = snapshot.val().alt;
                fileDel = snapshot.val().file;
                var fileDelRef = firebase.storage().ref(uid + "/backgrounds/").child(fileDel);
                fileDelRef.delete().then(function() {
                    var dbBackgroundDel = firebase.database().ref(uid + "/backgrounds/").child(backgroundRef)
                    dbBackgroundDel.remove();
                    characterForDeletion.remove();
                    notMaxBackgrounds();                    
                }).catch(function(error) {
                    alert("Error Deleting Background");
                });
            })
        }

        // $.widget( "custom.iconselectmenu", $.ui.selectmenu, {
        //     _renderItem: function( ul, item ) {
        //       var li = $( "<li>" ),
        //         wrapper = $( "<div>", { text: item.label } );
       
        //       if ( item.disabled ) {
        //         li.addClass( "ui-state-disabled" );
        //       }
       
        //       $( "<span>", {
        //         style: item.element.attr( "data-style" ),
        //         "class": "ui-icon " + item.element.attr( "data-class" )
        //       })
        //         .appendTo( wrapper );
       
        //       return li.append( wrapper ).appendTo( ul );
        //     }
        // });

        $( "#background_selector" ).selectmenu();

        $("#background_selector").on("selectmenuchange", function(event, ui) {
            $("#combat_arena").removeClass();                            
            if (ui.item.value == "none") {
                $("#combat_arena").addClass("black_grid");
            } 
            else {               
                $("#combat_arena").addClass(ui.item.value);
                if (!($("#combat_arena").hasClass("grass") || $("#combat_arena").hasClass("desert"))) {
                    $("#combat_arena").addClass("white_grid");                                         
                }
                else {
                    $("#combat_arena").addClass("black_grid");                     
                }
            }
            
        });
    
        $(".object_image").on("click", function() {
            let objectCopy = $(this).clone();
            if ($(this).hasClass("huge")) {
                objectCopy.addClass("XL");
                objectCopy.css("height", $(this).height() * 2);
                objectCopy.css("width", $(this).width() * 2);
            }
            else if ($(this).hasClass("gargantuan")) {
                objectCopy.addClass("XXL");
                objectCopy.css("height", $(this).height() * 4);
                objectCopy.css("width", $(this).width() * 4);
            }
            else if (!$(this).hasClass("large")) {
                objectCopy.css("height", $(this).height() / 2);
                objectCopy.css("width", $(this).width() / 2);
            }
            spawnObject(objectCopy);
        });
        
        $(".custom_container").on("click", function() {
            let customCopy = $(this).children("div").clone();
            spawnCustom(customCopy);
        });

        $("#tabs").on("click", ".sprite_image",function(event) {
            let spriteCopy = $(this).clone();

            if ($(this).hasClass("tiny")) {
                spriteCopy.css("height", $(this).height() / 4);
                spriteCopy.css("width", $(this).width() / 4);
            }
            else if ($(this).hasClass("small")) {
                spriteCopy.css("height", $(this).height() / 3);
                spriteCopy.css("width", $(this).width() / 3);
            }
            else if ($(this).hasClass("huge")) {
                spriteCopy.addClass("XL");
                spriteCopy.css("height", $(this).height() * 2);
                spriteCopy.css("width", $(this).width() * 2);
            }
            else if ($(this).hasClass("gargantuan")) {
                spriteCopy.addClass("XXL");
                spriteCopy.css("height", $(this).height() * 4);
                spriteCopy.css("width", $(this).width() * 4);
            }
            else if (!$(this).hasClass("large")) {
                spriteCopy.css("height", $(this).height() / 2);
                spriteCopy.css("width", $(this).width() / 2);
            }
            spriteCopy.css("border-radius", "30px");
            spriteCopy.css("border", "3px solid #90908f");
            
            if (($.inArray($(this).attr("alt"), turnOrderArray)) == -1) {
                turnOrder($(this));
                turnOrderArray.push($(this).attr("alt"));
            }
            spawnSprite(spriteCopy);
            $("#hide_characters").prop("checked", false);            
            $("#combat_toolbar input").checkboxradio("refresh");
            $("#combat_arena .spawned_sprite").fadeIn();            
        });
    });
    searchText("#search-creature", "#tabs-2 .character_container");
    searchText("#search-background", "#tabs-3 .background_container");
}
});