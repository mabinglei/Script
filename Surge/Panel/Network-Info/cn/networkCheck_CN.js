/**
 * Surge 网络信息面板
 * @Nebulosa-Cat
 * 详细请见 README
 */
 const { wifi, v4, v6 } = $network;

 let cellularInfo = '';
 const carrierNames = {
   //中国电信业者 MNC Code
   '460-03': '中国电信', '460-05': '中国电信', '460-11': '中国电信',
   '460-01': '中国联通', '460-06': '中国联通', '460-09': '中国联通',
   '460-00': '中国移动', '460-02': '中国移动', '460-04': '中国移动', '460-07': '中国移动', '460-08': '中国移动',
   '460-15': '中国广电',
   '460-20': '中国铁通',
 };
 
 const radioGeneration = {
   'GPRS': '2.5G',
   'CDMA1x': '2.5G',
   'EDGE': '2.75G',
   'WCDMA': '3G',
   'HSDPA': '3.5G',
   'CDMAEVDORev0': '3.5G',
   'CDMAEVDORevA': '3.5G',
   'CDMAEVDORevB': '3.75G',
   'HSUPA': '3.75G',
   'eHRPD': '3.9G',
   'LTE': '4G',
   'NRNSA': '5G',
   'NR': '5G',
 };
 
var Used = 0.00;
var Total = 0.00;

 if (!v4.primaryAddress && !v6.primaryAddress) {
   $done({
     title: '没有网络',
     content: '未连接网络\n请检查网络后重试',
     icon: 'wifi.exclamationmark',
     'icon-color': '#CB1B45',
   });
 } else {
   if ($network['cellular-data']) {
     const carrierId = $network['cellular-data'].carrier;
     const radio = $network['cellular-data'].radio;
     if (carrierId && radio) {
       cellularInfo = carrierNames[carrierId] ?
         carrierNames[carrierId] + ' ' + radioGeneration[radio] + ' (' + radio + ')' :
         '蜂窝数据 - ' + radioGeneration[radio] + ' (' + radio + ')';
     }
   }
   $httpClient.get('http://ip-api.com/json', function (error, response, data) {
     if (error) {
       $done({
         title: '发生错误',
         content: '无法获取当前网络信息\n请检查网络状态后重试',
         icon: 'wifi.exclamationmark',
         'icon-color': '#CB1B45',
       });
     }
 
     const info = JSON.parse(data);
     getVPSInfo.then((value) => {
      $done({
       title: wifi.ssid ? wifi.ssid : cellularInfo,
       content:
         (v4.primaryAddress ? `IP : ${v4.primaryAddress} \n` : '') +
         (v4.primaryRouter && wifi.ssid ? `路由器 : ${v4.primaryRouter}\n` : '') +
         `节点IP : ${info.query}\n` +
         `节点流量 : ${value.used} GB | ${value.total} GB\n` +
         `节点ISP : ${info.isp}\n` +
         `节点位置 : ${getFlagEmoji(info.countryCode)} ${info.country} - ${info.city}`,
       icon: wifi.ssid ? 'wifi' : 'simcard',
       'icon-color': wifi.ssid ? '#005CAF' : '#005CAF',
      });
     });
   });
 }
 
 function getFlagEmoji(countryCode) {
   const codePoints = countryCode
     .toUpperCase()
     .split('')
     .map((char) => 127397 + char.charCodeAt());
   return String.fromCodePoint(...codePoints);
 }

  const getVPSInfo = new Promise((resolve, reject) => {
    let opts = {
      url: 'https://www.dmit.io/clientarea.php',
      headers: {
        'Cookie': '  ',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
      },
    }

    $httpClient.get(opts, function (error, response, data) {
      if (error) {
        reject('Error')
        return
      }
      if (response.status !== 200) {
        reject('Not Available')
        return
      }

      let match = data.match(/Used: ([0-9]{0,4}\.[0-9]{0,4})[\s\S]*?Total: ([0-9]{0,4})/)
      if (!match) {
        resolve({ used: '', total: '' })
        return
      }

      let used = match[1];
      let total = match[2];
      resolve({used,total});
    })
  });
