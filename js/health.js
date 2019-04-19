function isValidInput() {
    (function($) {
        $.fn.inputFilter = function(inputFilter) {
          return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
            if (inputFilter(this.value)) {
              this.oldValue = this.value;
              this.oldSelectionStart = this.selectionStart;
              this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
              this.value = this.oldValue;
              this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            }
          });
        };
    }(jQuery));

    $(".health_entry").inputFilter(function(value) {
        return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 999); 
    });

    $(".damage_entry").inputFilter(function(value) {
        return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 999); 
    });
}

function healthEntry() {
    let healthBar;
    let healthBarId;
    let totalHealth;
    let partialHealth;

    $( ".health_entry" ).change(function() {

        healthBar = $(this).parents(".health-bar");            

        if ($(this).hasClass("total_health")) {
            totalHealth = this.value;
            if (healthBar.attr("firsttotal") == "true") {
                previousPartialHealth = healthBar.attr("data-partialhealth");
                healthBar.attr("firsttotal", "false");
            }
            healthBar.attr("data-totalhealth", totalHealth);                
        }

        else if ($(this).hasClass("partial_health")) {
            partialHealth = this.value;
            if (healthBar.attr("firstpartial") == "true") {
                previousPartialHealth = healthBar.attr("data-totalhealth");
                healthBar.attr("firstpartial", "false");
            }
            else {
                previousPartialHealth = healthBar.attr("data-partialhealth");
            }
            healthBar.attr("data-partialhealth", partialHealth);                        
        }

        healthBarId = healthBar.attr("id");
        healthCalc(healthBarId);            
                    
    })
}

function healthCalc(hBI) {
    let totalHealthData = $("div#" + hBI + ".health-bar").attr("data-totalhealth");
    let partialHealthData = $("div#" + hBI + ".health-bar").attr("data-partialhealth");

    if (partialHealthData === "" || totalHealthData === "") {
        return 0;
    }

    let newHealth = partialHealthData / totalHealthData;

    if (newHealth > 1.0) {
        newHealth = 1.0;
    }

    if ((partialHealthData - previousPartialHealth) >= (totalHealthData * .5)) {
        $("audio#audio_largehealth")[0].play();
    }
    else if ((partialHealthData - previousPartialHealth) < (totalHealthData * .5)
    && (partialHealthData - previousPartialHealth) > 0) {
        $("audio#audio_smallhealth")[0].play();
    }
    else if ((partialHealthData - previousPartialHealth) < 0 && 
    Math.abs(partialHealthData - previousPartialHealth) >= (totalHealthData * .5)) {
        $("audio#audio_largedamage")[0].play();            
    }
    else if ((partialHealthData - previousPartialHealth) < 0 && 
    Math.abs(partialHealthData - previousPartialHealth) < (totalHealthData * .5)) {
        $("audio#audio_smalldamage")[0].play();            
    }

    let hBar = $("div#" + hBI + ".health-bar"),
    bar = hBar.find('.bar');           
    
    let barWidth = newHealth * 100;
    bar.css('width', barWidth + "%");
}