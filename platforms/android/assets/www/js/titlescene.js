tm.define("TitleScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
        var self = this; 
        
        //BGM再生を開始
        app.changeBGM("bgm_title");

        var STARTBUTTONS_Y = 660;
        var STARTBUTTONS_W = 190;
        var STARTBUTTONS_H = 120;
        
        this.fromJSON({
            children: [
                {
                    type: "Label", name: "titleLabel",
                    text: "15 PUZZLE",
                    x: SCREEN_CENTER_X,
                    y: 200,
                    fillStyle: "#44f",
                    fontSize: 64,
                    fontFamily: FONT_FAMILY_FLAT,
                    align: "center",
                    baseline: "middle",
                },
                { 
                    type: "Label", name: "startLabel",
                    text: "CHOOSE A LEVEL TO START",
                    x: SCREEN_CENTER_X,
                    y: STARTBUTTONS_Y-90,
                    fillStyle: "#444",
                    fontSize: 28,
                    fontFamily: FONT_FAMILY_FLAT,
                    align: "center",
                    baseline: "middle",
                },
                {   
                    type: "MyFlatButton", name: "startEasy",
                    init: [
                        {
                            text: "Easy",
                            fontSize: 40,
                            fontFamily: FONT_FAMILY_FLAT,
                            bgColor: "#888",
                        }
                    ],
                    x: SCREEN_CENTER_X-STARTBUTTONS_W*1.1,
                    y: STARTBUTTONS_Y,
                    width: STARTBUTTONS_W,
                    height: STARTBUTTONS_H,
                },            
                {   
                    type: "MyFlatButton", name: "startNormal",
                    init: [
                        {
                            text: "Normal",
                            fontSize: 40,
                            fontFamily: FONT_FAMILY_FLAT,
                            bgColor: "#888",
                        }
                    ],
                    x: SCREEN_CENTER_X,
                    y: STARTBUTTONS_Y,
                    width: STARTBUTTONS_W,
                    height: STARTBUTTONS_H,
                },            
                {   
                    type: "MyFlatButton", name: "startHard",
                    init: [
                        {
                            text: "Hard",
                            fontSize: 40,
                            fontFamily: FONT_FAMILY_FLAT,
                            bgColor: "#888",
                        }
                    ],
                    x: SCREEN_CENTER_X+STARTBUTTONS_W*1.1,
                    y: STARTBUTTONS_Y,
                    width: STARTBUTTONS_W,
                    height: STARTBUTTONS_H,
                },            
            ]
        });
                
        this.startLabel.tweener
            .fadeOut(500)
            .fadeIn(1000)
            .setLoop(true);
        
        this.startEasy.on("tapped", function() {
            this.tweener
                .to({"alpha":0, y:0, scaleX: 0.1, scaleY: 0.1}, 400, "easeInQuad")
                .call(function() {
                    self.app.replaceScene(GameScene({level:"easy", rows: 3, cols: 3, shuffleCount: 30}));
                });
        });
        this.startNormal.on("tapped", function() {
            this.tweener
                .to({"alpha":0, y:0, scaleX: 0.1, scaleY: 0.1}, 400, "easeInQuad")
                .call(function() {
                    self.app.replaceScene(GameScene({level:"normal", rows: 4, cols: 4, shuffleCount: 60}));
                });
        });
        this.startHard.on("tapped", function() {
            this.tweener
                .to({"alpha":0, y:0, scaleX: 0.1, scaleY: 0.1}, 400, "easeInQuad")
                .call(function() {
                    self.app.replaceScene(GameScene({level:"hard", rows: 5, cols: 5, shuffleCount: 80}));
                });
        });

    }
});

