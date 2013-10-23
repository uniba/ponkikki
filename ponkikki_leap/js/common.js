function dateStringToTime(_date){
	var date = new Date(_date);
	var time = date.getTime();
	return Number(time);
}

function getMonthEndDay(year, month) {
    //日付を0にすると前月の末日を指定したことになります
    //指定月の翌月の0日を取得して末日を求めます
    //そのため、ここでは month - 1 は行いません
    var dt = new Date(year, month, 0);
    return dt.getDate();
}

function WEBtoHSV (colorString){
  var r = parseInt(colorString.substr(1,2), 16);
  var g = parseInt(colorString.substr(3,2), 16);
  var b = parseInt(colorString.substr(5,2), 16);

  return RGBtoHSV(r,g,b);
}


/**
 * RGB配列 を HSV配列 へ変換します
 *
 * @param   {Number}  r         red値   ※ 0～255 の数値
 * @param   {Number}  g         green値 ※ 0～255 の数値
 * @param   {Number}  b         blue値  ※ 0～255 の数値
 * @param   {Boolean} coneModel 円錐モデルにするか
 * @return  {Object}  {h, s, v} ※ h は 0～360の数値、s/v は 0～255 の数値
 */
function RGBtoHSV (r, g, b, coneModel) {
  var h, // 0..360
      s, v, // 0..255
      max = Math.max(Math.max(r, g), b),
      min = Math.min(Math.min(r, g), b);

  // hue の計算
  if (max == min) {
    h = 0; // 本来は定義されないが、仮に0を代入
  } else if (max == r) {
    h = 60 * (g - b) / (max - min) + 0;
  } else if (max == g) {
    h = (60 * (b - r) / (max - min)) + 120;
  } else {
    h = (60 * (r - g) / (max - min)) + 240;
  }

  while (h < 0) {
    h += 360;
  }

  // saturation の計算
  if (coneModel) {
    // 円錐モデルの場合
    s = max - min;
  } else {
    s = (max == 0)
      ? 0 // 本来は定義されないが、仮に0を代入
      : (max - min) / max * 255;
  }

  // value の計算
  v = max;

  return {'h': h, 's': s, 'v': v};
}

/**
 * HSV配列 を RGB配列 へ変換します
 *
 * @param   {Number}  h         hue値        ※ 0～360の数値
 * @param   {Number}  s         saturation値 ※ 0～255 の数値
 * @param   {Number}  v         value値      ※ 0～255 の数値
 * @return  {Object}  {r, g, b} ※ r/g/b は 0～255 の数値
 */
function HSVtoRGB (h, s, v) {
  var r, g, b; // 0..255

  while (h < 0) {
    h += 360;
  }

  h = h % 360;

  // 特別な場合 saturation = 0
  if (s == 0) {
    // → RGB は V に等しい
    v = Math.round(v);
    return {'r': v, 'g': v, 'b': v};
  }

  s = s / 255;

  var i = Math.floor(h / 60) % 6,
      f = (h / 60) - i,
      p = v * (1 - s),
      q = v * (1 - f * s),
      t = v * (1 - (1 - f) * s)

  switch (i) {
    case 0 :
      r = v;  g = t;  b = p;  break;
    case 1 :
      r = q;  g = v;  b = p;  break;
    case 2 :
      r = p;  g = v;  b = t;  break;
    case 3 :
      r = p;  g = q;  b = v;  break;
    case 4 :
      r = t;  g = p;  b = v;  break;
    case 5 :
      r = v;  g = p;  b = q;  break;
  }

  return {'r': Math.round(r), 'g': Math.round(g), 'b': Math.round(b)};
}