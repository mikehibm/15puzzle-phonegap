//
// Rankibng
//

tm.define("Ranking", {
    superClass: null,

    init: function() {
        //this.superInit();
    },
    
    submit: function(level, name, score, callback){
        var ranking = null;
        var str = "";
        var storage = window.localStorage;
        if (storage){
            str = storage.getItem(level);
            if (str) ranking = JSON.parse(str);
        } else { 
            console.log("No window.localStorage defined.");   
        }
        if (!ranking || !ranking.top10) ranking = { rank: 1, top10:[] };
        
        for (var i = 9; i >= 0; i--){
            var old_entry = ranking.top10[i];
            if (old_entry && (score > old_entry.score-0)){
                break;
            }
        }
        ranking.rank = i+2;

        if (ranking.rank <= 10){
            var index = ranking.rank - 1;
            ranking.top10.splice(index, 0, {name: name, score: score}); //index番目に追加して後の要素を後ろにずらす。
            if (ranking.top10.length > 10) ranking.top10.pop();         //最後の余分な要素を削除。
        }

        str = JSON.stringify(ranking);
        storage.setItem(level, str);
        
        if (callback){
            callback(ranking);
        }
    }
});











