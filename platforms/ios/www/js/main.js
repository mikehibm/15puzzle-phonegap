/*
 * main.js
 */
 
var SCREEN_WIDTH    = 680;              // スクリーン幅
var SCREEN_HEIGHT   = 900;              // スクリーン高さ
var SCREEN_CENTER_X = SCREEN_WIDTH/2;   // スクリーン幅の半分
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;  // スクリーン高さの半分
var FONT_FAMILY_FLAT= "'Helvetica-Light' 'Meiryo' sans-serif";  // フラットデザイン用フォント
var BUTTON_DELAY = 100;
var MyApp = {};

// アセット
var ASSETS = {
    "bgm_title": "game_maoudamashii_7_rock54.mp3",
    "bgm_game": "game_maoudamashii_7_rock52.mp3",
    "se_move": "se_maoudamashii_se_finger01.mp3",
    "se_nomove": "se_maoudamashii_onepoint26.mp3",
    "stage_clear": "game_maoudamashii_9_jingle06.mp3",
};


//PhoneGapデバッガー内で実行した場合のみtmlib.js内のconsole.assert呼び出しでエラーになる問題の対策。
function fix_console_error(){
    if (!console.assert){
        console.assert = function(cond, msg){
            if (!cond) console.log(msg); 
        };
    }
}

function showActive(){
    this.setScale(1.1);
}
function showNormal(){
    this.setScale(1.0);
}


/*
 * main
 */
tm.main(function() {
    fix_console_error();
            
    MyApp = tm.app.CanvasApp("#world");       // 生成
    MyApp.resize(SCREEN_WIDTH, SCREEN_HEIGHT);    // サイズ(解像度)設定
    MyApp.fitWindow();                            // 自動フィッティング有効
    MyApp.background = "#eee";                    // 背景色
    
    // ローディング
    var loading = tm.app.LoadingScene({
        width: SCREEN_WIDTH,    // 幅
        height: SCREEN_HEIGHT,  // 高さ
        assets: ASSETS,         // アセット
        nextScene: TitleScene,  // ローディング完了後のシーン
    });
    MyApp.replaceScene( loading );    // シーン切り替え    
    //MyApp.replaceScene( TitleScene() );
    MyApp.run();
    
});

tm.define("TitleScene", {
    superClass: "tm.app.Scene",
 
    init: function() {
        this.superInit();
        var self = this; 
        
        //BGM再生を開始
        tm.asset.AssetManager.get("bgm_title").setVolume(0.5).setLoop(true).play();        

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
                    type: "FlatButton", name: "startEasy",
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
                    onpointingstart: showActive,
                    onpointingend: showNormal
                },            
                {   
                    type: "FlatButton", name: "startNormal",
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
                    onpointingstart: showActive,
                    onpointingend: showNormal
                },            
                {   
                    type: "FlatButton", name: "startHard",
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
                    onpointingstart: showActive,
                    onpointingend: showNormal
                },            
            ]
        });
                
        this.startLabel.tweener
            .fadeOut(500)
            .fadeIn(1000)
            .setLoop(true);
        
        this.startEasy.on("pointingend", function() {
            //BGM再生を停止
            tm.asset.AssetManager.get("bgm_title").stop();        

            this.tweener
                .to({"alpha":0, y:0, scaleX: 0.1, scaleY: 0.1}, 400, "easeInQuad")
                .call(function() {
                    self.app.replaceScene(GameScene({level:"easy", rows: 3, cols: 3, shuffleCount: 30}));
                });
        });
        this.startNormal.on("pointingend", function() {
            //BGM再生を停止
            tm.asset.AssetManager.get("bgm_title").stop();        

            this.tweener
                .to({"alpha":0, y:0, scaleX: 0.1, scaleY: 0.1}, 400, "easeInQuad")
                .call(function() {
                    self.app.replaceScene(GameScene({level:"normal", rows: 4, cols: 4, shuffleCount: 60}));
                });
        });
        this.startHard.on("pointingend", function() {
            //BGM再生を停止
            tm.asset.AssetManager.get("bgm_title").stop();        

            this.tweener
                .to({"alpha":0, y:0, scaleX: 0.1, scaleY: 0.1}, 400, "easeInQuad")
                .call(function() {
                    self.app.replaceScene(GameScene({level:"hard", rows: 5, cols: 5, shuffleCount: 80}));
                });
        });

    }
});

/*
 * ゲームシーン
 */
tm.define("GameScene", {
    superClass: "tm.app.Scene",
 
    init: function (options) {
        this.superInit();
        var self = this;
        
        MyApp.frame = 0;
        this.stage = Stage(options);
                
        //BGM再生を開始
        tm.asset.AssetManager.get("bgm_game").setVolume(0.5).setLoop(true).play();        
                
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
        var titleBtn = tm.app.FlatButton({
            width: 280,
            height: 90,
            text: "TITLE",
            bgColor: "#888",
        }).addChildTo(this);
        titleBtn.position.set(180, 820);
        titleBtn.on("pointingstart", showActive);
        titleBtn.on("pointingend", showNormal);
        titleBtn.on("pointingend", function() {
            //BGM再生を停止
            tm.asset.AssetManager.get("bgm_game").stop();        

            setTimeout(function(){
                self.app.replaceScene(TitleScene());
            }, BUTTON_DELAY);
        });
        
        // リスタートボタン
        var restartBtn = tm.app.FlatButton({
            width: 280,
            height: 90,
            text: "RESTART",
            bgColor: "#888",
            onpointingstart: showActive,
            onpointingend: showNormal
        }).addChildTo(this);
        restartBtn.position.set(500, 820);
        restartBtn.on("pointingstart", showActive);
        restartBtn.on("pointingend", showNormal);
        restartBtn.on("pointingend", function() {
            setTimeout(function(){
                self.app.replaceScene(GameScene(options));
            }, BUTTON_DELAY);
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
            tm.asset.AssetManager.get("se_move").clone().play();
            
            scene.updatePieces();
            if (stage.checkClear()){
                setTimeout(scene.onClear.bind(scene), 400);
            }
        } else {
            //動かせなかった時の効果音を再生
            tm.asset.AssetManager.get("se_nomove").clone().play();
        }
    },
    
    onClear: function(){
        //BGM再生を停止
        tm.asset.AssetManager.get("bgm_game").stop();        
        
        //クリアの効果音を再生
        tm.asset.AssetManager.get("stage_clear").clone().play();
        
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


/*
 * Stageクラス
 */
tm.define("Stage", {
    superClass: "tm.event.EventDispatcher",
 
    init: function(options) {
        this.superInit();
                
        this.level = options.level;
        this.rows = options.rows;
        this.cols = options.cols;
        this.shuffleCount = options.shuffleCount;
        this.pieceNum = options.rows * options.cols;
        this.pieces = [];

        var nums = [].range(1, this.pieceNum+1);  //連番を生成。
 
        //各ピースの配置を配列に格納。
        for (var i = 0; i < this.rows; ++i) {
            this.pieces[i] = [];
            
            for (var j = 0; j < this.cols; ++j) {
                var number = nums[ i * this.cols + j ];
                this.pieces[i][j] = number;
            }
        }        
    },
    
    getNumber: function(row, col){
        return this.pieces[row][col];
    },
    
    isBlank: function(row, col){
        return (this.pieces[row][col] == this.pieceNum);
    },
    
    locateBlank: function(){
        return this.locateNumber(this.pieceNum);
    },

    locateNumber: function(num){
        for (var i = 0; i < this.rows; ++i) {
            for (var j = 0; j < this.cols; ++j) {
                if (this.pieces[i][j] == num){
                    return { row: i, col: j };
                }
            }
        }        
    },
    
    swapPieces: function(num){
        console.log("swapPieces: ", num);
        
        var piecePos = this.locateNumber(num);
        var blankPos = this.locateBlank();
        if ((piecePos.col !== blankPos.col && piecePos.row !== blankPos.row)
            || (num === this.pieceNum)){
            return false;       //動かせないピースがタップされた時はfalseを返す。
        }
        
        var stop_flag = false;  //再帰呼び出しするかどうか。
        var dx = piecePos.col - blankPos.col;   //空白ピースまでのx距離。
        if (dx == 1 || dx == -1) stop_flag = true;  //空白ピースが隣なら再帰呼び出しをストップ。
        if (dx != 0) dx = dx / Math.abs(dx);
        var dy = piecePos.row - blankPos.row;   //空白ピースまでのy距離。
        if (dy == 1 || dy == -1) stop_flag = true;  //空白ピースが隣なら再帰呼び出しをストップ。
        if (dy != 0) dy = dy / Math.abs(dy);
        
        var next_row = blankPos.row + dy;
        var next_col = blankPos.col + dx;
        
        //空白ピースの隣のピースの番号を得る。
        var nextNum = this.getNumber(next_row, next_col);
        
        //空白ピースとその隣のピースを入れ替える。
        this.pieces[blankPos.row][blankPos.col] = nextNum;
        this.pieces[next_row][next_col] = this.pieceNum;
        
        //this.dumpPieces();
        
        //空白ピースまでまだ距離があれば再帰呼び出し。
        if (!stop_flag) this.swapPieces(num);
        
        return true;
    },
    
    shufflePieces: function(){
        for (var i = 0; i < this.shuffleCount; ++i){
            var blankPos = this.locateBlank();
            while(true){
                var dx = tm.util.Random.randint(0, this.cols-1) - blankPos.col;
                var dy = tm.util.Random.randint(0, this.rows-1) - blankPos.row;
                if ((dx != 0 || dy != 0) && (dx == 0 || dy == 0)) break;
            }
            
            var num = this.getNumber(blankPos.row + dy, blankPos.col + dx);
            this.swapPieces(num);
        }
    },
    
    checkClear: function(){
        var cnt = 1;
        for (var i = 0; i < this.rows; ++i) {
            for (var j = 0; j < this.cols; ++j) {
                var num = this.pieces[i][j];
                if (num != cnt) return false;
                cnt++;
            }
        }        
        return true;
    },
    
    dumpPieces: function(){
        for (var i = 0; i < this.rows; ++i) {
            var s = "";
            for (var j = 0; j < this.cols; ++j) {
                var num = this.pieces[i][j];
                if (num == this.pieceNum) num = " ";
                s = s + (" " + num).paddingLeft(3);
            }
            console.log(s);
        }        
    }
    
});


tm.define("ResultScene", {
    superClass: "tm.app.Scene",

    init: function(param) {
        this.superInit();
        var self = this;

        console.log("ResultScene: ", param);
        
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
                    type: "FlatButton", name: "backButton",
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
                
            console.log("Ranking: ", ranking);
                
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
        this.backButton.on("pointingstart", showActive);
        this.backButton.on("pointingend", showNormal);
        this.backButton.on("pointingend", function() {
            setTimeout(function(){
                self.app.replaceScene(TitleScene());
            }, BUTTON_DELAY);
        });
    },
});




















