/*
 * ゲームシーン
 */
tm.define("GameScene", {
    superClass: "tm.app.Scene",
 
    init: function (options) {
        this.superInit();
        var self = this;
        
        app.frame = 0;
        this.stage = Stage(options);
                
        //BGM再生を開始
        app.changeBGM("bgm_game");
                
        this.pieceWidth = (SCREEN_WIDTH*0.9) / options.cols;
        this.pieceHeight = (SCREEN_HEIGHT*0.66) / options.rows;
        this.pieceOffsetX = SCREEN_WIDTH*0.05;
        this.pieceOffsetY = SCREEN_HEIGHT*0.12; 
                
        // ピースグループ
        this.pieceGroup = tm.app.CanvasElement();
        this.addChild(this.pieceGroup);
 
        // ピースを作成
        for (var i = 0; i < this.stage.rows; ++i) {
            for (var j = 0; j < this.stage.cols; ++j) {
                var number = this.stage.pieces[i][j];
                var isBlank = (number == this.stage.pieceNum);
            
                var piece = Piece(number, isBlank, this.pieceWidth, this.pieceHeight, this.stage.rows)
                            .addChildTo(this.pieceGroup);
                piece.name = "P" + number;
                var pos = this.calcPiecePos(i, j);
                piece.x = pos.x;
                piece.y = pos.y;
            
                piece.on("touch", self.onTouchPiece);
            }
        }        
        
        // タイマーラベル
        this.timerLabel = tm.app.Label("").addChildTo(this);
        this.timerLabel
            .setPosition(650, 100)
            .setFillStyle("#999")
            .setAlign("right")
            .setBaseline("bottom")
            .setFontFamily(FONT_FAMILY_FLAT)
            .setFontSize(70);
 
        // タイトルボタン
        var titleBtn =MyFlatButton({
            width: 280,
            height: 90,
            text: "TITLE",
            bgColor: "#888",
        }).addChildTo(this);
        titleBtn.position.set(180, 820);
        titleBtn.on("tapped", function() {
            self.app.replaceScene(TitleScene());
        });
        
        // リスタートボタン
        var restartBtn = MyFlatButton({
            width: 280,
            height: 90,
            text: "RESTART",
            bgColor: "#888",
        }).addChildTo(this);
        restartBtn.position.set(500, 820);
        restartBtn.on("tapped", function() {
            self.app.replaceScene(GameScene(options));
        });
        
        this.startShuffle();
    },
    
    calcPiecePos: function(row, col){
        return { x: col * (this.pieceWidth) + this.pieceOffsetX + this.pieceWidth/2,
                 y: row * (this.pieceHeight) + this.pieceOffsetY + this.pieceHeight/2 };
    },
    
    onTouchPiece: function(e) {
        var scene = e.piece.getParent().getParent();
        var stage = scene.stage;
        
        e.moved = stage.swapPieces(e.number);
        if (e.moved){
            //動いた時の効果音を再生
            app.playSE("se_move");
            
            scene.updatePieces();
            if (stage.checkClear()){
                setTimeout(scene.onClear.bind(scene), 400);
            }
        } else {
            //動かせなかった時の効果音を再生
            app.playSE("se_nomove");
        }
    },
    
    onClear: function(){
        //BGM再生を停止
        app.changeBGM("");
        
        //クリアの効果音を再生
        app.playSE("stage_clear");
        
        this.app.replaceScene(ResultScene({level: this.stage.level, time: this.timerLabel.text}));
    },
    
    findPieceByNum: function(num){
        var piece = this.pieceGroup.getChildByName("P" + num);
        return piece;
    },
    
    update: function(app) {
        // タイマー更新
        var time = ((app.frame/app.fps) * 100)|0;
        var timeStr = time + "";
        this.timerLabel.text = (timeStr.substr(0, timeStr.length-2) || "0") + "." + timeStr.substr(timeStr.length-2, 2);
    },
    
    updatePieces: function(){
        var piece;
        for (var i = 0; i < this.stage.rows; ++i) {
            for (var j = 0; j < this.stage.cols; ++j) {
                var num = this.stage.getNumber(i, j);
                piece = this.findPieceByNum(num);
                var new_pos = this.calcPiecePos(i, j);
                if (piece.x != new_pos.x || piece.y != new_pos.y){
                    piece.tweener
                        .clear()
                        .to( { x: new_pos.x, y: new_pos.y, alpha:1 }, 280, "easeOutQuad" );
                }
            }
        }        
    },
    
    startShuffle: function(){
        this.stage.shufflePieces();
        this.updatePieces();
    }
    
});

