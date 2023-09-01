const axios = require("axios");
var kucun102,
  price102,
  kucun103,
  price103,
  kucun23,
  price23,
  sum,
  lastsum,
  pretext;

function weidian() {
  var options = {
    method: "GET",
    url: "https://thor.weidian.com/detail/getItemSkuInfo/1.0",
    params: {
      param: '{"itemId":"6470112319"}',
      wdtoken: "817ed4f1",
      _: "1693530747443",
    },
    headers: {
      Cookie:
        "__spider__visitorid=c27d5f47705e4e04; visitor_id=13e2763a-516a-47a7-becb-49a73595277b; login_token=_EwWqqVIQC8ak3BlmQZmQoAKXwwcIzgyJn4dW1OAKWrrzbshtDE4TjwRj3BUITfRnxiJTwISRvtjP-Wke9gPIH2B3lcX4PCODJTruat65C_OwYXjoKy8GfHtAZTseg87I4sGKPchF3sw0q1PEBGQQ06Ccb6-0q6FzfaOGBZ4KisuAYE485HE-gWlpz-KAcgeMfOBXSM1BLya9RYiDsdVxClOx0JLa-Uw7NdAX2jqd1VYOXs3s7ZzF02dp4FymJodBGLTI7iSM; is_login=true; login_type=LOGIN_USER_TYPE_MASTER; login_source=LOGIN_USER_SOURCE_MASTER; uid=1780057383; duid=1780057383; sid=1710706657; wdtoken=817ed4f1; v-components/tencent-live-plugin@wfr=c_wxh5; __spider__sessionid=f84899b6d6a03998; v-components/clean-up-advert@private_domain=967587296; v-components/clean-up-advert@wx_app=967587296",
      "Content-Type": "application/json, */*",
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/116.0.0.0",
    },
  };
  axios
    .request(options)
    .then(function (res) {
      if (
        res.data.status.message != "OK" ||
        res.data.status.description != "成功"
      ) {
        console.log(Date(), "res出现异常");
        pushERRmsg("微店爬取数据出现问题：" + res.data);
      } else {
        kucun102 = res.data.result.skuInfos[1].skuInfo.stock;
        kucun103 = res.data.result.skuInfos[3].skuInfo.stock;
        kucun23 = res.data.result.skuInfos[4].skuInfo.stock;
        console.log(Date(), kucun102, kucun103, kucun23, "爬虫执行结束");
        logging();
        var date = new Date();
        if (date.getHours() != 22) {
          pushmsg()
        } else {
          console.log(Date(), "没到点 " + date.getHours() + "，不推送");
        }
      }
    })
    .catch(function (error) {
      console.error("错误！！！！！" + error);
    });
}

function pushmsg() {
  sum = kucun102 + kucun103 + kucun23;
  if (sum != lastsum) {
    pretext = "[余票变动] ";
    console.log(Date(), "余票变动");
  } else {
    pretext = "";
  }
  lastsum = sum;
  axios
    .post("https://www.pushplus.plus/send/23c40cae871449a99d57a356efa57afc", {
      title: "余票提醒",
      content:
        pretext +
        "10.2余票" +
        kucun102 +
        "，10.3余票" +
        kucun103 +
        "，通票余票" +
        kucun23 +
        "，历史余票信息：https://xingchao.dabaostudio.xyz/",
      topic: "testxingchaogrp",
    })
    .then((res) => {
      if (res.data.code == 200) {
        console.log(Date(), "推送成功");
      } else {
        console.warn(Date(), "群组推送失败！" + res.data);
        pushERRmsg("群组推送失败！" + res.data);
      }
    });
}

function pushERRmsg(res) {
  axios
    .post("https://www.pushplus.plus/send/23c40cae871449a99d57a356efa57afc", {
      title: "出现错误",
      content: res,
    })
    .then((res) => {
      if (res.data.code == 200) {
        console.log(Date(), "推送成功");
      } else {
        console.log(Date(), "推送失败！res.data.code!=200");
      }
    });
}

function logging() {
  axios
    .post("http://127.0.0.1:9333/api/log", {
      yp102: kucun102,
      yp103: kucun103,
      yp1020103: kucun23,
      price102: price102,
      price103: price103,
      price1020103: price23,
    })
    .then((res) => {
      if (res.data == "ok") {
        console.log(Date(), "记录历史余票log成功");
      } else {
        console.log(Date(), "记录历史余票log失败！！！" + res.data);
      }
    })
    .catch((err) => {
      console.warn(Date(), "send log err" + err);
    });
}

function getdata() {
  weidian();
  setTimeout(() => {
    getdata();
  }, 10 * 60000); //min
}

function main() {
  getdata();
}

main();
