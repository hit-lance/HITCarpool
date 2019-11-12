
/**
 * 工具类 util.js
 */
class Util {
  static formatTime(time, now) {
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();

    let date = time.split(" ")[0];
    if (date != "今天" && date != "明天") {
      month = date.split("月")[0]; // 返回月
      day = date.split("月")[1].split("日")[0]; // 返回日
    }
    console.log(year + "/" + month + "/" + day + " " + time.split(" ")[1])
    return year + "/" + month + "/" + day + " " + time.split(" ")[1]
  };

};

module.exports = Util;