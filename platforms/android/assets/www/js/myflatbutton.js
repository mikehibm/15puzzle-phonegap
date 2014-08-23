(function() {
    
    var BUTTON_DELAY = 100;

    tm.define("MyFlatButton", {
        superClass: tm.ui.FlatButton,

        init: function(param) {
            this.superInit(param);

            this.on("pointingstart", function(){
                console.log("pointingstart");
                this.setScale(1.1);
            });
            this.on("pointingend", function(){
                this.setScale(1.0);
                
                setTimeout(function(){
                    this.flare("tapped");
                }.bind(this), BUTTON_DELAY);
            });

        },
        
    });



})();


