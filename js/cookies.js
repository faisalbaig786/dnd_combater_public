
function mainCookies() {
    var dndCookies = firebase.database().ref(uid + "/cookies/");
    var mobileWindow = window.matchMedia("(max-width: 1087px)");
    var desktopWindow = window.matchMedia("(min-width: 1088px)");

    // dndCookies.child("cookie_2_22_19").once("value").then(function(snapshot) {
    // var cookieInfoMessage = snapshot.val();
    //     if (cookieInfoMessage == "true") {
    //         return 0;
    //     }
    //     else {
    //         $("#info_message").show();            
    //         dndCookies.update ({
    //             "cookie_2_22_19" : "true"
    //         })
    //     }
    // });

    if (mobileWindow.matches) {
        dndCookies.child("cookie_mobile_danger").once("value").then(function(snapshot) {
        var cookieMobileDanger = snapshot.val();
            if (cookieMobileDanger == "true") {
                return 0;
            }
            else {
                $("#danger_mobile_device").show();            
                dndCookies.update ({
                    "cookie_mobile_danger" : "true"
                })
            }
        });
    }

    if (desktopWindow.matches) {
        dndCookies.child("cookie_intro").once("value").then(function(snapshot) {
        var cookieIntro = snapshot.val();
            if (cookieIntro == "true") {
                dndCookies.child("cookie_2_25_19").once("value").then(function(snapshot) {
                var cookieCustomBackground = snapshot.val();
                    if (cookieCustomBackground == "true") {
                        return 0;
                    }
                    else {
                        $("#combat_accordion").accordion("option","active", 0);
                        startCustomBackgrounds();
                        dndCookies.update ({
                            "cookie_2_25_19" : "true"
                        })
                    }
                })
            }
            else {
                $("#combat_accordion").accordion("option","active", 0);
                startIntro();
            }
        })
    }
}

function indexCookies(uid) {
    var dndCookies = firebase.database().ref(uid + "/cookies/");
    var mobileWindow = window.matchMedia("(max-width: 1087px)");

    dndCookies.child("cookie_verification_email").once("value").then(function(snapshot) {
    var cookieVerificationEmail = snapshot.val();
        if (cookieVerificationEmail == "true") {
            return 0;
        }
        else {
            firebase.auth().currentUser.sendEmailVerification();            
            dndCookies.update ({
                "cookie_verification_email" : "true"
            })
        }
    });

    // dndCookies.child("cookie_2_22_19").once("value").then(function(snapshot) {
    // var cookieInfoMessage = snapshot.val();
    //     if (cookieInfoMessage == "true") {
    //         return 0;
    //     }
    //     else {
    //         $("#info_message").show();            
    //         dndCookies.update ({
    //             "cookie_2_22_19" : "true"
    //         })
    //     }
    // });

    if (mobileWindow.matches) {
        dndCookies.child("cookie_mobile_warning").once("value").then(function(snapshot) {
        var cookieMobileWarning = snapshot.val();
            if (cookieMobileWarning == "true") {
                return 0;
            }
            else {
                $("#warning_mobile_device").show();            
                dndCookies.update ({
                    "cookie_mobile_warning" : "true"
                })
            }
        });
    }
}