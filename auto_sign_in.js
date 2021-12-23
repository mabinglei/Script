
/**
 * @fileoverview Example to compose HTTP request
 * and handle the response.
 *
 */

const get_url = "https://h5.xiaofubao.com/marketing/health/getDetail";
const method = "POST";
const headers = {"Cookie": "shiroJID=2c0d1c4a-a5ef-4215-b213-55f96e941e7a"};
const data1 = "userId=2009211656237844100";
const data={"address" : "云南省昆明市呈贡区吴家营街道梁王路文聚公寓",
        "uuToken" : "PpVA8ejkbx44YENMEgf6BWVT/H8b6e68Fld47CWd/OP+osCumDnYrJ/7KwNFIl2etvzy4mtPgr7oot4j9TMaag==",
        "loginUserId" : "2009211656237844100",
        "loginSchoolCode" : "10681",
        "loginSchoolName" : "云南师范大学",
        "temperature" : "36.8",
        "locationInfo" : "云南省昆明市呈贡区吴家营街道梁王路文聚公寓",
        "longitudeAndLatitude" : "102.8623459201389,24.86153618706597",
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
        'country':''}


const getRequest = {
    url: get_url,
    method: method, // Optional, default GET.
    headers: headers, // Optional.
    body: data1 // Optional.
};

$task.fetch(getRequest).then(response => {
    // response.statusCode, response.headers, response.body
    console.log(${response.body.data});
    $notify("Title", "Subtitle", response.body); // Success!
    $done();
}, reason => {
    // reason.error
    $notify("Title", "Subtitle", reason.error); // Error!
    $done();
});
