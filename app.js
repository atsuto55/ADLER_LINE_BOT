const LINE_CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
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
    var event = req.body.events[0];
    var body = '';

    if (event.type == 'message' && event.message.text == '今日の一言お願いします。'){
            body = {
            replyToken: event.replyToken,
            messages: [{
              type: 'text',
              text: 'どうしたらみんなを喜ばすことが出来るかを毎日考えるようにしなさい。そうすれば、憂鬱な気持ちなど吹き飛んでしまいます。反対に自分のことばかり考えていたら、どんどん不幸になってしまいます。'
            }]
        }
    } else if (event.type == 'message' && event.message.text == '今日の一言'){
            body = {
            replyToken: event.replyToken,
            messages: [{
              type: 'text',
              text: '「自分は役立っている」と実感するのに、相手から感謝されることや、褒められることは不要である。貢献感は「自己満足」でいいのだ。'
            }]
        }
    } else {
            body = {
            replyToken: event.replyToken,
            messages: [{
              type: 'text',
              text: 'あなたが悩んでいる問題は本当にあなたの問題だろうか。その問題を放置した場合に困るのは誰か、冷静に考えてみることだ。'
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
});


app.listen(app.get('port'), function() {
     console.log('Line bot app is running');
});
