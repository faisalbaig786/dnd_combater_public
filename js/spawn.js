let nthSpawn = 0;
let turnOrderImagesLength;
let turnOrderArray = [];
let spawnedSprite;
let elevationSprite;

function spawnSprite(el) {
    $('<div/>', {
        id: "image_container_" + nthSpawn,
        class: "spawned_sprite",
    }).hide().appendTo("#combat_arena").fadeIn(500);
    let spawnedSprite = $("#image_container_" + nthSpawn);
    spawnedSprite.append(el);
    spawnedSprite.css("height", el.height());
    if (spawnedSprite.children("img").hasClass("enemy")) {
        if (spawnedSprite.children("img").hasClass("large") || 
        spawnedSprite.children("img").hasClass("huge") ||
        spawnedSprite.children("img").hasClass("gargantuan")) {
            spawnedSprite.addClass("bigger_enemy");
        }
        spawnedSprite.append("<div class='damage-bar' data-totaldamage=''><div class='bar'><div class='damage_container'><span>Damage:</span><input type='text' name='Damage' value='' class='damage_entry' required></div><div class='hit'></div></div></div>");
        spawnedSprite.children(".damage-bar").attr("id", "enemy_bar_" + nthSpawn);
    }
    else {
        spawnedSprite.append("<div class='health-bar' data-totalhealth='' data-partialhealth='' firsttotal='true' firstpartial='true'><div class='bar'><input type='text' name='Partial Health' value='' class='health_entry partial_health' required><div class='health_slash'>&#47;</div><input type='text' name='Total Health' value='' class='health_entry total_health' required><div class='hit'></div></div></div>");
        spawnedSprite.children(".health-bar").attr("id", "character_bar_" + nthSpawn);
    }
    spawnedSprite.append("<div class='condition_elevation_container' data-conditions=''><input class='elevation_badge hide' disabled></div>")
    // spawnedSprite.append("<input class='condition_badge hide' data-condition='None' disabled><input class='elevation_badge hide' disabled>")
    
    spawnedSprite.draggable({
        containment: $("#combat_arena"),
        start: function() {
            spawnedSprite.children(".sprite_image").addClass("picked_up");
        },
        stop: function() {
            spawnedSprite.children(".sprite_image").removeClass("picked_up");                  
        }                
    });
    nthSpawn++;

    isValidInput();

    healthEntry();

    topCharacter();

    $( ".spawned_sprite" ).contextmenu( contextMenuSprite() );
}

function spawnObject(el) {
    $('<div/>', {
        id: "image_container_" + nthSpawn,
        class: "spawned_object",
    }).hide().appendTo("#combat_arena").fadeIn(500);
    let spawnedObject = $("#image_container_" + nthSpawn);
    spawnedObject.append(el);
    spawnedObject.draggable({
        containment: $("#combat_arena")    
    });
    nthSpawn++;

    $( ".spawned_object" ).contextmenu( contextMenuObject() );
}

// function spawnCustom(el) {
//     let spawnedCustom = $('<div/>', {
//         class: "spawned_custom",
//     }).hide().appendTo("#combat_arena").fadeIn(500);
//     spawnedCustom.append(el);
//     spawnedCustom.draggable({
//         containment: $("#combat_arena")    
//     });

//     $( ".spawned_custom" ).contextmenu( contextMenuCustom() );
// }

function contextMenuSprite() {
    $("#combat_arena").on("contextmenu", ".spawned_sprite",function (event) {
        spawnedSprite = $(this);
        elevationSprite = spawnedSprite.children("div").children(".elevation_badge");  
        let statusSprite = $(this).children("img");
        event.preventDefault();
        spriteContainerId = $(this).attr("id");
        let contextMenuTitle = $(this).children("img").attr("alt");
        $( "#context_menu_sprite" ).dialog({
            autoOpen: false,
            resizable: false,
            draggable: true,
            width: 291,
            minHeight: 150,
            title: contextMenuTitle,
            show: { effect: "", duration: 150 },
            position: { my: "center", at: "center", of: event },
            buttons: [
                {
                    text: "Delete",
                    icon: "ui-icon-trash",
                    click: function() {
                        deleteSprite();
                    }
                }
              ]
        });
        $( "#context_menu_sprite" ).dialog( "open" );     

        if (statusSprite.hasClass("dead")) {
            $("#status_selector").val("Dead");
        }
        else if (statusSprite.hasClass("unconscious")) {
            $("#status_selector").val("Unconscious");                                            
        }
        else if (statusSprite.hasClass("ontheedge")) {
            $("#status_selector").val("On the Edge");                                            
        }
        else {
            $("#status_selector").val("Alive");
        }

        $( "#status_selector" ).selectmenu({
            change: function( event, ui ) {
                let sound;                                                                        
                if (ui.item.value == "Alive") {
                    statusSprite.removeClass("dead unconscious ontheedge");
                    statusSprite.addClass("alive");
                    sound = new Audio("../audio/alive.mp3");                                                                
                }
                else if (ui.item.value == "Dead") {
                    statusSprite.removeClass("alive unconscious ontheedge");
                    statusSprite.addClass("dead");
                    sound = new Audio("../audio/dead.mp3");                                            
                }
                else if (ui.item.value == "Unconscious") {
                    statusSprite.removeClass("alive dead ontheedge");
                    statusSprite.addClass("unconscious");
                    sound = new Audio("../audio/unconscious.mp3");                            
                }
                else if (ui.item.value == "On the Edge") {
                    statusSprite.removeClass("alive dead unconscious");                            
                    statusSprite.addClass("ontheedge");
                    sound = new Audio("../audio/ontheedge.mp3");
                }
                sound.preload = 'auto';
                sound.load();
                sound.cloneNode();
                sound.play();    
                $( "#context_menu_sprite" ).dialog( "close" );            
            }
        });
        $("#status").removeClass("hide");

        // let conditionSprite = $(this).children(".condition_badge");
        // $("#condition_selector").val(conditionSprite.attr("data-condition"));

        // $( "#condition_selector" ).selectmenu({
        //     change: function( event, ui ) {
        //         let conditionName = ui.item.value;
        //         conditionSprite.attr("data-condition", conditionName);
        //         if (conditionName == "None") {
        //             conditionSprite.addClass("hide");
        //         }
        //         else {
        //             let conditionShort = conditionName.slice(0,3);
        //             conditionSprite.val(conditionShort);
        //             conditionSprite.removeClass("hide");
        //         }
        //         $( "#context_menu_sprite" ).dialog( "close" );                                    
        //     }
        // });
        // $("#condition").removeClass("hide");
              
        $( "#elevation_slider" ).slider({
            value:0,
            min: 0,
            max: 250,
            step: 5,
            slide: function( event, ui ) {
                let elevationAmount = ui.value;
                $( "#elevation_amount" ).val( elevationAmount + "ft" );                        
                if (ui.value == 0) {
                    elevationSprite.addClass("hide");
                }
                else {
                    elevationSprite.val(elevationAmount);
                    elevationSprite.removeClass("hide");                        
                }
            }
          });
          $( "#elevation_amount" ).val( $( "#elevation_slider" ).slider( "value" ) + "ft" );
          $("#elevation").removeClass("hide");
          $("#conditions_selector").removeClass("hide");          
    });
}

function conditionSelector() {

    $(document).on("click", function(e) {
        if(!$(e.target).hasClass("ui-accordion-header") && 
        !$(e.target).hasClass("ui-accordion-header-icon")) {
            $("#conditions_selector_accordion").accordion("option","active", false); 
        }       
    });

    $("#context_menu_sprite").on("click", "#ui-id-5", function(event) {
        let conditionsList = spawnedSprite.children(".condition_elevation_container").data("conditions").split(" ");
        $("#conditions_selector input").prop("checked", false);
        for (condition of conditionsList) {
            $("input[id='" + condition + "']").prop("checked", true);
        }
        $("#conditions_selector").controlgroup("refresh");        
    });

    $("#conditions_selector_accordion").on("change", "#conditions_selector input", function(event) {      
        let conditionLabel = $(this).prev();
        let conditionName = $(this).attr("id");
        if (conditionLabel.hasClass("ui-checkboxradio-checked")) {
            let conditionBadge = 
            $('<input/>', {
                class: "condition_badge " + conditionName
            }).hide().insertBefore(elevationSprite).fadeIn(500);
            conditionBadge.attr("disabled", true);
            let conditionContainer = conditionBadge.parent();
            let conditions = conditionContainer.data("conditions");
            conditions += " " + conditionName;
            conditionContainer.data("conditions", conditions);
            let conditionShort = conditionName.slice(0,3);
            conditionBadge.val(conditionShort);
            $("#conditions_selector_accordion").accordion("option","active", false);
        }
        else {
            let conditionBadge = spawnedSprite.find("." + conditionName);
            let conditionContainer = conditionBadge.parent();
            let conditions = conditionContainer.data("conditions").toString();
            let updatedConditions = conditions.replace(conditionName, "");            
            conditionContainer.data("conditions", updatedConditions);
            conditionBadge.remove();
        }
        $( "#context_menu_sprite" ).dialog( "close" );                    
    });    
}

function contextMenuObject() {
    $(".spawned_object").on("contextmenu", function (event) {
        event.preventDefault();
        let spawnedObject = $(this);
        objectContainerId = spawnedObject.attr("id");
        let contextMenuTitle = spawnedObject.children("img").attr("alt");
        $( "#context_menu_object" ).dialog({
            autoOpen: false,
            resizable: false,
            draggable: false,
            width: 340,
            minHeight: 100,
            title: contextMenuTitle,
            show: { effect: "", duration: 150 },
            position: { my: "center", at: "center", of: event },
            buttons: [
                {
                    text: "Delete",
                    icon: "ui-icon-trash",
                    click: function() {
                        deleteObject();
                    }
                }
              ]
        });
        $( "#context_menu_object" ).dialog( "open" );
    });
}

// function contextMenuCustom() {
//     $(".spawned_custom").on("contextmenu", function (event) {
//         event.preventDefault();
//         spawnedCustomItem = $(this).children("div");
//         // let contextMenuTitle = spawnedObject.children("img").attr("alt");
//         $( "#context_menu_custom" ).dialog({
//             autoOpen: false,
//             resizable: false,
//             draggable: true,
//             width: 355,
//             minHeight: 100,
//             // title: contextMenuTitle,
//             show: { effect: "", duration: 150 },
//             position: { my: "center", at: "right+200", of: spawnedCustomItem },
//             buttons: [
//                 {
//                     text: "Delete",
//                     icon: "ui-icon-trash",
//                     click: function() {
//                         deleteObject();
//                     }
//                 }
//               ]
//         });
//         $( "#context_menu_custom" ).dialog( "open" );
//         $("#context_menu_custom").removeClass("hide");                
//     });
// }

function deleteSprite() {
    let turnOrderId = document.getElementById(spriteContainerId).children[0].alt;
    document.getElementById(spriteContainerId).remove();
    $( "#context_menu_sprite" ).dialog( "close" );   

    let turnOrderImages = $("img[alt='" + turnOrderId.replace(/'/g, "\\'") + "']");
    turnOrderImagesLength = turnOrderImages.length;

    if (turnOrderImagesLength <= 2) {
        removeFromArray(turnOrderArray, turnOrderId);
        document.getElementById(turnOrderId).remove();
    }
}

function deleteObject() {
    document.getElementById(objectContainerId).remove();
    $( "#context_menu_object" ).dialog( "close" );
}