const qiniu = require('qiniu');
const axios = require('axios');
const fs = require('fs');

class QiniuManger {
  /**
   * 基本的配置信息
   * @param accessKey {string}
   * @param secretKey {string}
   * @param bucket {string} 存储空间的名称
   */
  constructor(accessKey, secretKey, bucket) {
    this.mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    this.bucket = bucket;
    // 初始化配置
    this.config = new qiniu.conf.Config();
    // 空间对应的机房
    this.config.zone = qiniu.zone.Zone_z0;
    this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);
  }

  /**
   * 文件上传
   * @param key
   * @param localFilePath
   * @returns {Promise<unknown>}
   */
  uploadFile(key, localFilePath) {
    const options = {
      scope: this.bucket + ":" + key,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(this.mac);
    const formUploader = new qiniu.form_up.FormUploader(this.config);
    const putExtra = new qiniu.form_up.PutExtra()
    return new Promise(((resolve, reject) => {
      formUploader.putFile(uploadToken, key, localFilePath, putExtra, this._handleCallback(resolve, reject));
    }));
  }

  /**
   * 删除文件
   * @param key
   * @returns {Promise<unknown>}
   */
  deleteFile(key) {
    return new Promise((resolve, reject) => {
      this.bucketManager.delete(this.bucket, key, this._handleCallback(resolve, reject))
    })
  }

  /**
   * 获取空间下的可用域名数组
   * @returns {Promise<unknown>}
   */
  getBucketDomain() {
    const reqURL = `http://api.qiniu.com/v6/domain/list?tbl=${this.bucket}`
    const digest = qiniu.util.generateAccessToken(this.mac, reqURL)
    return new Promise((resolve, reject) => {
      qiniu.rpc.postWithoutForm(reqURL, digest, this._handleCallback(resolve, reject))
    })
  }

  /**
   * 获取下载链接
   * @param key
   * @returns {Promise<unknown>}
   */
  generateDownloadLink(key) {
    const domainPromise = this.cacheDomain ? Promise.resolve([this.cacgeDomain]) : this.getBucketDomain();
    return domainPromise.then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        this.cacheDomain = data[0].startsWith('http') ? data[0] : `http://${data[0]}`;
        return this.bucketManager.publicDownloadUrl(this.cacheDomain, key);
      } else {
        throw Error('域名未找到，请查看存储空间是否已经过期')
      }
    })
  }

  /**
   * 下载文件并写入
   * @param key
   * @param downloadPath
   * @returns {Promise<never>}
   */
  downloadFile(key, downloadPath) {
    return this.generateDownloadLink(key).then((link) => {
      const timeStamp = new Date().getTime();
      const url = `${link}?timestamp=${timeStamp}`;
      return axios({
        url,
        method: 'GET',
        responseType: 'stream',
        headers: { 'Cache-Control': 'no-cache' }
      })
    }).then((res) => {
      // 把可读流派发到可写流中去
      const write = fs.createWriteStream(downloadPath);
      res.data.pipe(write);
      return new Promise((resolve, reject) => {
        write.on('finish', resolve);
        write.on('error', reject);
      })
    }).catch((error) => {
      return Promise.reject({ error: error.response });
    })
  }

  /**
   * 处理promise回调
   * @param resolve
   * @param reject
   * @returns {function(...[*]=)}
   * @private
   */
  _handleCallback(resolve, reject) {
    return (respErr, respBody, respInfo) => {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode === 200) {
        resolve(respBody)
      } else {
        reject({
          statusCode: respInfo.statusCode,
          body: respBody
        })
      }
    }
  }
}

module.exports = QiniuManger;
