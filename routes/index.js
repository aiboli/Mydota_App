var express = require('express');
var Dota2Api = require('dota2api');
var dota = new Dota2Api("21FA57310D598952DD2CCF556E6B4B78");
var async = require('async');

var router = express.Router();
var match = [];

function dotaget(match_details_Id, callback) {
      dota.getMatchDetails(match_details_Id, function(err, res){
          callback(err, res);
      });
}

function getItem(matches, id) {
  var map = new Map();
  var arr = [];
  for (var i = 0; i < matches.length/2; i++) {
    for (var j = 0; j < matches[i].players.length; j++) {
      if (matches[i].players[j].account_id == id) {
        //0
        if(map.get(matches[i].players[j].item_0)) {
          map.set(matches[i].players[j].item_0, map.get(matches[i].players[j].item_0) + 1);
        }else {
          map.set(matches[i].players[j].item_0, 1);
        }
        //1
        if(map.get(matches[i].players[j].item_1)) {
          map.set(matches[i].players[j].item_1, map.get(matches[i].players[j].item_1) + 1);
        }else {
          map.set(matches[i].players[j].item_1, 1);
        }
        //2
        if(map.get(matches[i].players[j].item_2)) {
          map.set(matches[i].players[j].item_2, map.get(matches[i].players[j].item_2) + 1);
        }else {
          map.set(matches[i].players[j].item_2, 1);
        }
        //3
        if(map.get(matches[i].players[j].item_3)) {
          map.set(matches[i].players[j].item_3, map.get(matches[i].players[j].item_3) + 1);
        }else {
          map.set(matches[i].players[j].item_3, 1);
        }
        //4
        if(map.get(matches[i].players[j].item_4)) {
          map.set(matches[i].players[j].item_4, map.get(matches[i].players[j].item_4) + 1);
        }else {
          map.set(matches[i].players[j].item_4, 1);
        }
        //5
        if(map.get(matches[i].players[j].item_5)) {
          map.set(matches[i].players[j].item_5, map.get(matches[i].players[j].item_5) + 1);
        }else {
          map.set(matches[i].players[j].item_5, 1);
        }
      }
    }
  }
  for (var entry of map.entries()) {
    if (entry[0] == 0) continue;
    arr.push([entry[0], entry[1]]);
  }
  arr.sort(function(a, b) {
    return b[1] - a[1];
  });
  return arr;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', data:'', wtf:''});
});

router.post('/dotaStats',function(req, res){
  // var account_Id = req.body.name;
  // console.log(req);
    var account_Id = req.body.data;
    console.log(account_Id);
  if (!account_Id) {
    res.send('error');
  }else {
    // console.log(account_Id);
    dota.getByAccountID(account_Id, function(err, info){
      // JSON.stringify(info);
      var details = info;
      var data = {match_hero : null, summarize : null};
      // console.log("ssa");
      // console.log(details.matches.length);
      var id = account_Id;
      var map = new Map();
      var matchArray = [];
      var arr = [];
      var str = "";
      // console.log(details.matches[0]);
      for (var i = 0; i < (details.matches.length); i++) {
        // console.log(details.matches[i].match_id);
        matchArray.push(details.matches[i].match_id);
        for (var j = 0; j < details.matches[i].players.length; j++) {
          if (details.matches[i].players[j].account_id == id) {
            if (map.get(details.matches[i].players[j].hero_id)) {
              map.set(details.matches[i].players[j].hero_id, map.get(details.matches[i].players[j].hero_id) + 1);

            } else {
              map.set(details.matches[i].players[j].hero_id, 1);
            }
          }
        }
      }
      // console.log(matchArray.length);

      for (var entry of map.entries()) {
        if (entry[0] == 0) continue;
        arr.push([entry[0], entry[1]]);
      }
      arr.sort(function(a, b) {
        return b[1] - a[1];
      });

      data.match_hero = arr;

      async.mapLimit(matchArray, 10, dotaget, function(err, match){
        if(err) return console.log(err);

        // console.log(match[0]);
        var itemarr = getItem(match, account_Id);
        var big_win_data = {win_score:0, lost_score:0, hero_id:0};
        var cur_max = 0;
        var summarize = {kills: 0, deaths: 0, assists:0, wins:0, radiant_wins:0, radiant:0, item:itemarr, big_win:big_win_data};
        for(var j = 0; j < match.length; j++) {
          for (var i = 0; i < match[j].players.length; i++) {
            if (match[j].players[i].account_id == id) {
              // alert(data.players[i].account_id +"   " +data.players[i].kills);
              if ((match[j].players[i].player_slot < 10) && (match[j].radiant_win == true)) {
                summarize.wins += 1;
                summarize.radiant_wins += 1;
                summarize.radiant += 1;
                if (match[j].radiant_score - match[j].dire_score > cur_max) {
                  // console.log("we got there");
                  big_win_data.win_score = match[j].radiant_score;
                  big_win_data.lost_score = match[j].dire_score;
                  big_win_data.hero_id = match[j].players[i].hero_id;
                  cur_max = match[j].radiant_score - match[j].dire_socre;
                }
              } else if ((match[j].players[i].player_slot > 10) && (match[j].radiant_win == false)) {
                summarize.wins += 1;
                if (match[j].dire_score - match[j].radiant_score > cur_max) {
                  big_win_data.lost_score = match[j].radiant_score;
                  big_win_data.win_score = match[j].dire_score;
                  big_win_data.hero_id = match[j].players[i].hero_id;
                  cur_max = match[j].dire_score - match[j].radiant_score;
                }
              }
              summarize.kills += match[j].players[i].kills;
              summarize.deaths += match[j].players[i].deaths;
              summarize.assists += match[j].players[i].assists;
            }
          }
        }
        summarize.big_win = big_win_data;
        data.summarize = summarize;
        res.send(data);
      });
    });
  }
});

module.exports = router;
