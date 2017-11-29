
var Forminput = React.createClass({
  submit: function() {
    $('#loading_img').empty();
    var loading_img_url = "<img src = './images/loading.gif'></img>";
    $('#loading_img').append(loading_img_url);
    $.ajax({
      url: '/dotaStats',
      type: 'POST',
      data: {data : $("#last_name").val()},
      // contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(result){
        // alert(JSON.stringify(result));
        $('#item_result').empty();
        $("#hero_result").empty();
        $('#loading_img').empty();
        $('#discript').empty();
        $("#Dire_win").empty();
        $("#Radiant_win").empty();
        var hero_result = [];
        var sum = 0;
        for (var i = 0; i < 5; i++) {
          var tempid = result.match_hero[i][0];
          var hero_freq = result.match_hero[i][1];
          sum += hero_freq;
          for (var j = 0; j < hr.heroes.length; j++) {
            if (hr.heroes[j].id == tempid) {
              hero_result.push([hr.heroes[j].name, hr.heroes[j].localized_name, hero_freq]);
              break;
            }
          }
        }
        var content = "<div class = 'row'>";
        content += "<h4>Your top 5 heroes!</h4>";
        for (var i = 0; i < hero_result.length; i++) {
          content += "<div class='col'>";
          content += "<div class ='container'><img class = 'heroimg' src='http://cdn.dota2.com/apps/dota2/images/heroes/" + hero_result[i][0] + "_full.png'>";
          // alert(hr.heroes[hero_result[i][0] - 1].name);
          content += "<div class ='overlay'><div class ='text'>" + hero_result[i][1] +" - "+ hero_result[i][2] + " times</div></div></div>";
          content += "</div>"
        }
        content += '</div>';
        var item_result = [];
        for (var i = 0; i < 5; i++) {
          var tempid = result.summarize.item[i][0];
          for (var j = 0; j < it.items.length; j++) {
            if (it.items[j].id == tempid) {
              item_result.push([it.items[j].name, result.summarize.item[i][1]]);
              break;
            }
          }
        }
        var items = "<div class = 'row'><h4>Your top 5 items you kept in the end of each game!</h4>";
        for (var i = 0; i < 5; i++) {
          items += "<img src='http://cdn.dota2.com/apps/dota2/images/items/"+item_result[i][0]+"_lg.png'>";
        }
        items += "</div>";

        new Chartist.Pie('#chart1', {
          labels: [hero_result[0][1], hero_result[1][1], hero_result[2][1], hero_result[3][1], hero_result[4][1], 'other heroes'],
          series: [hero_result[0][2], hero_result[1][2], hero_result[2][2], hero_result[3][2], hero_result[4][2], 100 - sum]
        }, {
          donut: true,
          donutWidth: 80,
          startAngle: 270,
          total: 100,
          showLabel: true
        });

        new Chartist.Bar('#chart2', {
          labels: ['Kills', 'Deaths', 'Assists'],
          series: [result.summarize.kills,result.summarize.deaths,result.summarize.assists]
        }, {
          distributeSeries: true
        }
        );
        var gamedata = [];
        gamedata.push(["kills", result.summarize.kills]);
        gamedata.push(["Deaths", result.summarize.deaths]);
        gamedata.push(["Assists", result.summarize.assists]);
        gamedata.sort(function(a, b) {return b[1] - a[1]});
        // alert(gamedata[0][0]);
        var gamedata_text = "<p>";
        if (gamedata[0][0] == "Assists") {
          gamedata_text += "Looks like you are a very good team players, you would like to help you teammates to kill enemies</p>";
        }else if (gamedata[0][0] == "Deaths") {
          gamedata_text += "Looks like you are willing to sacrifice in the game, and create space for your teammates to fight</p>";
        }else {
          gamedata_text += "Looks like you are a good carry in most of the games</p>";
        }
        $('#discript').append(gamedata_text);
        $('#item_result').append(items);
        $("#hero_result").append(content);
        $("#Radiant_win").append(result.summarize.radiant_wins);
        $("#Dire_win").append(result.summarize.wins - result.summarize.radiant_wins);
        $('.count').each(function () {
            $(this).prop('Counter',0).animate({
                Counter: $(this).text()
            }, {
                duration: 10000,
                easing: 'swing',
                step: function (now) {
                    $(this).text(Math.ceil(now));
                }
            });
        });
      }
    });
  },

  render: function() {
    return (
      <div>
        <div className="row center-align">
          <div className="input-field">
            <input id="last_name" name ="name" type="text" className="validate"></input>
              <label for="last_name">You steam acount_Id(Aibo Li's steam account number is 255912203, check this out!~)</label>
          <button className="btn waves-effect waves-light red center" onClick={this.submit}>Get Start!
            <i className="material-icons right">send</i>
          </button>
          </div>
          <div id = "loading_img">
          </div>
        </div>

        <div  className = "center-align" id = "hero_result">

        </div>

        <div  className = "center-align" id = "item_result">

        </div>
        <div className = "row">
          <div className="col s6">
            <div className="card-panel white">
              <div id = "chart1" className="ct-chart ct-perfect-fourth"></div>
              <span className="black-text">
                  Here is your pie char of heroes you picked in recent 100 games
              </span>
            </div>
          </div>
          <div className="col s6">
            <div className="card-panel white">
              <div id = "chart2" className="ct-chart ct-perfect-fourth"></div>
              <span id = "discript" className="black-text">
              </span>
            </div>
          </div>
        </div>
        <div className = "row">
          <div className="col s12" id = "last">
            <span id = "Radiant_span" className="count_name">Radiant Win</span>
            <span id = "Dire_span" className="count_name">Dire Win</span>
            <img id = "r_d" src = "./images/r_d.jpg"></img>
            <span id = "Radiant_win" className="count"></span>
            <span id = "Dire_win" className="count"></span>
          </div>
        </div>
    </div>
    );
  }
});

ReactDOM.render(
  <Forminput />,
  document.getElementById('application')
);
