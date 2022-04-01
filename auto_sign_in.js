const url = "https://h5.xiaofubao.com/marketing/health/doDetail";
const method = "POST";
const headers = {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"};
const data = {"schoolCode=10681&schoolName=%E4%BA%91%E5%8D%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6&identityType=1&userId=2009211656237844100&mobilePhone=18313981216&name=%E9%A9%AC%E4%B8%99%E7%A3%8A&jobNo=2043205000073&departmentCode=2103342845888250544&department=%E4%BF%A1%E6%81%AF%E5%AD%A6%E9%99%A2&specialitiesCode=2103342845888250562&specialities=%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%B1%BB&classCode=2103342845888250567&className=%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%B1%BB20A&provinceCode=86053&province=%E4%BA%91%E5%8D%97%E7%9C%81&cityCode=8605301&city=%E6%98%86%E6%98%8E%E5%B8%82&inSchool=0&contactArea=1&isPatient=1&contactPatient=1&linkPhone=18313981216&parentsPhone=13888631949&createTime=2021-03-12+08%3A31%3A34&createDate=2021-03-12+00%3A00%3A00&updateTime=2022-03-30+08%3A00%3A02&locationInfo=%E4%BA%91%E5%8D%97%E7%9C%81%E6%98%86%E6%98%8E%E5%B8%82%E5%91%88%E8%B4%A1%E5%8C%BA%E5%90%B4%E5%AE%B6%E8%90%A5%E8%A1%97%E9%81%93%E6%A2%81%E7%8E%8B%E8%B7%AF%E6%96%87%E8%81%9A%E5%85%AC%E5%AF%93&longitudeAndLatitude=102.862190483941%2C24.86162679036458&isSuspected=1&healthStatusNew=1&identitySecondType=11&districtCode=860530114&district=%E5%91%88%E8%B4%A1%E5%8C%BA&isFamiliyPatient=1&isCommunityPatient=1&isTodayBack=1&backWay=&backRemark=&backProvinceCode=&backProvince=&backCityCode=&backCity=&backDistrictCode=&backDistrict=&patientHospital=&isolatedPlace=&country=&vaccineStatus=3&vaccineOneTime=2021-04-29&vaccineTwoTime=2021-06-16&vaccineThreeTime=2021-12-13&deviceId=11A075E8-CF7F-4FF3-B106-A00A364FA35B&address=%E4%BA%91%E5%8D%97%E7%9C%81%E6%98%86%E6%98%8E%E5%B8%82%E5%91%88%E8%B4%A1%E5%8C%BA&backWayName=&backAddress=&temperature=36.7&isInCompany=&token=&uuToken=mAvG7SyO7gCN5pCCK18NpfzRipuOIr1%2FAdXY2i%2FiStoj7aSiPhlgWTX5kfPwcuTfqZDvB%2BKcrCoiSFVR277aUA%3D%3D&loginUserId=2009211656237844100&loginUserName=%E9%A9%AC%E4%B8%99%E7%A3%8A&loginSchoolCode=10681&loginSchoolName=%E4%BA%91%E5%8D%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6&platform=YUNMA_APP"};

const myRequest = {
    url: url,
    method: method, // Optional, default GET.
    headers: headers, // Optional.
    body: data // Optional.
};

$task.fetch(myRequest).then(response => {
    // response.statusCode, response.headers, response.body
    console.log(response.body);
    $notify("打卡成功", "", response.body); // Success!
    $done();
}, reason => {
    // reason.error
    $notify("打卡失败", "", reason.error); // Error!
    $done();
});
