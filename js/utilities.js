function searchText(searchBar, searchTab) {
    $(searchBar).keyup(function () {
    
        let searchTerm = $(searchBar).val();

        let searchSplit = searchTerm.replace(/ /g, "'):containsi('")

        $.extend($.expr[':'], {
            'containsi': function(elem, i, match, array)
            {
                return (elem.textContent || elem.innerText || '').toLowerCase()
                .indexOf((match[3] || "").toLowerCase()) >= 0;
            }
        });
        
        $(searchTab).not(":containsi('" + searchSplit + "')").each(function(e)   {
            $(this).addClass('hiding out').removeClass('in');
            $('.out').addClass('hidden');
        });
        
        $(searchTab + ":containsi('" + searchSplit + "')").each(function(e) {
            $(this).removeClass('hidden out').addClass('in');
            $('.in').removeClass('hiding');
        });
    
    });
}

function alphabetize(tabs, container) {
    let itemArray = [];         
    
    for (let contained of container) {
        itemArray.push(contained.cloneNode(true));
    }      
    itemArray.sort(function(a, b) {
        a = a.id;
        b = b.id;
        return (a < b) ? -1 : (a > b) ? 1 : 0;            
    });

    tabs.empty();
    for (let item of itemArray) {
        tabs.append(item);
    }
}

function resetAddAdventurer() {  
    $("#adventurer_add_name").val("");
    $("#adventurer_add_alt").val("");
    $("#adventurer_upload").val("");        
}

function resetAddCreature() {
    $("#creature_add_name").val("");
    $("#creature_add_alt").val("");
    $("#creature_upload").val("");        
}

function resetAddBackground() {
    $("#background_add_name").val("");
    $("#background_upload").val("");        
}

function topCharacter() {
    $(".spawned_sprite").mousedown(function() {
        $(".top_character").removeClass("top_character");
        $(this).addClass("top_character");
    });
}

function removeFromArray(array, el) {
    const index = array.indexOf(el);
  
    if (index !== -1) {
      array.splice(index, 1);
    }
}

function turnOrder(el) {
    let turnOrderImage = el.clone();
    turnOrderImage.css("height", el.height() / 2);
    turnOrderImage.css("width", el.width() / 2);
    $('<li/>', {
        id: el.attr("alt"),
        class: "ui-state-default",
    }).hide().appendTo("#sortable_turn_order").fadeIn(500).append(turnOrderImage);   
}

function handleNewAdventurerButton() {
    if ($("#tabs-1 .character_container").length == 8) {
        $("#new_adventurer").hide();
        $("#max_adventurers").appendTo("#tabs-1").show();
    }
    else {
        $("#max_adventurers").hide();                
        $("#new_adventurer").appendTo("#tabs-1").show();
    }
}

function handleAddCreatureButton() {
    if ($("#tabs-2 .character_container").length == 100) {
        $("#add_creature").prop("disabled", true).addClass("ui-state-disabled");
        $("#add_creature_tooltip").show();
        $("#add_creature_tooltip").tooltip({
            disable: false
        });      
    }
    else {
        $("#add_creature").prop("disabled", false);
        $("#add_creature_tooltip").hide();
        $("#add_creature_tooltip").tooltip({
            disable: true
        });           
    }
}

function handleAddBackgroundButton() {
    if ($("#tabs-3 .background_container").length == 100) {
        $("#add_background").prop("disabled", true).addClass("ui-state-disabled");
        $("#add_background_tooltip").show();
        $("#add_background_tooltip").tooltip({
            disable: false
        });      
    }
    else {
        $("#add_background").prop("disabled", false);
        $("#add_background_tooltip").hide();
        $("#add_background_tooltip").tooltip({
            disable: true
        });           
    }
}

function maxAdventurers() {
    $("#new_adventurer").hide();
    $("#max_adventurers").appendTo("#tabs-1").show();
    $( "#context_menu_add_adventurer" ).dialog( "close" );    
}

function notMaxAdventurers() {
    $("#max_adventurers").hide();                
    $("#new_adventurer").appendTo("#tabs-1").show();
}

function maxCreatures() {
    $("#add_creature").prop("disabled", true).addClass("ui-state-disabled");
    $("#add_creature_tooltip").show();
    $("#add_creature_tooltip").tooltip({
        disable: false
    });              
    $( "#context_menu_add_creature" ).dialog( "close" );    
}

function notMaxCreatures() {
    $("#add_creature").prop("disabled", false).removeClass("ui-state-disabled");
    $("#add_creature_tooltip").hide();
    $("#add_creature_tooltip").tooltip({
        disable: true
    });            
}

function maxBackgrounds() {
    $("#add_background").prop("disabled", true).addClass("ui-state-disabled");
    $("#add_background_tooltip").show();
    $("#add_background_tooltip").tooltip({
        disable: false
    });              
    $( "#context_menu_add_background" ).dialog( "close" );    
}

function notMaxBackgrounds() {
    $("#add_background").prop("disabled", false).removeClass("ui-state-disabled");
    $("#add_background_tooltip").hide();
    $("#add_background_tooltip").tooltip({
        disable: true
    });            
}

function successfullyAdded(uploadBar, successMessage, resetFunction) {
    $(uploadBar).css("width", "100%");
    $(uploadBar).css("display", "block");       
    $(successMessage).slideDown(500);
    setTimeout(function() {
        $(successMessage).slideUp(500);
        $(uploadBar).css("width", "0px");
        $(uploadBar).css("display", "none");        
        resetFunction;
    }, 2000);    
}

function unsuccessfullyAdded(uploadBar, failureMessage, resetFunction) {
    $(uploadBar).css("width", "100%");
    $(uploadBar).css("display", "block");       
    $(failureMessage).slideDown(500);
    setTimeout(function() {
        $(failureMessage).slideUp(500);
        $(uploadBar).css("width", "0px");
        $(uploadBar).css("display", "none");        
        resetFunction;
    }, 7000);    
}

function characterAddFail(failureMessage) {
    $(failureMessage).slideDown(500);    
    setTimeout(function() {
        $(failureMessage).slideUp(500);
    }, 7000);   
}

function handleBackgroundControls() {
    $( "#combat_toolbar input" ).checkboxradio({disabled: false});
    $("#hide_background").prop("checked", false);
    $("canvas").fadeIn();
    $("#move_background").prop("checked", true);
    $("#combat_toolbar input").checkboxradio("refresh");
    $("#combat_accordion").accordion("option","active", 0);
    moveBackground();
}

function moveBackground() {
    if ($("#move_background").prop("checked") == true) {
        $("canvas").css("pointer-events", "auto");
        $("#combat_arena .spawned_sprite").css("pointer-events", "none");
    }
    else {
        $("canvas").css("pointer-events", "none");
        $("#combat_arena .spawned_sprite").css("pointer-events", "auto");
    }
}