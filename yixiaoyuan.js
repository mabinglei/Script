var requests = require('requests');
from requests.api var head = require('head');

function nobyda() {
    const isSurge = typeof $httpClient != "undefined";
    const isQuanX = typeof $task != "undefined";
    const isNode = typeof require == "function";
    const node = (() => {
        if (isNode) {
            const request = require('request');
            return {
                request
            }
        } else {
            return null;
        }
    })()
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
    this.read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    this.notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
        if (isNode) console.log(`${title}\n${subtitle}\n${message}`)
    }
    this.post = (options, callback) => {
        options.headers['User-Agent'] = 'User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 13_6_1 like Mac OS X) AppleWebKit/609.3.5.0.2 (KHTML, like Gecko) Mobile/17G80 BiliApp/822 mobi_app/ios_comic channel/AppStore BiliComic/822'
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
            options.headers['X-Surge-Skip-Scripting'] = false
            $httpClient.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
        if (isNode) {
            node.request.post(options, (error, response, body) => {
                callback(error, adapterStatus(response), body)
            })
        }
    }
    this.done = () => {
        if (isQuanX || isSurge) {
            $done()
        }
    }
};

let $ = new nobyda();

function DoDetail(json) {
    // 输入打卡信息
    data = json;
    // 添加打卡信息
    data['address'] = '云南省昆明市呈贡区吴家营街道梁王路文聚公寓';
    // 填写Tokan信息
    data['uuToken'] = 'PpVA8ejkbx44YENMEgf6BWVT/H8b6e68Fld47CWd/OP+osCumDnYrJ/7KwNFIl2etvzy4mtPgr7oot4j9TMaag==';
    // 填写Userid
    data['loginUserId'] = '2009211656237844100';
    // 填写学校id
    data['loginSchoolCode'] = '10681';
    // 填写学校名称
    data['loginSchoolName'] = '云南师范大学';
    // 填写体温信息
    data['temperature'] = '36.8';
    // 填写打卡地址
    data['locationInfo'] = '云南省昆明市呈贡区吴家营街道梁王路文聚公寓';
    // 填写经纬度信息
    data['longitudeAndLatitude'] = '102.8623459201389,24.86153618706597';
    requests.packages.urllib3.disable_warnings();
    // 请求易校园接口
    response = requests.post(
        'https://h5.xiaofubao.com/marketing/health/doDetail', headers=headers, data=data, verify=false);
    return response.json();
}
    // 获取userid


function GetDetail(userid) {
    data1 = {'userId': userid};
    requests.packages.urllib3.disable_warnings();
    response = requests.post(
        'https://h5.xiaofubao.com/marketing/health/getDetail', headers=headers, data=data1, verify=false);
    return response.json();
}
    // 伪造请求头
if (__name__ == '__main__') {
    headers = {'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Html5Plus/1.0 (Immersed/44)  (Immersed/44) WKWebview ZJYXYwebviewbroswer ZJYXYIphone tourCustomer /yunmaapp.NET/2.4.4/11A075E8-CF7F-4FF3-B106-A00A364FA35B',
               'Cookie': 'shiroJID=2c0d1c4a-a5ef-4215-b213-55f96e941e7a'};
            //    这里改成博客里说明的
}
    data = {    // 这里请删除，更换成你的json值中的data键值对，样式应该如此所示，此处信息已被删除。
        'id':'2112393039770075137',
        'schoolCode':'10681',
        'schoolName':'云南师范大学',
        'identityType':1,
        'userId':'2009211656237844100',
        'mobilePhone':'18313981216',
        'name':'马丙磊',
        'jobNo':'2043205000073',
        'departmentCode':'2103342845888250544',
        'department':'信息学院',
        'specialitiesCode':'2103342845888250562',
        'specialities':'计算机类',
        'classCode':'2103342845888250567',
        'className':'计算机类20A',
        'provinceCode':86053,
        'province':'云南省',
        'cityCode':8605301,
        'city':'昆明市',
        'inSchool':0,
        'contactArea':1,
        'isPatient':1,
        'contactPatient':1,
        'linkPhone':'18313981216',
        'parentsPhone':'13888631949',
        'createTime':'2021-12-09 11:59:28',
        'createDate':'2021-12-09 00:00:00',
        'updateTime':'2021-12-09 11:59:28',
        'locationInfo':'云南省昆明市呈贡区吴家营街道梁王路文聚公寓',
        'longitudeAndLatitude':'102.8623459201389,24.86153618706597',
        'isSuspected':1,
        'healthStatusNew':'1',
        'identitySecondType':'11',
        'districtCode':860530114,
        'district':'呈贡区',
        'isFamiliyPatient':1,
        'isCommunityPatient':1,
        'isTodayBack':1,
        'patientHospital':'',
        'isolatedPlace':'',
        'temperature':'36',
        'country':''
    };

    data['uuToken'] = 'PpVA8ejkbx44YENMEgf6BWVT/H8b6e68Fld47CWd/OP+osCumDnYrJ/7KwNFIl2etvzy4mtPgr7oot4j9TMaag==';
    // 填写Userid

    json = GetDetail('2009211656237844100');

    console.log(json);
    console.log('======================================================================'*2);
    if(json['success'] == true) {
        json = DoDetail(json['data']);
        console.log(json);
    }
    console.log('======================================================================'*2);
if(json['success'] == true) {
    console.log('打卡成功\n');
    $.notify('易校园自动打卡', '', '打卡成功！');
} else {
    console.log('打卡失败\n');
    $.notify('易校园自动打卡', '', '打卡失败！');
}