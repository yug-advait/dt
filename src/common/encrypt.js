import CryptoJS from "crypto-js";

const secretKey = "p2p@advait"; // Replace with a strong key in production

// Encrypt data
export const encryptData = data => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

// Decrypt data
export const decryptData = ciphertext => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
