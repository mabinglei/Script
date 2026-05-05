function getUrl() {
    if ($request.url.indexOf("https://e.dlife.cn/user/loginMiddle") !== -1) {
        const login_url = $request.url.match(/(http.+)&sign/)[1];
        $persistentStore.write(login_url, `china_telecom_loginUrl`);
        $notification.post("写入天翼账号登录URL成功 🎉", "", $request.url, {
            "media-url": "https://raw.githubusercontent.com/anker1209/icon/main/zgdx.png",
            "auto-dismiss": 10
        })
    }
}

function getCookie() {
    const headerCookie = $response.headers["set-cookie"] || $response.headers["Set-Cookie"];
    $persistentStore.write(headerCookie, `china_telecom_cookie`);
    $notification.post("写入天翼账号Cookie成功 🎉", "", $request.url, {
        "media-url": "https://raw.githubusercontent.com/anker1209/icon/main/zgdx.png",
        "auto-dismiss": 10
    })
}

getUrl()
getCookie()
$done();
