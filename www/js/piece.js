/*
 * ピースクラス
 */
tm.define("Piece", {
    superClass: "tm.app.Shape",
 
    init: function(number, isBlank, w, h, rows) {
        this.superInit(w-3, h-3);
        // 数値をセット
        this.number = number;
        this.isBlank = isBlank;
 
        this.setInteractive(!isBlank);
        this.setBoundingType("rect");
 
        if (!isBlank){
            var angle = 240;//tm.util.Random.randint(0, 360);
            var brightness = ((rows - ((number) / rows) | 0) * 50 / rows) + 40;
            this.canvas.clearColor("hsl({0}, 70%, {1}%)".format(angle, brightness));
            
            this.label = tm.app.Label(number).addChildTo(this);
            this.label
                .setFontSize(70)
                .setFontFamily(FONT_FAMILY_FLAT)
                .setAlign("center")
                .setBaseline("middle");
        }
        
        this.on("pointingstart", function() {
            var e = {type: "touch", number: this.number, piece: this, moved: false};
            this.fire(e);
            console.log("e.moved=", e.moved);
            if (!e.moved){
                var scene = this.getParent().getParent();
                var cur_pos = scene.stage.locateNumber(this.number);
                var cur_x = scene.calcPiecePos(cur_pos.row, cur_pos.col).x;
                this.tweener
                    .clear()
                    .to({"alpha": 0.2, x: cur_x-10}, 120, "easeInQuad")
                    .to({"alpha": 1,   x: cur_x+10}, 120, "easeInQuad")
                    .to({x: cur_x}, 120, "easeInQuad");
            }
        });
    },
});


