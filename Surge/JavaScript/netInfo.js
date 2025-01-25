/*
 * Surge 网络详情面板
 * 原作者@Nebulosa-Cat
 * 魔改@Lord-Vader
 */

/**
 * 网络请求封装为 Promise
 * Usage: httpMethod.get(option).then(response => { logger.log(data) }).catch(error => { logger.log(error) })
 * Usage: httpMethod.post(option).then(response => { logger.log(data) }).catch(error => { logger.log(error) })
 * response: { status, headers, data }
 */
class httpMethod {
    /**
     * 回调函数
     * @param {*} resolve 
     * @param {*} reject 
     * @param {*} error 
     * @param {*} response 
     * @param {*} data 
     */
    static _httpRequestCallback(resolve, reject, error, response, data) {
        if (error) {
            reject(error);
        } else {
            resolve(Object.assign(response, { data }));
        }
    }

    /**
     * HTTP GET
     * @param {Object} option 选项
     * @returns 
     */
    static get(option = {}) {
        return new Promise((resolve, reject) => {
            $httpClient.get(option, (error, response, data) => {
                this._httpRequestCallback(resolve, reject, error, response, data);
            });
        });
    }

    /**
     * HTTP POST
     * @param {Object} option 选项
     * @returns 
     */
    static post(option = {}) {
        return new Promise((resolve, reject) => {
            $httpClient.post(option, (error, response, data) => {
                this._httpRequestCallback(resolve, reject, error, response, data);
            });
        });
    }
}

class loggerUtil {
    constructor() {
        this.id = randomString();
    }

    log(message) {
        message = `[${this.id}] [ LOG ] ${message}`;
        console.log(message);
    }

    error(message) {
        message = `[${this.id}] [ERROR] ${message}`;
        console.log(message);
    }
}

function getCookie() {

  const headerCookie = $request.headers["Cookie"] || $request.headers["cookie"];
  if ($request.url.includes('dmit.io')) {
      if (headerCookie && headerCookie.includes('cf_clearance=')) {
        if (CookieValOfDmit != headerCookie) {
            $vader.write(headerCookie, "CookieDmit")
            $vader.notify("写入Dmit Cookie成功 🎉", "", $request.url, {
                "media-url": "https://raw.githubusercontent.com/mabinglei/Script/refs/heads/main/dmit_logo.png",
                "auto-dismiss": 5
            })
        }
      } else {
            $vader.notify("写入Dmit Cookie失败 ‼️", "原因：cf_clearance值缺失", $request.url, {
                "media-url": "https://raw.githubusercontent.com/mabinglei/Script/refs/heads/main/dmit_logo.png",
                "auto-dismiss": 5
            })
      }
  } else if ($request.url.includes('soladrive.com')) {
      if (headerCookie && headerCookie.includes('twk_uuid')) {
        if (CookieValOfSolaDrive != headerCookie) {
            $vader.write(headerCookie, "CookieSolaDrive")
            $vader.notify("写入SolaDrive Cookie成功 🎉", "", $request.url, {
                "media-url": "https://www.soladrive.com/wp-content/uploads/2023/04/cropped-faviconlatest-192x192.png",
                "auto-dismiss": 5
            })
        }
      } else {
            $vader.notify("写入SolaDrive Cookie失败 ‼️", "原因：twk_uuid值缺失", $request.url, {
                "media-url": "https://www.soladrive.com/wp-content/uploads/2023/04/cropped-faviconlatest-192x192.png",
                "auto-dismiss": 5
            })
      }
  } else {
        $vader.notify("写入Cookie失败 ‼️", "原因：未知的VPS提供商", $request.url, {
            "auto-dismiss": 5
        })
  }
  return $vader.done();

}

function vader() {
  const isRequest = typeof $request != "undefined"
  const isSurge = typeof $httpClient != "undefined"
  const isQuanX = typeof $task != "undefined"
  const notify = (title, subtitle, message, options) => {
    if (isQuanX) $notify(title, subtitle, message)
    if (isSurge) $notification.post(title, subtitle, message, options)
  }
  const write = (value, key) => {
    if (isQuanX) return $prefs.setValueForKey(value, key)
    if (isSurge) return $persistentStore.write(value, key)
  }
  const read = (key) => {
    if (isQuanX) return $prefs.valueForKey(key)
    if (isSurge) return $persistentStore.read(key)
  }
  const adapterStatus = (response) => {
    if (response) {
      if (response.status) {
        response["statusCode"] = response.status
      } else if (response.statusCode) {
        response["status"] = response.statusCode
      }
    }
    return response
  }
  const get = (options, callback) => {
    if (isQuanX) {
      if (typeof options == "string") options = {
        url: options
      }
      options["method"] = "GET"
      $task.fetch(options).then(response => {
        callback(null, adapterStatus(response), response.body)
      }, reason => callback(reason.error, null, null))
    }
    if (isSurge) $httpClient.get(options, (error, response, body) => {
      callback(error, adapterStatus(response), body)
    })
  }
  const post = (options, callback) => {
    if (isQuanX) {
      if (typeof options == "string") options = {
        url: options
      }
      options["method"] = "POST"
      $task.fetch(options).then(response => {
        callback(null, adapterStatus(response), response.body)
      }, reason => callback(reason.error, null, null))
    }
    if (isSurge) {
      $httpClient.post(options, (error, response, body) => {
        callback(error, adapterStatus(response), body)
      })
    }
  }
  const done = (value = {}) => {
    if (isQuanX) return $done(value)
    if (isSurge) isRequest ? $done(value) : $done()
  }
  return {
    isRequest,
    notify,
    write,
    read,
    get,
    post,
    done
  }
}

function randomString(e = 6) {
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n;
}

function getFlagEmoji(countryCode) {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

function loadCarrierNames() {
    //整理逻辑:前三码相同->后两码相同运营商->剩下的
    return {
        //台湾运营商 Taiwan
        '466-11': '中華電信',
        '466-92': '中華電信',
        '466-01': '遠傳電信',
        '466-03': '遠傳電信',
        '466-97': '台灣大哥大',
        '466-89': '台灣之星',
        '466-05': 'GT',
        //大陆运营商 China
        '460-03': '中国电信',
        '460-05': '中国电信',
        '460-11': '中国电信',
        '460-01': '中国联通',
        '460-06': '中国联通',
        '460-09': '中国联通',
        '460-00': '中国移动',
        '460-02': '中国移动',
        '460-04': '中国移动',
        '460-07': '中国移动',
        '460-08': '中国移动',
        '460-15': '中国广电',
        '460-20': '中移铁通',
        //香港运营商 HongKong
        '454-00': 'CSL',
        '454-02': 'CSL',
        '454-10': 'CSL',
        '454-18': 'CSL',
        '454-03': '3',
        '454-04': '3',
        '454-05': '3',
        '454-06': 'SMC HK',
        '454-15': 'SMC HK',
        '454-17': 'SMC HK',
        '454-09': 'CMHK',
        '454-12': 'CMHK',
        '454-13': 'CMHK',
        '454-28': 'CMHK',
        '454-31': 'CMHK',
        '454-16': 'csl.',
        '454-19': 'csl.',
        '454-20': 'csl.',
        '454-29': 'csl.',
        '454-01': '中信國際電訊',
        '454-07': 'UNICOM HK',
        '454-08': 'Truphone',
        '454-11': 'CHKTL',
        '454-23': 'Lycamobile',
        //日本运营商 Japan
        '440-00': 'Y!mobile',
        '440-10': 'docomo',
        '440-11': 'Rakuten',
        '440-20': 'SoftBank',
        '440-50': ' au',
        '440-51': ' au',
        '440-52': ' au',
        '440-53': ' au',
        '440-54': ' au',
        '441-00': 'WCP',
        '441-10': 'UQ WiMAX',
        //韩国运营商 Korea
        '450-03': 'SKT',
        '450-05': 'SKT',
        '450-02': 'KT',
        '450-04': 'KT',
        '450-08': 'KT',
        '450-06': 'LG U+',
        '450-10': 'LG U+',
        //美国运营商 USA
        '310-030': 'AT&T',
        '310-070': 'AT&T',
        '310-150': 'AT&T',
        '310-170': 'AT&T',
        '310-280': 'AT&T',
        '310-380': 'AT&T',
        '310-410': 'AT&T',
        '310-560': 'AT&T',
        '310-680': 'AT&T',
        '310-980': 'AT&T',
        '310-160': 'T-Mobile',
        '310-200': 'T-Mobile',
        '310-210': 'T-Mobile',
        '310-220': 'T-Mobile',
        '310-230': 'T-Mobile',
        '310-240': 'T-Mobile',
        '310-250': 'T-Mobile',
        '310-260': 'T-Mobile',
        '310-270': 'T-Mobile',
        '310-300': 'T-Mobile',
        '310-310': 'T-Mobile',
        '310-660': 'T-Mobile',
        '310-800': 'T-Mobile',
        '311-660': 'T-Mobile',
        '311-882': 'T-Mobile',
        '311-490': 'T-Mobile',
        '312-530': 'T-Mobile',
        '311-870': 'T-Mobile',
        '311-880': 'T-Mobile',
        '310-004': 'Verizon',
        '310-010': 'Verizon',
        '310-012': 'Verizon',
        '310-013': 'Verizon',
        '311-110': 'Verizon',
        '311-270': 'Verizon',
        '311-271': 'Verizon',
        '311-272': 'Verizon',
        '311-273': 'Verizon',
        '311-274': 'Verizon',
        '311-275': 'Verizon',
        '311-276': 'Verizon',
        '311-277': 'Verizon',
        '311-278': 'Verizon',
        '311-279': 'Verizon',
        '311-280': 'Verizon',
        '311-281': 'Verizon',
        '311-282': 'Verizon',
        '311-283': 'Verizon',
        '311-284': 'Verizon',
        '311-285': 'Verizon',
        '311-286': 'Verizon',
        '311-287': 'Verizon',
        '311-288': 'Verizon',
        '311-289': 'Verizon',
        '311-390': 'Verizon',
        '311-480': 'Verizon',
        '311-481': 'Verizon',
        '311-482': 'Verizon',
        '311-483': 'Verizon',
        '311-484': 'Verizon',
        '311-485': 'Verizon',
        '311-486': 'Verizon',
        '311-487': 'Verizon',
        '311-488': 'Verizon',
        '311-489': 'Verizon',
        '310-590': 'Verizon',
        '310-890': 'Verizon',
        '310-910': 'Verizon',
        '310-120': 'Sprint',
        '310-850': 'Aeris Comm. Inc.',
        '310-510': 'Airtel Wireless LLC',
        '312-090': 'Allied Wireless Communications Corporation',
        '310-710': 'Arctic Slope Telephone Association Cooperative Inc.',
        '311-440': 'Bluegrass Wireless LLC',
        '311-800': 'Bluegrass Wireless LLC',
        '311-810': 'Bluegrass Wireless LLC',
        '310-900': 'Cable & Communications Corp.',
        '311-590': 'California RSA No. 3 Limited Partnership',
        '311-500': 'Cambridge Telephone Company Inc.',
        '310-830': 'Caprock Cellular Ltd.',
        '312-270': 'Cellular Network Partnership LLC',
        '312-280': 'Cellular Network Partnership LLC',
        '310-360': 'Cellular Network Partnership LLC',
        '311-120': 'Choice Phone LLC',
        '310-480': 'Choice Phone LLC',
        '310-420': 'Cincinnati Bell Wireless LLC',
        '310-180': 'Cingular Wireless',
        '310-620': 'Coleman County Telco /Trans TX',
        '310-06': 'Consolidated Telcom',
        '310-60': 'Consolidated Telcom',
        '310-700': 'Cross Valliant Cellular Partnership',
        '312-030': 'Cross Wireless Telephone Co.',
        '311-140': 'Cross Wireless Telephone Co.',
        '312-040': 'Custer Telephone Cooperative Inc.',
        '310-440': 'Dobson Cellular Systems',
        '310-990': 'E.N.M.R. Telephone Coop.',
        '312-120': 'East Kentucky Network LLC',
        '312-130': 'East Kentucky Network LLC',
        '310-750': 'East Kentucky Network LLC',
        '310-090': 'Edge Wireless LLC',
        '310-610': 'Elkhart TelCo. / Epic Touch Co.',
        '311-311': 'Farmers',
        '311-460': 'Fisher Wireless Services Inc.',
        '311-370': 'GCI Communication Corp.',
        '310-430': 'GCI Communication Corp.',
        '310-920': 'Get Mobile Inc.',
        '311-340': 'Illinois Valley Cellular RSA 2 Partnership',
        '312-170': 'Iowa RSA No. 2 Limited Partnership',
        '311-410': 'Iowa RSA No. 2 Limited Partnership',
        '310-770': 'Iowa Wireless Services LLC',
        '310-650': 'Jasper',
        '310-870': 'Kaplan Telephone Company Inc.',
        '312-180': 'Keystone Wireless LLC',
        '310-690': 'Keystone Wireless LLC',
        '311-310': 'Lamar County Cellular',
        '310-016': 'Leap Wireless International Inc.',
        '310-040': 'Matanuska Tel. Assn. Inc.',
        '310-780': 'Message Express Co. / Airlink PCS',
        '311-330': 'Michigan Wireless LLC',
        '310-400': 'Minnesota South. Wirel. Co. / Hickory',
        '311-010': 'Missouri RSA No 5 Partnership',
        '312-010': 'Missouri RSA No 5 Partnership',
        '311-020': 'Missouri RSA No 5 Partnership',
        '312-220': 'Missouri RSA No 5 Partnership',
        '311-920': 'Missouri RSA No 5 Partnership',
        '310-350': 'Mohave Cellular LP',
        '310-570': 'MTPCS LLC',
        '310-290': 'NEP Cellcorp Inc.',
        '310-34': 'Nevada Wireless LLC',
        '310-600': 'New-Cell Inc.',
        '311-300': 'Nexus Communications Inc.',
        '310-130': 'North Carolina RSA 3 Cellular Tel. Co.',
        '312-230': 'North Dakota Network Company',
        '311-610': 'North Dakota Network Company',
        '310-450': 'Northeast Colorado Cellular Inc.',
        '311-710': 'Northeast Wireless Networks LLC',
        '310-011': 'Northstar',
        '310-670': 'Northstar',
        '311-420': 'Northwest Missouri Cellular Limited Partnership',
        '310-760': 'Panhandle Telephone Cooperative Inc.',
        '310-580': 'PCS ONE',
        '311-170': 'PetroCom',
        '311-670': 'Pine Belt Cellular, Inc.',
        '310-100': 'Plateau Telecommunications Inc.',
        '310-940': 'Poka Lambro Telco Ltd.',
        '310-500': 'Public Service Cellular Inc.',
        '312-160': 'RSA 1 Limited Partnership',
        '311-430': 'RSA 1 Limited Partnership',
        '311-350': 'Sagebrush Cellular Inc.',
        '310-46': 'SIMMETRY',
        '311-260': 'SLO Cellular Inc / Cellular One of San Luis',
        '310-320': 'Smith Bagley Inc.',
        '316-011': 'Southern Communications Services Inc.',
        '310-740': 'Telemetrix Inc.',
        '310-14': 'Testing',
        '310-860': 'Texas RSA 15B2 Limited Partnership',
        '311-050': 'Thumb Cellular Limited Partnership',
        '311-830': 'Thumb Cellular Limited Partnership',
        '310-460': 'TMP Corporation',
        '310-490': 'Triton PCS',
        '312-290': 'Uintah Basin Electronics Telecommunications Inc.',
        '311-860': 'Uintah Basin Electronics Telecommunications Inc.',
        '310-960': 'Uintah Basin Electronics Telecommunications Inc.',
        '310-020': 'Union Telephone Co.',
        '311-220': 'United States Cellular Corp.',
        '310-730': 'United States Cellular Corp.',
        '311-650': 'United Wireless Communications Inc.',
        '310-003': 'Unknown',
        '310-15': 'Unknown',
        '310-23': 'Unknown',
        '310-24': 'Unknown',
        '310-25': 'Unknown',
        '310-26': 'Unknown',
        '310-190': 'Unknown',
        '310-950': 'Unknown',
        '310-38': 'USA 3650 AT&T',
        '310-999': 'Various Networks',
        '310-520': 'VeriSign',
        '310-530': 'West Virginia Wireless',
        '310-340': 'Westlink Communications, LLC',
        '311-070': 'Wisconsin RSA #7 Limited Partnership',
        '310-390': 'Yorkville Telephone Cooperative',
        //英国运营商 UK
        '234-08': 'BT OnePhone UK',
        '234-10': 'O2-UK',
        '234-15': 'vodafone UK',
        '234-20': '3',
        '234-30': 'EE',
        '234-33': 'EE',
        '234-38': 'Virgin',
        '234-50': 'JT',
        '234-55': 'Sure',
        '234-58': 'Manx Telecom',
        //菲律宾运营商 Philippine
        '515-01': 'Islacom',
        '515-02': 'Globe',
        '515-03': 'Smart',
        '515-04': 'Sun',
        '515-08': 'Next Mobile',
        '515-18': 'Cure',
        '515-24': 'ABS-CBN',
        //越南运营商 Vietnam
        '452-01': 'Mobifone',
        '452-02': 'VinaPhone',
        '452-03': 'S-Fone',
        '452-04': 'Viettel',
        '452-05': 'VietNamobile',
        '452-06': 'E-mobile',
        '452-07': 'Gmobile',
    };
}

//获取手机运营商信息(通过内置的 API 调用设备信息)
function getCellularInfo() {
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

    let cellularInfo = '';
    const carrierNames = loadCarrierNames();
    if ($network['cellular-data']) {
        const carrierId = $network['cellular-data'].carrier;
        const radio = $network['cellular-data'].radio;
        if ($network.wifi?.ssid == null && radio) {
            cellularInfo = carrierNames[carrierId] ?
                `${carrierNames[carrierId]} | ${radioGeneration[radio]} - ${radio} ` :
                `中国移动 ${radioGeneration[radio]}`;
        }
    }
    return cellularInfo;
}

function getSSID() {
    return $network.wifi?.ssid;
}

function getIP() {
    const { v4, v6 } = $network;
    let info = [];
    if (!v4 && !v6) {
        info = ['网路可能切换', '请手动刷新以重新获取 IP'];
    } else {
        if (v4?.primaryAddress) info.push(`本机IP : ${v4?.primaryAddress}`);
        //if (v6?.primaryAddress) info.push(`v6 @ ${v6?.primaryAddress}`);
        if (v4?.primaryRouter && getSSID()) info.push(`路由器 : ${v4?.primaryRouter}`);
        //if (v6?.primaryRouter && getSSID()) info.push(`Router IPv6 @ ${v6?.primaryRouter}`);
    }
    info = info.join("\n");
    return info + "\n";
}


// 获取网络信息
function getNetworkInfo() {

    if (!TokenOfIPinfo) {
        cookieUrl = 'https://ipinfo.io/account/home'
        errorHandling(new Error("请在BoxJS订阅中填入正确的Ipinfo Token"))
    }

    // 发送网络请求
    httpMethod.get(`https://ipinfo.io/json?token=${TokenOfIPinfo}`).then(response => {
        if (Number(response.status) != 200) {
            cookieUrl = 'https://ipinfo.io/account/home'
            throw new Error(`调用ipinfo.io发生错误，错误代码 ${response.status}`);
        }
        const info = JSON.parse(response.data);
        const orgValue = info.org;
        info.org = info.org.replace(/^AS\d+\s*/, '');
        if (info.country == 'US' || info.country == 'CN') {
          if (info.region == info.city) {

          }
          else {
            info.country = info.region
          }
        }

        checkIpRisk(info.ip).then((ipInfo) => {

            const riskMapping = {
                'very high': '非常高',
                'high': '高',
                'medium': '中',
                'low': '低'
            };

            const ipRisk = riskMapping[ipInfo.risk] || 'Unknown';

            if (VPSIPsOfDmit.indexOf(info.ip) > -1 || VPSIPsOfSolaDrive.indexOf(info.ip) > -1) {
                getVPSInfo(info.ip).then((value) => {
                    $done({
                        title: getSSID() ?? getCellularInfo(),
                        content: getIP() +
                            `节点IP : ${info.ip} (${ipInfo.score}分|${ipRisk}风险)\n` +
                            `流　量 :${value.used} /${value.total} (${getRmainingDays(value.nextCycle)}天)\n` +
                            `供应商 : ${info.org} (${ipInfo.userType})\n` +
                            `位　置 : ${info.city}, ${info.country}`,
                        icon: getSSID() ? 'wifi' : 'simcard',
                        'icon-color': getSSID() ? '#005CAF' : '#005CAF',
                    });
                }).catch((error) => {
                    errorHandling(error)
                });
            } else {
                $done({
                    title: getSSID() ?? getCellularInfo(),
                    content: getIP() +
                        `节点IP : ${info.ip} (${ipInfo.score}分|${ipRisk}风险)\n` +
                        `供应商 : ${info.org} (${ipInfo.userType})\n` +
                        `位　置 : ${info.city}, ${info.country}`,
                    icon: getSSID() ? 'wifi' : 'simcard',
                    'icon-color': getSSID() ? '#005CAF' : '#005CAF',
                });
            }
        }).catch((error) => {
            errorHandling(error)
        });
    }).catch(error => {
        cookieUrl = 'https://ipinfo.io/account/home'
        errorHandling(error)
    });
}

function errorHandling(error) {
    // 网络切换
    if (String(error).startsWith("Network changed")) {
        if (getSSID()) {
            $network.wifi = undefined;
            $network.v4 = undefined;
            $network.v6 = undefined;
        }
    }

    if (retryCount === 0) {
        if (error.message) {
            if (cookieUrl) {
                if (cookieUrl.includes('ipinfo.io')) {
                    $vader.notify("发生错误 ‼️", `点击重新获取IPInfo Token`, error.message, {
                        "media-url": "https://cdn.ipinfo.io/static/deviceicons/android-icon-192x192.png",
                        "action": "open-url",
                        "url": cookieUrl,
                        "auto-dismiss": 10
                    })
                } else if (cookieUrl.includes('scamalytics.com')) {
                    $vader.notify("发生错误 ‼️", `点击重新获取Scamalytics API密钥`, error.message, {
                        "media-url": "https://scamalytics.com/wp-content/uploads/2016/06/icon_128.png",
                        "action": "open-url",
                        "url": cookieUrl,
                        "auto-dismiss": 10
                    })
                } else if (cookieUrl.includes('pixelscan.net')) {
                    $vader.notify("发生错误 ‼️", `点击重新获取Pixelscan API密钥`, error.message, {
                        "media-url": "https://pixelscan.net/assets/apple-touch-icon.png?v=2",
                        "action": "open-url",
                        "url": cookieUrl,
                        "auto-dismiss": 10
                    })
                } else if (cookieUrl.includes('dmit.io')) {
                    $vader.notify("发生错误 ‼️", `点击重新获取Dmit Cookie`, error.message, {
                        "media-url": "https://raw.githubusercontent.com/mabinglei/Script/refs/heads/main/dmit_logo.png",
                        "action": "open-url",
                        "url": cookieUrl,
                        "auto-dismiss": 10
                    })
                } else if (cookieUrl.includes('soladrive.com')) {
                    $vader.notify("发生错误 ‼️", `点击重新获取SolaDrive Cookie`, error.message, {
                        "media-url": "https://www.soladrive.com/wp-content/uploads/2023/04/cropped-faviconlatest-192x192.png",
                        "action": "open-url",
                        "url": cookieUrl,
                        "auto-dismiss": 10
                    })
                } else {
                    $vader.notify("发生错误 ‼️", `点击重新获取${cookieUrl} API密钥`, error.message, {
                        "action": "open-url",
                        "url": cookieUrl,
                        "auto-dismiss": 10
                    })
                }
            }
            logger.error(error);
            $done({
                title: '发生错误 ‼️',
                content: `${error.message}`,
                icon: 'wifi.exclamationmark',
                'icon-color': '#CB1B45',
            });
        }
        $done({
            title: '发生错误 ‼️',
            content: '未知错误',
            icon: 'wifi.exclamationmark',
            'icon-color': '#CB1B45',
        });
    }
    retryCount--
    console.log(`第${3-retryCount}次尝试`)
    getNetworkInfo();
}

function getVPSInfo(ip) {

    if (VPSIPsOfDmit.indexOf(ip) > -1) {

        return new Promise((resolve, reject) => {

            const id = VPSIDsOfDmit[VPSIPsOfDmit.indexOf(ip)]

            if (!id) {
                reject(new Error(`请检查BoxJS订阅中的DMIT参数配置是否正确`));
            }

            if (!CookieValOfDmit) {
                cookieUrl = 'https://www.dmit.io/clientarea.php'
                reject(new Error(`请先获取DMIT Cookie`));
            }

            const opts = {
                url: `https://www.dmit.io/clientarea.php?action=productdetails&id=${id}&json=1&pure=1&page=standard&subaction=whmcsdetail`,
                headers: {
                    'Cookie': CookieValOfDmit,
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15'
                },
            }

            $httpClient.get(opts, function(error, response, data) {

                if (error || Number(response.status) !== 200) {
                    const errorMessage = error 
                        ? `获取DMIT主机信息时发生错误,错误原因 ${error.message}` 
                        : `获取DMIT主机信息时发生错误,错误代码 ${response.status}`;
                    cookieUrl = 'https://www.dmit.io/clientarea.php'
                    reject(new Error(errorMessage));
                }

                try {
                    const info = JSON.parse(data);
                    if (info.result === "success") {
                        const used = ` ${(info.success.bwusage / 1024).toFixed(2)} GB`;
                        const total = ` ${(info.success.bwlimit / 1024).toFixed(2)} GB`;
                        const date = new Date(info.success.nextduedate);
                        const nextCycle = date.getDate();
                        resolve({ used, total, nextCycle });
                    } else {
                        cookieUrl = 'https://www.dmit.io/clientarea.php'
                        reject(new Error(`www.dmit.io返回的JSON无效`));
                    }
                } catch (error) {
                    cookieUrl = 'https://www.dmit.io/clientarea.php'
                    reject(new Error(`解析www.dmit.io返回的JSON时发生错误: ${error.message}`));
                }

            })
        });
    }

    if (VPSIPsOfSolaDrive.indexOf(ip) > -1) {

        return new Promise((resolve, reject) => {

            const id = VPSIDsOfSolaDrive[VPSIPsOfSolaDrive.indexOf(ip)]

            const day = VPSResetDayOfSolaDrive[VPSIPsOfSolaDrive.indexOf(ip)]

            if (!id) {
                reject(new Error(`请检查BoxJS订阅中的SolaDrive参数配置是否正确`));
            }

            if (!CookieValOfSolaDrive) {
                cookieUrl = 'https://www.soladrive.com/support/clientarea.php'
                reject(new Error(`请先获取SolaDrive Cookie`));
            }

            const opts = {
                url: `https://www.soladrive.com/support/modules/servers/solusvmpro/get_client_data.php?vserverid=${id}`,
                headers: {
                    'Cookie': CookieValOfSolaDrive,
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15'
                },
            }

            $httpClient.get(opts, function(error, response, data) {

                if (error || Number(response.status) !== 200) {
                    const errorMessage = error 
                        ? `获取SolaDrive主机信息时发生错误,错误原因 ${error.message}` 
                        : `获取SolaDrive主机信息时发生错误,错误代码 ${response.status}`;
                    cookieUrl = 'https://www.soladrive.com/support/clientarea.php'
                    reject(new Error(errorMessage));
                }

                try {
                    const info = JSON.parse(data);
                    if (info.status === "error") {
                        cookieUrl = 'https://www.soladrive.com/support/clientarea.php'
                        reject(new Error(info.displaystatus));
                    } else {
                        const used = ` ${info.bandwidthused}`;
                        const total = ` ${info.bandwidthtotal}`;
                        const nextCycle = Number(day);
                        resolve({ used, total, nextCycle });
                    }
                } catch (error) {
                    cookieUrl = 'https://www.soladrive.com/support/clientarea.php'
                    reject(new Error(`解析www.soladrive.com返回的JSON时发生错误: ${error.message}`));
                }

            })
        });
    }

}

function checkIpRisk(ip) {

    const ipRisk = new Promise((resolve, reject) => {

        if (!UsernameOfScamalytics || !APIKeyOfScamalytics) {
            cookieUrl = 'https://scamalytics.com'
            reject(new Error(`请检查BoxJS订阅中的Scamalytics参数配置是否正确`));
        }

        const opts = {
            url: `https://api11.scamalytics.com/${UsernameOfScamalytics}/?key=${APIKeyOfScamalytics}&ip=${ip}&test=0`,
            headers: {
                'Accept': 'application/json',
            },
        };

        $httpClient.get(opts, function(error, response, data) {

            if (error || Number(response.status) !== 200) {
                const errorMessage = error 
                    ? `调用Scamalytics接口时发生错误,错误原因 ${error.message}` 
                    : `调用Scamalytics接口时发生错误,错误代码 ${response.status}`;
                cookieUrl = 'https://scamalytics.com'
                reject(new Error(errorMessage));
            }

            try {
                const info = JSON.parse(data);
                const ipInfo = { score: info.score, risk: info.risk };
                resolve(ipInfo);
            } catch (parseError) {
                cookieUrl = 'https://scamalytics.com'
                reject(new Error(`解析Scamalytics返回的JSON时发生错误: ${parseError.message}`));
            }

        });

    });

    const ipType = new Promise((resolve, reject) => {

        const opts = {
            url: `https://pixelscan.net/s/api/ci`,
            headers: {
                'Accept': 'application/json',
            },
        };

        $httpClient.post(opts, function(error, response, data) {

            if (error || Number(response.status) !== 200) {
                const errorMessage = error 
                    ? `调用pixelscan.net接口时发生错误,错误原因 ${error.message}` 
                    : `调用pixelscan.net接口时发生错误,错误代码 ${response.status}`;
                cookieUrl = 'https://pixelscan.net'
                reject(new Error(errorMessage));
            }

            try {
                const info = JSON.parse(data);
                const userTypeMap = {
                    'N/A': '机房',
                    'Internet Hosting Services': '机房',
                    'residential': '住宅',
                    'Telecommunications': '电信',
                    'Internet Service Provider': 'ISP'
                };
                const type = userTypeMap[info.value.userType] || info.value.userType;
                const userType = { userType: type };
                resolve(userType);
            } catch (parseError) {
                cookieUrl = 'https://pixelscan.net'
                reject(new Error(`解析pixelscan.net返回的JSON时发生错误: ${parseError.message}`));
            }

        });
    });

    return Promise.all([ipRisk, ipType])
        .then(results => {
            const [ipRisk, userType] = results;
            return {
                ...ipRisk,
                ...userType
            };
        }).catch(error => {
            errorHandling(error)
        });
}

function getRmainingDays(resetDay) {
    if (!resetDay) return 'Unknown';

    const now = new Date();
    const today = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();
    let daysInMonth;

    if (resetDay > today) {
        daysInMonth = 0;
    } else {
        daysInMonth = new Date(year, month + 1, 0).getDate();
    }

    return daysInMonth - today + resetDay;
}

/**
 * 程序入口
 */
const logger = new loggerUtil();
const $vader = vader();
const TokenOfIPinfo = $vader.read("TokenIPinfo");
const UsernameOfScamalytics = $vader.read("UsernameScamalytics");
const APIKeyOfScamalytics = $vader.read("APIKeyScamalytics");
const VPSIDsOfDmit = $vader.read("VPSIDsDmit").split(",");
const VPSIPsOfDmit = $vader.read("VPSIPsDmit").split(",");
const CookieValOfDmit = $vader.read("CookieDmit");
const VPSIDsOfSolaDrive = $vader.read("VPSIDsSolaDrive").split(",");
const VPSIPsOfSolaDrive = $vader.read("VPSIPsSolaDrive").split(",");
const VPSResetDayOfSolaDrive = $vader.read("VPSResetDaySolaDrive").split(",");
const CookieValOfSolaDrive = $vader.read("CookieSolaDrive");
let retryCount = 3;
let cookieUrl = null;

if ($vader.isRequest) {
    getCookie()
} else {
    (() => {
        getNetworkInfo();
    })();
}
