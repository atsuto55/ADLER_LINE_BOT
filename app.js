const LINE_CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var mysql = require('mysql');

var app = express();

app.set('port', (process.env.PORT || 8000));

//受信時のjsonのパースを簡単にする（これがキモでした）
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/callback', function(req, res){
    //公式のドキュメント通りヘッダーを設定していないと、bodyがundefinedで返る。
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).end();
    console.log(req.body.events[0].message.text);
    event = req.body.events[0];

    //query用の乱数を取得する(範囲1~30)
    var search_id = Math.ceil( Math.random()*30 );
    console.log('search_id//' + search_id);

    var connection = mysql.createPool({
      host: 'us-cdbr-iron-east-05.cleardb.net',
      user: 'b1ac492ff93a44',
      password: process.env.MYSQL_PASSWORD,
      database: 'heroku_0c6f29c1cdf7663'
    });

    var maxim = '楽観的でありなさい。過去を悔やむのではなく、未来を不安視するのでもなく、今現在の「ここ」だけを見るのだ。';

    connection.query('select maxim from adler where id = ' + search_id, 
      function (error, results, fields) {
        console.log('******results******');
        console.log(results[0].maxim);

        if (event.type == 'message' && event.message.text == '今日の一言お願いします。'){
          var body = {
            replyToken: event.replyToken,
            messages: [{
              type: 'text',
              text: results[0].maxim
            }]
          }
        } else {
          var body = {
            replyToken: event.replyToken,
            messages: [{
              type: 'text',
              text: maxim
            }]
          }
        }

         var headers = {
             'Content-Type': 'application/json',
             'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN
         }

         var url = 'https://api.line.me/v2/bot/message/reply';
         request({
             url: url,
             method: 'POST',
             headers: headers,
             body: body,
             json: true
         });
    })
});


app.listen(app.get('port'), function() {
     console.log('Line bot app is running');
});
