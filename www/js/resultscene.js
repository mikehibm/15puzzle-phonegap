tm.define("ResultScene", {
    superClass: "tm.app.Scene",

    init: function(param) {
        this.superInit();
        var self = this;

        var HIGHSCORE_Y = 270;
        var RANKING_Y = 360; 

        this.fromJSON({
            children: [
                {
                    type: "Label", name: "timeLabel",
                    x: SCREEN_CENTER_X,
                    y: 180,
                    fillStyle: "#00f",
                    fontSize: 98,
                    fontFamily: FONT_FAMILY_FLAT,
                    text: "",
                    align: "center",
                },
                {
                    type: "Label", name: "highScoreLabel",
                    x: SCREEN_WIDTH*2,
                    y: HIGHSCORE_Y,
                    fillStyle: "#f44",
                    fontSize: 72,
                    fontFamily: FONT_FAMILY_FLAT,
                    text: "NEW HIGH SCORE!!",
                    align: "center",
                },
                {   
                    type: "MyFlatButton", name: "backButton",
                    init: [{
                            text: "BACK",
                            bgColor: "#888",
                        }],
                    x: SCREEN_CENTER_X,
                    y: 700,
                },
            ]
        });

        this.timeLabel.text = param.time;
        this.highScoreLabel.visible = false;
                
        var ranking = Ranking();
        var name = "";
        var score = param.time -0;
        ranking.submit(param.level, name, score, function(ranking){
            var is_best = ranking.rank <= 1;
            self.highScoreLabel.visible = is_best;
            if (is_best){
                self.highScoreLabel.tweener
                    .move(SCREEN_WIDTH/2, HIGHSCORE_Y, 1000, "easeOutQuad")
                    .fadeOut(500)
                    .fadeIn(1000)
                    .move(SCREEN_WIDTH*-2, HIGHSCORE_Y, 1000, "easeInQuad")
                    .move(SCREEN_WIDTH*2, HIGHSCORE_Y, 1)
                    .setLoop(true);
            }
                
            for (var i = 0; i < 10; ++i){
            
                var lblNum = tm.app.Label((i+1) + ". ").addChildTo(self);
                lblNum.setPosition(SCREEN_CENTER_X - 180 + ((i / 5)|0) * 280, RANKING_Y + (i % 5)*50)
                    .setFillStyle("#666")
                    .setAlign("right")
                    .setBaseline("bottom")
                    .setFontFamily(FONT_FAMILY_FLAT)
                    .setFontSize(38);

                if (ranking.top10[i] && ranking.top10[i].score){
                    var score = Math.round(ranking.top10[i].score * 100) +"";
                    score = (score.substr(0, score.length-2) || "0") + "." + score.substr(score.length-2, 2);

                    var label = tm.app.Label(score).addChildTo(self);
                    label.setPosition(SCREEN_CENTER_X - 166 + ((i / 5)|0) * 280, RANKING_Y + (i % 5)*50)
                        .setFillStyle("#666")
                        .setAlign("left")
                        .setBaseline("bottom")
                        .setFontFamily(FONT_FAMILY_FLAT)
                        .setFontSize(38);
                }
            
                //Top 10に今回のスコアが入っている時は赤色で点滅表示。
                if (ranking.rank == i+1){
                    lblNum.setFillStyle("#f00");
                    lblNum.tweener.fadeOut(500).fadeIn(1000).setLoop(true);
                    label.setFillStyle("#f00");
                    label.tweener.fadeOut(500).fadeIn(1000).setLoop(true);
                }
            }
        });
                
                    
        // back ボタン
        this.backButton.on("tapped", function() {
            self.app.replaceScene(TitleScene());
        });
    },
});





