function startIntro() {
    introJs().setOptions({
        'exitOnEsc' : 'false',
        'exitOnOverlayClick' : 'false',
        'showStepNumbers' : 'false',
        'disableInteraction' : 'true',
        'overlayOpacity' : '.75',
        'steps' : [
            {
                element: "#dnd_combater_header",
                intro: "Hello there. Welcome to the <strong>D&amp;D Combater</strong>! I highly recommend this short &amp; sweet tutorial.",
                position: "bottom"
            },
            {
                element: "#new_adventurer",
                intro: "This thingamajig is for adding your adventurers.",
                position: "bottom"
            },
            {
                element: "#add_creature",
                intro: "This button is for adding your creatures.",
                position: "bottom"
            },
            {
                element: "#tabs",
                intro: "When you add a new adventurer or creature, it'll show up in its respective tab, <strong>ready to be spawned!</strong>",
                position: "bottom"
            },
            {
                element: "#combat_arena",
                intro: "Everyone spawns here in the arena &amp; can be moved around. <strong>Right clicking a character</strong> opens up its menu for stuff like status, conditions, &amp; elevation. The arena can be <strong>resized</strong> by dragging the edges.</strong>",
                position: "auto"
            },
            {
                element: "#initiative_dice_container",
                intro: "When you spawn characters, they'll <strong>automatically appear</strong> in the Initiative Tracker. Both the Tracker and Dice Roller can be <strong>moved anywhere</strong> on the page for ease of use.",
                position: "top"
            },
            {
                element: "#combat_accordion",
                intro: "The Combat Toolbar has an <strong>arena selector</strong> &amp; a button to clear everyone in the arena. It also has <strong>Custom Background</strong> controls. More on that in a separate tutorial.",
                position: "bottom"
            },
            {
                element: "#dnd_combater_container",
                intro: "A few closing notes before you get started:<br><ul><li>-Your adventurers &amp; creaturers are <strong>automatically saved</strong> in the database when you add them</li><li><strong>-Right clicking</Strong> one of them in the tab allows you to <strong>delete it</strong></li><li>-Status &amp; health changes have sounds so consider keeping your volume up</li></li><li>-Access other tutorials in the <strong>Main Menu</strong></li></ul><br>Enjoy!",
                position: "auto"
            }
        ]
    }).start();
    
    $(".introjs-skipbutton").on("click", function() {
        var dndCookies = firebase.database().ref(uid + "/cookies/");
        dndCookies.update ({
            "cookie_intro" : "true"
        })
    });
}

function startCustomBackgrounds() {
    introJs().setOptions({
        'exitOnEsc' : 'false',
        'exitOnOverlayClick' : 'false',
        'showStepNumbers' : 'false',
        'overlayOpacity' : '.75',
        'steps' : [
            {
                element: "#add_background",
                intro: "Hey there! Using your own backgrounds can add a whole new dimension of fun, complexity, and uniqueness to your adventures! This button is used to upload your custom backgrounds.",
                position: "bottom"
            },
            {
                element: "#ui-id-3",
                intro: "After adding your backgrounds, they can all be found in this tab. You just have to click on one for it to appear in the arena.",
                position: "bottom"
            },
            {
                element: "#combat_accordion",
                intro: "When you click on a custom background, it automatically enables the controls &amp; toggles <strong>Move Background</strong> mode in which you can move around your background <strong>but not your characters.</strong> Once you toggle it off by <strong>clicking Move Background</strong>, the characters can be moved but not the background. This prevents any unwanted movements.",
                position: "bottom"
            },
            {
                element: "#combat_arena",
                intro: "The background manipulation controls are as follows: <ul><li>-<strong>Drag</strong> your cursor to pan the background</li><li>-Use <strong>scroll</strong> or <strong>click</strong> to zoom in and out. <strong>Clicking while holding Shift</strong> can be used to zoom out</li></ul>",
                position: "auto"
            },
            {
                element: "#dnd_combater_container",
                intro: "Thanks for using the D&amp;D Combater.<br>Enjoy!",
                position: "auto"
            }
        ]
    }).start();
}