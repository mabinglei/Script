[rewrite_local]

# keep 修改时间
^https:\/\/api\.gotokeep\.com\/snooker\/v5\/training-detail\/\S url script-response-body https://raw.githubusercontent.com/mabinglei183/Script/main/keep.js

[mitm] 

hostname = api.gotokeep.com


var obj = JSON.parse($response.body);

obj.data.cardList.data.logInfo.duration=1234;
obj.data.cardList.data.logInfo.calorie=43;
obj.data.cardList.data.caloriePercentage=99.936170212765958;

$done({body: JSON.stringify(obj)});
