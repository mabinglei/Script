var obj = JSON.parse($response.body);

obj.data.cardList[1].data.logInfo.duration=1234;
obj.data.cardList[1].data.logInfo.durationPercentage=99.317460317460316;
obj.data.cardList[1].data.logInfo.calorie=43;
obj.data.cardList[1].data.logInfo.caloriePercentage=99.936170212765958;

$done({body: JSON.stringify(obj)});
