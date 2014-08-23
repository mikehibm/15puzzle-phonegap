/*
 * main.js
 */
 
var SCREEN_WIDTH    = 680;              // スクリーン幅
var SCREEN_HEIGHT   = 900;              // スクリーン高さ
var SCREEN_CENTER_X = SCREEN_WIDTH/2;   // スクリーン幅の半分
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;  // スクリーン高さの半分
var FONT_FAMILY_FLAT= "'Helvetica-Light' 'Meiryo' sans-serif";  // フラットデザイン用フォント
var app = window.app || {};

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


/*
 * main
 */
tm.main(function() {
    fix_console_error();
            
    app = tm.app.CanvasApp("#world");       // 生成
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);    // サイズ(解像度)設定
    app.fitWindow();                            // 自動フィッティング有効
    app.background = "#eee";                    // 背景色
    
    app.changeBGM = function(new_bgm){
        if (!tm.sound.WebAudio.isAvailable) return;
        
        if (app.cur_bgm !== new_bgm){
            if (app.cur_bgm){
                tm.asset.AssetManager.get(app.cur_bgm).stop();
            }
            
            if (new_bgm){
                var bgm = tm.asset.AssetManager.get(new_bgm);
                bgm.volume = 0.5;
                bgm.loop = true;
                bgm.play();        
            }
            
            app.cur_bgm = new_bgm;
        }
    };
    
    app.playSE = function(name){
        if (!tm.sound.WebAudio.isAvailable) return;
        tm.asset.AssetManager.get(name).clone().play();
    }
    
    if (tm.sound.WebAudio.isAvailable){
        // ローディング画面を表示
        var loading = tm.app.LoadingScene({
            width: SCREEN_WIDTH,    // 幅
            height: SCREEN_HEIGHT,  // 高さ
            bgColor: "#44f",
            assets: ASSETS,         // アセット
            nextScene: TitleScene,  // ローディング完了後のシーン
        });
        app.replaceScene( loading );   
    } else {
        app.replaceScene( TitleScene() );
    }
    app.run();
    
});
















