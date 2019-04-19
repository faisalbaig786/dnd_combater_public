var mainApp = {};

(function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            uid = user.uid;
            $("#auth_management").show();
            $("#noauth_management").hide();            
        }
        else {            
            uid = null;
            $("#log_out").hide();            
            $("#noauth_management").show();
            $("#auth_management").hide();     
        }
        $("#white-fade-in").fadeOut(200);
    });
    
    function logOut() {
        firebase.auth().signOut();
    }

    mainApp.logOut = logOut;
    
})()

function toggleDeleteAdventurersMessage() {
    $("#delete_adventurers_message").slideToggle();
}

function toggleDeleteCreaturesMessage() {
    $("#delete_creatures_message").slideToggle();
}

function toggleDeleteBackgroundsMessage() {
    $("#delete_backgrounds_message").slideToggle();
}

function toggleDeleteAccountMessage() {
    $("#delete_account_message").slideToggle();
}

$( document ).ready(function() {

    $(".navbar-burger").click(function() {
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");
    });

    $("#recovery_email_button").on("click", function() {
        validate("#recovery_email", passwordReset);
    });

    $("#password_change_button").on("click", function() {
        passwordChange();
    });

    $("#delete_adventurers_button").on("click", function() {
        deleteAllAdventurers();
    });

    $("#delete_creatures_button").on("click", function() {
        deleteAllCreatures();
    });

    $("#delete_backgrounds_button").on("click", function() {
        deleteAllBackgrounds();
    });

    $("#delete_account_button").on("click", function() {
        deleteAllAdventurers();
        deleteAllCreatures();
        deleteAllBackgrounds();
        deleteAccount();
    });

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    
    function validate(emailType, functionToDo) {
        $("#invalid_email").hide();
        $("#recovery_email_sent").hide();
        $("#email_nonexistent").hide();                                         
        $("#recovery_email").removeClass("is-danger");
        var email = $(emailType).val();

        if (validateEmail(email)) {
            functionToDo(email);
        } else {
            $("#invalid_email").show();         
            $("#recovery_email").addClass("is-danger");    
        }
        return false;
    }

    function passwordReset(emailAddress) {
        var auth = firebase.auth();
        
        auth.sendPasswordResetEmail(emailAddress).then(function() {
            $("#recovery_email_sent").show();                     
        }).catch(function(error) {
            $("#email_nonexistent").show();
            $("#recovery_email").addClass("is-danger");                
        });
    }

    function passwordChange() {
        $("#invalid_credential").hide();
        $("#invalid_confirmation").hide();
        $("#invalid_password_complexity").hide();
        $("#password_changed").hide();        
        $("#account_email").removeClass("is-danger");
        $("#current_password").removeClass("is-danger");  
        $("#new_password").removeClass("is-danger");
        $("#confirm_new_password").removeClass("is-danger");                         
        var user = firebase.auth().currentUser;

        var credential = firebase.auth.EmailAuthProvider.credential(
            $("#account_email").val(),
            $("#current_password").val()
        );
        
        user.reauthenticateAndRetrieveDataWithCredential(credential).then(function() {
            if ($("#new_password").val() === $("#confirm_new_password").val()) {
                var user = firebase.auth().currentUser;
                var newPassword = $("#new_password").val();
                
                user.updatePassword(newPassword).then(function() {
                    $("#password_changed").show();
                    $("#account_email").val("");
                    $("#current_password").val("");
                    $("#new_password").val("");
                    $("#confirm_new_password").val("");
                }).catch(function(error) {
                    $("#invalid_password_complexity").show();
                    $("#new_password").addClass("is-danger");
                    $("#confirm_new_password").addClass("is-danger"); 
                });
            }
            else {
                $("#invalid_confirmation").show();
                $("#new_password").addClass("is-danger");
                $("#confirm_new_password").addClass("is-danger");                                            
            }
        }).catch(function(error) {
            $("#invalid_credential").show();
            $("#account_email").addClass("is-danger");
            $("#current_password").addClass("is-danger");                             
        });
    }

    function deleteAllAdventurers() {
        var reads = [];
        var databaseRefAdventurers = firebase.database().ref(uid + "/adventurers");

        databaseRefAdventurers.once("value")
        .then(function(snapshot) {                        
            snapshot.forEach(function(childSnapshot) {
                let fileAdventurer = childSnapshot.child("file").val();
                
                var storage = firebase.storage();
                reads.push(storage.ref(uid + "/adventurers/" + fileAdventurer).delete());
            })
            Promise.all(reads).then(function() {
                databaseRefAdventurers.remove()
                $("#all_adventurers_deleted").show();
            })
        });
    }

    function deleteAllCreatures() {
        var reads = [];
        var databaseRefCreatures = firebase.database().ref(uid + "/creatures");

        databaseRefCreatures.once("value")
        .then(function(snapshot) {                        
            snapshot.forEach(function(childSnapshot) {
                let fileCreature = childSnapshot.child("file").val();
                
                var storage = firebase.storage();
                reads.push(storage.ref(uid + "/creatures/" + fileCreature).delete());
            })
            Promise.all(reads).then(function() {
                databaseRefCreatures.remove()
                $("#all_creatures_deleted").show();
            })
        });
    }

    function deleteAllBackgrounds() {
        var reads = [];
        var databaseRefBackgrounds = firebase.database().ref(uid + "/backgrounds");

        databaseRefBackgrounds.once("value")
        .then(function(snapshot) {                        
            snapshot.forEach(function(childSnapshot) {
                let fileBackground = childSnapshot.child("file").val();
                
                var storage = firebase.storage();
                reads.push(storage.ref(uid + "/backgrounds/" + fileBackground).delete());
            })
            Promise.all(reads).then(function() {
                databaseRefBackgrounds.remove()
                $("#all_backgrounds_deleted").show();
            })
        });
    }

    function deleteAccount() {
        $("#invalid_credential_deletion").hide();                    
        var user = firebase.auth().currentUser;

        var credential = firebase.auth.EmailAuthProvider.credential(
            $("#email_account_deletion").val(),
            $("#password_account_deletion").val()
        );
        
        user.reauthenticateAndRetrieveDataWithCredential(credential).then(function() {    
            user.delete().then(function() {
                firebase.database().ref(uid).remove();        
                $("#account_deleted").show();
            }).catch(function(error) {
                console.log("Failed to delete account.");
            });
        }).catch(function(error) {
            $("#invalid_credential_deletion").show();            
        });
    }
});