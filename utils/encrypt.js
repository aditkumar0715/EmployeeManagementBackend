const crypto = require("node:crypto");

const algorithm = "aes-256-cbc";
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

exports.encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${encrypted}.${iv.toString("hex")}`;
};

exports.decrypt = (encrypted) => {
  const [encryptedText, ivHex] = encrypted.split(".");
  const deCipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(ivHex, "hex")
  );
  let decrypted = deCipher.update(encryptedText, "hex", "utf8");
  decrypted += deCipher.final("utf8");
  return decrypted;
};
