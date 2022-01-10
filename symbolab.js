var body = $response.body;
var obj = JSON.parse(body);
obj= {
 "valid": true,
 "newlyAssociated": true
};
body = JSON.stringify(obj);
$done(body);
