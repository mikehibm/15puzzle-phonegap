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
        if (localStorage){
            str = localStorage.getItem(level);
            if (str) ranking = JSON.parse(str);
        }
        if (!ranking) ranking = { rank: 1, top10:[] };
        
        console.log("data: ", ranking);
        
        for (var i = 9; i >= 0; i--){
            var old_entry = ranking.top10[i];
            if (old_entry && (score > old_entry.score-0)){
                ranking.rank = i+2;
                for (var j = 9; j > i+1; j--){
                    ranking.top10[j] = ranking.top10[j-1];
                }
                if (i+1 < 10) ranking.top10[i+1] = {name: name, score: score};
                break;
            }
        }
        if (i < 0) {
            ranking.rank = 1;
            for (var j = 9; j > 0; j--){
                ranking.top10[j] = ranking.top10[j-1];
            }
            ranking.top10[0] = {name: name, score: score};
        }

        str = JSON.stringify(ranking);
        localStorage.setItem(level, str);
        
        console.log("data after submit: ", ranking);

        if (callback){
            callback(ranking);
        }
    },
});











