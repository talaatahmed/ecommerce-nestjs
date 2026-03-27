import crypto from 'node:crypto';

const EncryptionSecretKey = Buffer.from(
  process.env.ENCRYPTION_SECRET_KEY as string,
); //32 bytes
const IV_LENGTH = +(process.env.IV_LENGTH as string); // For AES, this is always 16

/*
create cipher
update cipher
final cipher
*/
export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv('aes-256-cbc', EncryptionSecretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return iv.toString('hex') + ':' + encrypted;
};

export const decrypt = (encryptedData: string): string => {
  // console.log("the encrypted data in decrypt function: ", encryptedData);

  const [iv, encryptedText] = encryptedData.split(':');
  const binaryLikeIv = Buffer.from(iv, 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    EncryptionSecretKey,
    binaryLikeIv,
  );
  let decryptedData = decipher.update(encryptedText, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
};
