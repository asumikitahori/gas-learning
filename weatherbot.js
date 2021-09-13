
var access_token = "YOUR ACCESS TOKEN";

function doPost(e) {
    var events = JSON.parse(e.postData.contents).events;
    events.forEach(function (event) { 
        if (event.message.type == "location"){
          reply(event);
        }
    });
}

function reply(e) {
    //var userMessage = e.message.text;
    var lat = e.message.latitude;
    var lon = e.message.longitude;
    var response = getWeather(lat, lon);
    if (response != "error") { //responseで受け取ったzipの天気情報がエラーじゃなかったら
        //JSON内のcityカテゴリから国名、都市名を取得
        var country = response.city.country,
            cityName = response.city.name;
        //配列準備
        var date = [],
            weather = [],
            icon = [],
            temperature = [];
        for (var i = 0; i <= 8; i++) { //3時間毎の天気データで24時間分取得
        //UTCをJSTに変換
            if (Number(response.list[i].dt_txt.slice(11, 13)) + 9 > 24) { 
            //dt_txt.slice(11, 13)・・・15:00だったら「15」の部分。dt_txtの文字列のstart番目からend-1番目まで取得（1文字目は0番目）
                date.push(Number(response.list[i].dt_txt.slice(11, 13)) + 9 - 24);
            }
            else {
                date.push(Number(response.list[i].dt_txt.slice(11, 13)) + 9);
            }
            weather.push(response.list[i].weather[0].main);
            icon.push(response.list[i].weather[0].icon);
            temperature.push((Math.round((Number(response.list[i].main.temp) - 273.15) * 10) / 10).toString() + '℃');
        }
        //LINEで返信するメッセージのデザインを指定
        var message = {
            "replyToken": e.replyToken,
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
                                    {
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
                                    {
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
                                    {
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
                                    },
                                    {
                                        "type": "box",
                                        "layout": "baseline",
                                        "contents": [
                                            {
                                                "type": "text",
                                                "text": date[3] + ":00",
                                                "size": "sm",
                                                "color": "#555555",
                                                "flex": 0
                                            },
                                            {
                                                "type": "text",
                                                "text": weather[3],
                                                "size": "sm",
                                                "color": "#111111",
                                                "align": "end"
                                            },
                                            {
                                                "type": "icon",
                                                "url": "https://openweathermap.org/img/w/" + icon[3] + ".png",
                                                "size": "xl"
                                            },
                                            {
                                                "type": "text",
                                                "text": temperature[3],
                                                "size": "sm",
                                                "color": "#111111",
                                                "align": "end"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "box",
                                        "layout": "baseline",
                                        "contents": [
                                            {
                                                "type": "text",
                                                "text": date[4] + ":00",
                                                "size": "sm",
                                                "color": "#555555",
                                                "flex": 0
                                            },
                                            {
                                                "type": "text",
                                                "text": weather[4],
                                                "size": "sm",
                                                "color": "#111111",
                                                "align": "end"
                                            },
                                            {
                                                "type": "icon",
                                                "url": "https://openweathermap.org/img/w/" + icon[4] + ".png",
                                                "size": "xl"
                                            },
                                            {
                                                "type": "text",
                                                "text": temperature[4],
                                                "size": "sm",
                                                "color": "#111111",
                                                "align": "end"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "box",
                                        "layout": "baseline",
                                        "contents": [
                                            {
                                                "type": "text",
                                                "text": date[5] + ":00",
                                                "size": "sm",
                                                "color": "#555555",
                                                "flex": 0
                                            },
                                            {
                                                "type": "text",
                                                "text": weather[5],
                                                "size": "sm",
                                                "color": "#111111",
                                                "align": "end"
                                            },
                                            {
                                                "type": "icon",
                                                "url": "https://openweathermap.org/img/w/" + icon[5] + ".png",
                                                "size": "xl"
                                            },
                                            {
                                                "type": "text",
                                                "text": temperature[5],
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
            {
              "type": "text",
              "text": "緯度: " + lat + "\n経度: " + lon
            }]
        };
    } else {
        var message = {
            "replyToken": e.replyToken,
            "messages": [{
                "type": "text",
                "text": "その郵便番号は存在しておりません。"
            }]
        };
    }
    var replyData = {
        "method": "post",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + access_token
        },
        "payload": JSON.stringify(message)
    };
    try {
        UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", replyData);
    } catch (e) {

    }
}

function location_action(e) {
  var action = {
    "replyToken": e.replyToken,
    "messages": [{
      "type": "template",
			"altText": "location",
			"template":{
        "type": "buttons",
				"thumbnailImageUrl": "https://dekiru.net/upload_docs/img/ogp19-google-23b.jpg", // 画像のURL
				"imageAspectRatio": "rectangle", // 画像のアスペクト比、「rectangle: 1.51:1」・「square: 1:1」、デフォルト値はrectangle
				"imageSize": "cover", // 画像の表示形式
				"imageBackgroundColor": "#FFFFFF", // 画像の背景色
				"title": "お天気どうでしょう",
				"text": "以下より選択してください。",
        "actions": [{
						"type": "location",
						"label": "天気予報を知りたい場所を選択してください。",
            "uri": "https://line.me/R/nv/location/"
				}]
      }
    }],
    "notificationDisabled": false // trueだとユーザーに通知されない
  };
  var pushData = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + access_token
    },
    "payload": JSON.stringify(action)
  };
  try {
  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', pushData);
  } catch (e) {

    }
}

function getWeather(lat, lon) { //指定したzipの天気情報を返す
    try {
        var apiKey = 'open weather のAPIキー';
        var url = 'http://api.openweathermap.org/data/2.5/forecast' + '?lat=' + lat + '&lon=' + lon + '&APPID=' + apiKey;
        var response = UrlFetchApp.fetch(url);
        return JSON.parse(response);
    } catch (e) {
        return "error";
    }
}