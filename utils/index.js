var barcode = require('./barcode');
var qrcode = require('./qrcode');

function convert_length(length) {
	return Math.round(wx.getSystemInfoSync().windowWidth * length / 750);
}

function barc(id, code, width, height) {
	barcode.code128(wx.createCanvasContext(id), code, convert_length(width), convert_length(height))
}

function qrc(id, code, width, height) {
	qrcode.api.draw(code, {
		ctx: wx.createCanvasContext(id),
		width: convert_length(width),
		height: convert_length(height)
	})
}

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds();


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getPhone(p) {  
	return p.substr(0, 3) + '****' + p.substr(7)
}

function getData(url,method,params){
    return new Promise(function(resolve, reject){
        wx.request({
            url: url,
            method:method,
            data: params,
            header: {
                //'Content-Type': 'application/json'
            },
            success: function(res) {
                console.log("success");
                resolve(res)
            },
            fail: function (res) {
                reject(res)
                console.log("failed")
            }
        })
    })
}

module.exports = {
	barcode: barc,
	qrcode: qrc,
	formatTime: formatTime,
	getPhone: getPhone,
    getData: getData
}