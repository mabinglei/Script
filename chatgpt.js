let obj = JSON.parse($response.body);

obj.accounts.default.account.has_previously_paid_subscription = true
obj.accounts.default.account.processor = {
          "a001" : {
            "has_customer_object" : true
          },
          "b001" : {
            "has_transaction_history" : true
          }
        }

obj.accounts.default.entitlement = {
        "expires_at" : "2029-05-26T05:05:04Z",
        "subscription_id" : null,
        "subscription_plan" : "chatgptplusplan",
        "has_active_subscription" : true
      },
  
obj.accounts.default.last_active_subscription = {
        "subscription_id" : null,
        "will_renew" : true,
        "purchase_origin_platform" : "openai"
      }

body = JSON.stringify(obj);
$done({body});


// let obj = JSON.parse($response.body);
// obj.data.hsjcsj=getTime();
// obj.data.hsjcjgmc="云南迪安医学检验所有限公司"
// obj.data.inDay7=true
// obj.data.inDay14=true

// function getTime() {
//   let now = new Date();
//   let today = now.getDate();
//   let month = now.getMonth();
//   let year = now.getFullYear();
//   return year + "-" + (month+1) + "-" + today + " " + "08:15:30"
// }

// $done({body: JSON.stringify(obj)});
// // {
// //   "errcode": 0,
// //   "errmsg": "SUCCESS",
// //   "data": {
// //     "hsjcjg": "阴性",
// //     "hsjcsj": "2022-10-15 12:15:40",
// //     "zjhm": "53**************12",
// //     "hsjcjgmc": "寻甸县第一人民医院",
// //     "hsjcjq": "阴性",
// //     "xm": "马*磊",
// //     "inDay7": true,
// //     "inDay14": true
// //   }
// // }
