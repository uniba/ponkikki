ponkikki
========

ポンキッキxユニバ展示会用

・設置方法<br>
ponkikki_leap以下を任意の場所に置いて下さい

・起動方法<br>
ponkikki_leapで<br>
$ node server.js<br>
でchromeで<br>
http://localhost:8888/<br>
にアクセス

・操作<br>
まず最初にカメラのアクセスを求められるので許可

・モード切替（mode Xボタン/Returnキー）<br>
0：塗りつぶす<br>
1：無調整で四角を書く<br>
2：いい感じに四角を書く

・塗りつぶしを有効化（startボタン/キーボード割り当てなし）<br>
stop状態は値が取れてるかのテスト用

・リセット（all resetボタン/ESCキー）<br>
塗りつぶし済み領域を消したり<br>
動画の再生を消してWebCamに戻したり<br>
動画を別の動画にしたり<br>
とにかく全リセット

・UIを消す（ボタンなし/Spaceキー）<br>

・0とか1とかmask resetのボタン<br>
0,1はキャリブレーション用。使わなくてもOKです。<br>
mask resetも使わなくてOK

・基本的な使い方<br>
chromeでアクセス<br>
↓<br>
プレゼンテーションモードにする<br>
↓<br>
Cmd+Rで再読み込み（最大化でずれるので）<br>
↓<br>
カメラを許可<br>
↓<br>
modeを選択<br>
↓<br>
Leapの値が取れてるのを確認<br>
↓<br>
Startして塗りつぶしを有効化<br>
↓<br>
SpaceでUIを消す<br>

・FAQ<br>
Leapがおかしい！<br>
→抜き差し/上のメニューから「デバイスの再調整」<br>
→「トラッキングの向きの自動調整」はチェックしない。ケーブルは右に出る感じにしてました。（逆向き）<br>

プログラムがおかしい！<br>
→chrome再起動から<br>