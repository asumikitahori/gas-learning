function getWeatherData() {
  const sID = "18c7IBNw9LZzEu7QTV2haN8rToLYmr3vuN0HcL5k5rO4";
  const ss = SpreadsheetApp.openById(sID);
  const sheet = ss.getSheetByName("シート1");
  const apiKey = 'a395a5b4a8b5a350b6a23381b65597cb'; //open weather のAPIキー
  const zip = popup(); //実行するときに郵便番号指定できるようにしたい
  const url = 'https://api.openweathermap.org/data/2.5/forecast' + '?zip=' + zip + ',jp&APPID=' + apiKey + '&lang=ja&units=metric';
  // https://api.openweathermap.org/data/2.5/forecast?zip=151-0072,jp&APPID=a395a5b4a8b5a350b6a23381b65597cb&lang=ja&units=metric
  const response = UrlFetchApp.fetch(url); //openweathermapから特定のzipの天気情報を取ってくる
  const ob = JSON.parse(response);

  var country = ob.city.country;
  var cityName = ob.city.name;
  sheet.getRange(1,2).setValue(country);
  sheet.getRange(1,3).setValue(cityName);
  for(var i=0; i<=8; i++){
    var wdata = ob.list[i];
    var time = new Date(wdata.dt_txt);
    time.setHours(time.getHours() + 9);
    //Logger.log(time);

    sheet.getRange(i*1+3, 1).setValue(time);
    sheet.getRange(i*1+3, 2).setValue(wdata.weather[0].description); //天気
    sheet.getRange(i*1+3, 3).setValue(wdata.main.temp_max); //最高気温
    if(wdata.rain){
      sheet.getRange(i*1+3, 4).setValue(wdata.rain['3h']); //降水量list.rain.3h
    }else{
      sheet.getRange(i*1+3, 4).setValue(0);
    }
  }
}

function popup(){
  const ui = SpreadsheetApp.getUi();
  const res = ui.prompt('天気予報', '知りたい地域の郵便番号を入力してください。(例.155-0032)', ui.ButtonSet.OK);
  const msg = res.getResponseText();
  return msg;
}

function onOpen(){
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('天気予報');
  menu.addItem('お天気どうでしょう', 'getWeatherData');
  menu.addToUi();
}