const get_url = "https://h5.xiaofubao.com/marketing/health/getDetail";
const do_url = "https://h5.xiaofubao.com/marketing/health/doDetail";
const method = "POST";
const headers = {"Content-Type": "application/x-www-form-urlencoded","Cookie": "shiroJID=1f4649f7-78dc-48f0-81e5-797884131ac9","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"};
const data1 = "userId=2009211656237844100";
var do_id=null
const getRequest = {
    url: get_url,
    method: method, // Optional, default GET.
    headers: headers, // Optional.
    body: data1 // Optional.
};

$task.fetch(getRequest).then(response => {
    // response.statusCode, response.headers, response.body
    var getjson=JSON.parse(response.body)
    do_id=getjson.data.id;
    var data = {
        "address" : "云南省昆明市寻甸回族彝族自治县先锋镇138乡道",
        "uuToken" : "PpVA8ejkbx44YENMEgf6BWVT/H8b6e68Fld47CWd/OP+osCumDnYrJ/7KwNFIl2etvzy4mtPgr7oot4j9TMaag==",
        "loginUserId" : "2009211656237844100",
        "loginSchoolCode" : "10681",
        "loginSchoolName" : "云南师范大学",
        "temperature" : "36.8",
        "locationInfo" : "云南省昆明市寻甸回族彝族自治县先锋镇138乡道",
        "longitudeAndLatitude" : "103.0343221028646,25.49524603949653",
        'id': null,
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
        'locationInfo':'云南省昆明市寻甸回族彝族自治县先锋镇138乡道',
        'longitudeAndLatitude':'103.0343221028646,25.49524603949653',
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
        }
    data.id = do_id+"";
    const doRequest = {
    url: do_url,
    method: method, // Optional, default GET.
    headers: headers, // Optional.
    body: JSON.stringify(data)
};
$task.fetch(doRequest).then(response => {
    // response.statusCode, response.headers, response.body
    var dobody = JSON.parse(response.body);
    var success = dobody.success;
    console.log(response.body);
    if(success=="true"){
    $notify("打卡成功", "", response.body); // Success!
    $done();
    }
}, reason => {
    // reason.error
    $notify("打卡失败", "", reason.error); // Error!
    $done();
});
$done();
}, reason => {
    // reason.error
    $notify("Title","获取用户表单ID失败",reason.error); // Error!
    $done();
});
