const qiniu = require('qiniu');
const QiniuManager = require('./src/utils/QiniuManger');

const accessKey = 'BlnuOxk3_CHut9QpVh7eSxaCd8MaUIWmg6Funz9x';
const secretKey = 'wfkja6ayTr7zwX5vKjj3Dt_42xsRq4LWFjaGBeNf';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const localFile = "/Users/hzm/Desktop/哈哈.md";
const key = '哈哈.md';

const manger = new QiniuManager(accessKey, secretKey, 'electron-mk');
// manger.uploadFile(key, localFile).then(res => {
//   console.log({ res})
// });
// manger.getBucketDomain().then(res => {
//   console.log(res)
// });
manger.generateDownloadLink(key).then((data) => {
  console.log(data);
})

// // 上传凭证
// const options = {
//   scope: 'electron-mk',
// };
// const putPolicy = new qiniu.rs.PutPolicy(options);
// const uploadToken = putPolicy.uploadToken(mac);
//
// // 服务器直传配置
// const config = new qiniu.conf.Config();
// // 空间对应的机房
// config.zone = qiniu.zone.Zone_z0;
// // 是否使用https域名
// //config.useHttpsDomain = true;
// // 上传是否使用cdn加速
// //config.useCdnDomain = true;
//
// // 文件上传
// const localFile = "/Users/hzm/Desktop/哈哈.md";
// const formUploader = new qiniu.form_up.FormUploader(config);
// const putExtra = new qiniu.form_up.PutExtra();
// const key = '哈哈.md';
// // 文件上传
// // formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr,
// //                                                                       respBody, respInfo) {
// //   if (respErr) {
// //     throw respErr;
// //   }
// //
// //   if (respInfo.statusCode === 200) {
// //     console.log(respBody);
// //   } else {
// //     console.log(respInfo.statusCode);
// //     console.log(respBody);
// //   }
// // });
//
// // 文件下载
// const bucketManager = new qiniu.rs.BucketManager(mac, config);
// const publicBucketDomain = 'http://qbwkd71l9.bkt.clouddn.com';
// // 公开空间访问链接
// const publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, key);
// console.log(publicDownloadUrl);
