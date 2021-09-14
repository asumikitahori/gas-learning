var prop = PropertiesService.getScriptProperties().getProperties();
var TOKEN = prop.TOKEN; //LINEのアクセストークン
var reply = 'https://api.line.me/v2/bot/message/reply';

function doPost(event) {
//メッセージを取得
  var json = JSON.parse(event.postData.contents);
  var replyToken = json.events[0].replyToken;
  var message = json.events[0].message;

  //メッセージタイプ判定
  if(message.type==='location'){

    forecastReply(replyToken, message);

  }else{

    locationAction(replyToken);

  }
}

function forecastReply(replyToken, message) {
    //緯度経度を取得
    var address = message.address;
    var zip = address.match(/[0-9]{3}-[0-9]{4}/gi);
    //緯度経度から天気予報のデータを取得
    var response = getWeather(zip);
    if (response != "error") {
      var country = response.city.country;
      var cityName = response.city.name;
      //配列準備
      var date = [],
          weather = [],
          icon = [],
          temperature = [];
      for (var i = 0; i <= 2; i++) { //3時間毎の天気データで6時間分取得
       //UTCをJSTに変換
          if (Number(response.list[i].dt_txt.slice(11, 13)) + 9 > 24) { 
            //dt_txt.slice(11, 13)・・・15:00だったら「15」の部分。dt_txtの文字列のstart番目からend-1番目まで取得（1文字目は0番目）
            date.push(Number(response.list[i].dt_txt.slice(11, 13)) + 9 - 24);
          }
          else {
              date.push(Number(response.list[i].dt_txt.slice(11, 13)) + 9);
          }
          weather.push(response.list[i].weather[0].description);
          icon.push(response.list[i].weather[0].icon);
          temperature.push(response.list[i].main.temp + '℃');
      }
        //LINEで返信するメッセージのデザインを指定
        var message = {
            "replyToken": replyToken,
            "messages": [{
                "type": "flex",
                "altText": '天気予報',
                "contents": {
                    "type": "bubble",
                    "styles": {
                        "footer": {
                            "separator": true
                        }
                    },
                    "body": {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "text",
                                "text": "天気予報",
                                "weight": "bold",
                                "size": "xxl",
                                "margin": "md"
                            },
                            {
                                "type": "text",
                                "text": country + '.' + cityName,
                                "size": "md",
                                "color": "#aaaaaa",
                                "wrap": true
                            },
                            {
                                "type": "separator",
                                "margin": "xxl"
                            },
                            {
                                "type": "box",
                                "layout": "vertical",
                                "margin": "xxl",
                                "spacing": "sm",
                                "contents": [
                                    { //①
                                        "type": "box",
                                        "layout": "baseline",
                                        "contents": [
                                            {
                                                "type": "text",
                                                "text": date[0] + ":00",
                                                "size": "sm",
                                                "color": "#555555",
                                                "flex": 0
                                            },
                                            {
                                                "type": "text",
                                                "text": weather[0],
                                                "size": "sm",
                                                "color": "#111111",
                                                "align": "end"
                                            },
                                            {
                                                "type": "icon",
                                                "url": "https://openweathermap.org/img/w/" + icon[0] + ".png",
                                                "size": "xl"
                                            },
                                            {
                                                "type": "text",
                                                "text": temperature[0],
                                                "size": "sm",
                                                "color": "#111111",
                                                "align": "end"
                                            }
                                        ]
                                    },
                                    { //②
                                        "type": "box",
                                        "layout": "baseline",
                                        "contents": [
                                            {
                                                "type": "text",
                                                "text": date[1] + ":00",
                                                "size": "sm",
                                                "color": "#555555",
                                                "flex": 0
                                            },
                                            {
                                                "type": "text",
                                                "text": weather[1],
                                                "size": "sm",
                                                "color": "#111111",
                                                "align": "end"
                                            },
                                            {
                                                "type": "icon",
                                                "url": "https://openweathermap.org/img/w/" + icon[1] + ".png",
                                                "size": "xl"
                                            },
                                            {
                                                "type": "text",
                                                "text": temperature[1],
                                                "size": "sm",
                                                "color": "#111111",
                                                "align": "end"
                                            }
                                        ]
                                    },
                                    {　//③
                                        "type": "box",
                                        "layout": "baseline",
                                        "contents": [
                                            {
                                                "type": "text",
                                                "text": date[2] + ":00",
                                                "size": "sm",
                                                "color": "#555555",
                                                "flex": 0
                                            },
                                            {
                                                "type": "text",
                                                "text": weather[2],
                                                "size": "sm",
                                                "color": "#111111",
                                                "align": "end"
                                            },
                                            {
                                                "type": "icon",
                                                "url": "https://openweathermap.org/img/w/" + icon[2] + ".png",
                                                "size": "xl"
                                            },
                                            {
                                                "type": "text",
                                                "text": temperature[2],
                                                "size": "sm",
                                                "color": "#111111",
                                                "align": "end"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "separator",
                                "margin": "xxl"
                            }
                        ]
                    }
                }
            },
            ]
        };
    }else {
        var botMessage = "国内の郵便番号のある位置情報を送り直してください。"
        var message = {
            "replyToken": replyToken,
            "messages": [{
              "type": "template",
              "altText": "This is a buttons template",
              "template": {
                "type": "buttons",
                "text": botMessage,
                "actions": [
                  {
                    "type": "uri",
                    "label": "位置情報を送る",
                    "uri": "https://line.me/R/nv/location/"
                  }
                ]
                }
             }]
        };
    }
    
    //メッセージ作成
    var payload = JSON.stringify(message);

    //メッセージ送信
    UrlFetchApp.fetch(reply, {
        "headers": {
          "Content-Type": "application/json; charset=UTF-8",
          "Authorization": "Bearer " + TOKEN,
        },
        "method": "post",
        "payload": payload
    });
}

function locationAction(replyToken){
    //メッセージ作成
    var botMessage = '位置情報を送ってください。\n天気予報を調べます。';
    var payload = JSON.stringify({
        "replyToken": replyToken,
        "messages": [{
          "type": "template",
          "altText": "This is a buttons template",
          "template": {
              "type": "buttons",
              "text": botMessage,
              "actions": [
                  {
                    "type": "uri",
                    "label": "位置情報を送る",
                    "uri": "https://line.me/R/nv/location/"
                  }
              ]
          }
        }]
    });

    //メッセージ送信
    UrlFetchApp.fetch(reply, {
        "headers": {
          "Content-Type": "application/json; charset=UTF-8",
          "Authorization": "Bearer " + TOKEN,
        },
        "method": "post",
        "payload": payload
    });
}

function getWeather(zip) { //指定したzipの天気情報を返す
    try {
        var apiKey = prop.API_KEY; //openweatherapp のAPIキー
        var url = 'http://api.openweathermap.org/data/2.5/forecast' + '?zip=' + zip + ',jp&APPID=' + apiKey + '&units=metric&lang=ja';
        var response = UrlFetchApp.fetch(url);
        return JSON.parse(response);
    } catch (e) {
        return "error";
    }
}
