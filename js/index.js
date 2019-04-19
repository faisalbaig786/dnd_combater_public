(function() {
    var ui = new firebaseui.auth.AuthUI(firebase.auth());    
    var uiConfig = {
        callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            return true;
        },
        uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        'credentialHelper': firebaseui.auth.CredentialHelper.NONE,
        signInSuccessUrl: 'html/main.html',
        signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        // Terms of service url.
        tosUrl: 'html/terms.html',
        // Privacy policy url.
        privacyPolicyUrl: 'html/privacy.html'
    };

    ui.start('#firebaseui-auth-container', uiConfig);

})()

var mainApp = {};

(function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user && user.emailVerified) {
            let uid = user.uid;
            indexCookies(uid);
            $("#go_to_combater").show();            
            $("#firebaseui-auth-container").hide();
            $("#verify_email").hide();                 
        }
        else if (user) {
            let uid = user.uid;
            let uemail = user.email;
            indexCookies(uid);
            $("#user_email").text(uemail);
            $("#firebaseui-auth-container").hide();                        
            $("#go_to_combater").hide();
            
            const setIntervalAsync = (fn, ms) => {
                fn().then(() => {
                    setTimeout(() => setIntervalAsync(fn, ms), ms);
                });
            };
            
            const delayReport = deplayMs => new Promise((resolve) => {
                setTimeout(resolve, deplayMs);
            });
            
            setIntervalAsync(async () => {
                user.reload();
                    if (user.emailVerified) {
                        location.reload();
                    }; 
                await delayReport(500); 
            }, 500);
        }
        else {            
            uid = null;
            $("#log_out").hide();
            $("#sign_in_required").show();
            $("#firebaseui-auth-container").show();                        
            $("#go_to_combater").hide();
            $("#verify_email").hide();     
        }
        $("#white-fade-in").fadeOut(200);
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

    $("#learn_more").on("click", function() {
        $('html, body').animate({
            scrollTop: $("#main_container").offset().top
        }, 1000);
    })

    $("#scroll_top").on("click", function() {
        $('html, body').animate({
            scrollTop: 0
        }, 1000);
    })

    $("#warning_mobile_device .delete").on("click", function() {
        $("#warning_mobile_device").remove();
    })

    $("#info_message .delete").on("click", function() {
        $("#info_message").remove();
    });

    $(".slick-mobile").slick({
        infinite: true,
        slidesToShow: 2,
        dots: true,
        mobileFirst: true
    });
    
    $("#send_another_email").on("click", function() {
        $("#verification_email_sent").hide();
        $("#invalid_verification_email").hide();
        $("#new_verification_email_sent").hide();
        $("#invalid_new_email").hide();                            
                    
        firebase.auth().currentUser.sendEmailVerification()
        .then(function() {
            $("#verification_email_sent").show();            
        })
        .catch(function(error) {
            $("#invalid_verification_email").show();
        });
    })

    $("#send_to_correct_email").on("click", function() {
        var user = firebase.auth().currentUser;
        $("#verification_email_sent").hide();
        $("#invalid_verification_email").hide();
        $("#new_verification_email_sent").hide();
        $("#invalid_new_email").hide();
        
        user.updateEmail($("#correct_email").val()).then(function() {
            user.sendEmailVerification()
                .then(function() {
                    $("#new_verification_email_sent").show();
                })
                .catch(function(error) {
                    $("#invalid_new_email").show();                    
                });
        }).catch(function(error) {
            $("#invalid_new_email").show();                                
        });
    })
});