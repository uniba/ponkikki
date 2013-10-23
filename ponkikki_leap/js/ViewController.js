var ytplayer;

function onYouTubePlayerReady(player) {
	ytplayer = document.getElementById("myytplayer");
	console.log("get");
}

/**
 * ViewController class
 *
 * @constructor
 */

function ViewController() {
	this.videoctx;
	this.drawctx;
	this.bufferctx;
	this.maskctx;

	this.videocanvas;
	this.drawcanvas;
	this.buffercanvas;
	this.maskctx;

	this.cwidth;
	this.cheight;
	this.height;
	this.width;

	this.isCarib = false;
	this.isStart = false;
	this.caribValue = [
		[-170,330,-10],
		[170,160,-10],
		{
			"rateX":2,
			"rateY":2
		}
	];
	this.pos;


	this.mode = 0; // 0:paint 1:window
	this.isTap = false;

	this.maskZoom = 1;
	this.startZoom = false;
}

ViewController.prototype.init = function(){
	this.cwidth = 640;//window.innerWidth;
	this.cheight = 480;//window.innerHeight;
	this.width = window.innerWidth;
	this.height = window.innerHeight;

	var self = this;


    var $video = $("#video");
    this.videocanvas = $("#video-canvas").get(0);
    this.drawcanvas = $("#draw-canvas").get(0);
    this.buffercanvas = $("#buffer-canvas").get(0);
    this.maskcanvas = $("#mask-canvas").get(0);

    this.videocanvas.width = this.cwidth;
    this.videocanvas.height = this.cheight;
    this.drawcanvas.width = this.cwidth;
    this.drawcanvas.height = this.cheight;
    this.buffercanvas.width = this.cwidth;
    this.buffercanvas.height = this.cheight;
    this.maskcanvas.width = this.cwidth;
    this.maskcanvas.height = this.cheight;

    this.videoctx = this.videocanvas.getContext("2d");
    this.drawctx = this.drawcanvas.getContext("2d");
    this.bufferctx = this.buffercanvas.getContext("2d");
    this.maskctx = this.maskcanvas.getContext("2d");
  	//this.drawctx.globalCompositeOperation = "lighter";

    var params = { allowScriptAccess: "always" };
    var atts = { id: "myytplayer" };
    var url = "http://www.youtube.com/v/86svBvIvIq8?enablejsapi=1&playerapiid=ytplayer&loop=1&theme=dark&autohide=1";
    swfobject.embedSWF(url, "myplayer", this.width, this.height, "8", null, null, params, atts); 
    //swfobject.embedSWF(url, "myplayer", "500", "400", "8", null, null, params, atts); 

    var cammeraStream = null;
    var timeout = 1000 / 30;
    var isCapturing = false;

    this.initBind();
    this.initLeap();
    
    //ブラウザ間で仕様が違うらしいオブジェクト
    var windowURL = window.URL || window.webkitURL;
    //別名を作れないので上書きしておく
    navigator.getUserMedia = navigator.getUserMedia ||
               				 navigator.webkitGetUserMedia ||
               				 navigator.mozGetUserMedia ||
               				 navigator.msGetUserMedia;
    
    //取れなかったら動作しない
    if (windowURL == null || navigator.getUserMedia == null) {
    	alert("このブラウザじゃ動かないよ");
        return;
    }
    
    //ストップボタンで止めれるようにしておく
    $("#stopButton").click(function() {
    	//キャプチャの停止
        isCapturing = false;
        //カメラの停止
        if (cammeraStream == null) return;
        cammeraStream.stop();
    });
    
    
    //定周期で、videoをcanvasにキャプチャし、
    //さらにcanvasをimgに変換する(これで送信可能なキャプチャデータになってるはず)
    var capture = function() {
        if (isCapturing == false) return;
    	//context.transform(1, 0, 0, -1, 0, 1280);
    	self.videoctx.save();
		self.videoctx.scale(-1, 1);
        self.videoctx.drawImage(video, 0, 0, -self.cwidth, self.cheight);
		self.videoctx.scale(-1, 1);
        self.videoctx.globalCompositeOperation = 'destination-out';
        var offsetX = self.cwidth / 2 * (1 - 1 / self.maskZoom);
        var offsetY = self.cheight / 2 * (1 - 1 / self.maskZoom);
        //self.videoctx.drawImage(self.maskcanvas, 0,0);
        self.videoctx.drawImage(self.maskcanvas, 
        	offsetX, offsetY, self.cwidth / self.maskZoom, self.cheight / self.maskZoom,
        	0, 0, self.cwidth, self.cheight);
        self.videoctx.restore();

        if (self.startZoom){
        	self.maskZoom *= 1.05;
        	if (self.maskZoom > 10) self.maskZoom = 10;
        }
        setTimeout(capture, timeout);
    };

    //成功したときのコールバック
    var success = function(stream) {
        $video.attr("src", windowURL.createObjectURL(stream));
        cammeraStream = stream;
        //キャプチャも開始する
        isCapturing = true;
        capture();
    };
    
    //失敗したときのコールバック
    var error = function(e) {
    	alert("失敗");
    };
    
    //音も取れるらしいけど今回は動画のみ
    //getUserMediaの第一引数の型が途中で仕様変更されたらしい
    navigator.getUserMedia({video: true}, success, error);
}

ViewController.prototype.initBind = function(){
	var self = this;
	// $("#draw-canvas").mousemove(function(e){

	// 	self.drawctx.fillStyle = "rgb(0, 255, 255)";
	// 	self.drawctx.fillRect(e.clientX / self.width * self.cwidth - 5,e.clientY / self.height * self.cheight - 5,10,10);
	// });
	$("#caribButton").click(function(){
		self.isCarib = !self.isCarib;
		if (self.isCarib){
			$("div.carib-elem").show();
		}else{
			$("div.carib-elem").hide();
		}
	});

	$("button.carib-set-button").click(function(){
		var num = Number($(this).attr("name"));
		self.caribValue[num] = self.pos;
		var rateX = self.cwidth * 0.8 / (self.caribValue[1][0] - self.caribValue[0][0]);
		var rateY = self.cheight * 0.8 / (self.caribValue[0][1] - self.caribValue[1][1]);
		console.log(rateX+"/"+rateY);
		self.caribValue[2].rateX = rateX;
		self.caribValue[2].rateY = rateY;
		console.log(self.caribValue);
	});

	$("#start-button").click(function(){

		self.isStart = !self.isStart;
		if (self.isStart){
			$(this).text("stop");
		}else{
			$(this).text("start");
		}
	});

	$("#mode-button").click(function(){
		self.mode = 1 - self.mode;
		if (self.mode == 0){
			$(this).text("mode 0");
		}else{
			$(this).text("mode 1");
		}
	});
	$("#reset-button").click(function(){
		self.maskctx.clearRect(0, 0, self.cwidth, self.cheight);
	});
}
ViewController.prototype.initLeap = function(){
	var self = this;
	Leap.loop({enableGestures: true}, function(frame){
		if (self.mode == 0){
		    self.drawctx.clearRect(0, 0, self.cwidth, self.cheight);
			if (frame.fingers[0]){
				var finger = frame.fingers[0];
				var pos = finger.tipPosition;
				var rate = 4;
				//console.log(pos);
				self.updateStat(pos);
				if (pos[2] < 0){
					var x = self.cwidth * 0.1 + (pos[0] - self.caribValue[0][0]) * self.caribValue[2].rateX;
					var y = self.cheight * 0.9 - (pos[1] - self.caribValue[1][1]) * self.caribValue[2].rateY;
					self.drawctx.fillStyle = "rgb(150, 150, 150)";
					self.drawctx.fillRect(
						x - 5,
						y - 5,
						10,10);
					if (self.isStart){
						self.maskctx.fillStyle = "rgb(255, 150, 150)";
						self.maskctx.beginPath();
						self.maskctx.arc(x, y, 30, 0, 2 * Math.PI, true);
						self.maskctx.fill();
						if (!self.isTap){
							self.isTap = true;
							console.log("video start");
							ytplayer.playVideo();
						}
					}
				}
				else{
					if (self.isStart && self.isTap){
						self.isTap = false;
						setInterval(function(){self.startZoom = true}, 1000);
					}
				}
			}
		}
		if (self.mode == 1){
		    self.bufferctx.clearRect(0, 0, self.cwidth, self.cheight);
		    self.bufferctx.drawImage(self.drawcanvas, 0, 0);
		    self.drawctx.globalAlpha = 0.98;
		    self.drawctx.clearRect(0, 0, self.cwidth, self.cheight);
		    self.drawctx.drawImage(self.buffercanvas, 0, 0);
			if (frame.fingers[0]){
				var finger = frame.fingers[0];
				var pos = finger.tipPosition;
				var rate = 4;
				self.updateStat(pos);
				if (pos[2] < 0){
					var x = self.cwidth * 0.1 + (pos[0] - self.caribValue[0][0]) * self.caribValue[2].rateX;
					var y = self.cheight * 0.9 - (pos[1] - self.caribValue[1][1]) * self.caribValue[2].rateY;
					if (self.isStart){
						if (!self.isTap){
							self.maskctx.fillStyle = "rgb(255, 150, 150)";
							self.isTap = true;
							self.maskctx.beginPath();
							self.maskctx.moveTo(x,y);
						}
						else{
							self.maskctx.lineTo(x,y);
						}
					}
					self.drawctx.fillStyle = "rgb(255, 150, 150)";
					self.drawctx.beginPath();
					self.drawctx.arc(x, y, 10, 0, 2 * Math.PI, true);
					self.drawctx.fill();
				}
				else{
					if (self.isStart && self.isTap){
						self.maskctx.closePath();
						self.maskctx.fill();
						ytplayer.playVideo();
						setInterval(function(){self.startZoom = true}, 1000);
						self.isTap = false;
					}
				}
			}
		}
	});
}

ViewController.prototype.updateStat = function(_pos){
	$("#carib-stat").text(_pos[0].toFixed(1)+" / "+_pos[1].toFixed(1)+" / "+_pos[2].toFixed(1));
	this.pos = _pos;
	var maxsize = 60;
	if (_pos[2] > maxsize){
		$("#stat-circle").hide();
	}
	else if (_pos[2] > 0){
		var size = maxsize - _pos[2];
		$("#stat-circle")
			.show()
			.css("background-color","#faa")
			.css("top",120 - size / 2)
			.css("left",this.width / 2 - size / 2)
			.css("width",size)
			.css("height",size);
	}
	else{
		$("#stat-circle")
			.css("background-color","#afa")
			.css("top",120 - maxsize / 2)
			.css("left",this.width / 2 - maxsize / 2)
			.css("width",maxsize)
			.css("height",maxsize);
	}
}
