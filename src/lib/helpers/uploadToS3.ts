import * as AWS from 'aws-sdk';
import { IAWS } from '../interfaces/IAWS';

export async function uploadToS3(
    pdf: Buffer,
    transactionId: string,
    documentType: string,
    awsConfig: IAWS
  ): Promise<string> {
    try {
      const region = awsConfig.region;
      const accessKeyId = awsConfig.accessKeyId;
      const secretAccessKey = awsConfig.secretAccessKey;
      const bucketName = awsConfig.bucket;
      const s3 = new AWS.S3({
        region,
        accessKeyId,
        secretAccessKey,
      });
        const params = {
            Body: pdf,
            Bucket: `${bucketName}/${documentType}s`,
            Key: `${transactionId}.pdf`,
        };
        await s3.putObject(params).promise();
        const fileName = `${transactionId}.pdf`;
        return fileName;
    } catch (error) {
        console.log('Error uploading file', error);
        const fileName = `${transactionId}.pdf`;
        return fileName.split('.').pop()
          ? `error.${fileName.split('.').pop()}`
          : `error.png`;
      }
}