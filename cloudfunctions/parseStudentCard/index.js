const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event, context) => {
  try {
    let fileID = event.fileID;
    let res = await cloud.downloadFile({
      fileID: fileID,
    });
    let buffer = res.fileContent;
    console.log(res.fileContent);
    let result = await cloud.openapi.ocr.printedText({
      type: 'photo',
      img: {
        contentType: 'image/jpg',
        value: buffer
      }
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}