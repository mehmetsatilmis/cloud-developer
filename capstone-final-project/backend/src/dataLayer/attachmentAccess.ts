import * as AWS  from 'aws-sdk'
import { createLogger } from '../utils/logger'

const logger = createLogger("AttachmentAccessLogger")

export class AttachmentAccess {

  constructor(
    private readonly s3Client = createS3Client(),
    private readonly s3Bucket = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION) {
  }

  async getUploadUrl(todoId: string): Promise<String> {
    logger.info("getUploadUrl generate url for todoId : " + todoId)

    return this.s3Client.getSignedUrl('putObject', {
      Bucket: this.s3Bucket,
      Key: todoId,
      Expires: this.urlExpiration
    })
  }

  async deleteAttachment(todoId: string): Promise<any> {
    logger.info("getUploadUrl generate url for todoId : " + todoId)

    return this.s3Client.deleteObject({
        Bucket: this.s3Bucket,
        Key: todoId
    }).promise();

  }
 
}

function createS3Client() {
  return new AWS.S3({
    signatureVersion: 'v4'
  })
}
