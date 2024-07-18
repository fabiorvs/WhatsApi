const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const qrcodeImage = require("qrcode");
const fs = require("fs");
const path = require("path");

let qrCode = null;
let isClientReady = false;

const sessionPath = path.join(__dirname, "..", ".wwebjs_auth/session");

const clearSession = () => {
  if (fs.existsSync(sessionPath)) {
    fs.rmSync(sessionPath, { recursive: true, force: true });
    console.log("Session directory cleared");
  }
};

const client = new Client({
  authStrategy: new LocalAuth({ clientId: "client-one" }),
});

client.on("qr", (qr) => {
  qrCode = qr;
  qrcode.generate(qr, { small: true });
  console.log("QR Code gerado, escaneie com seu WhatsApp!");
});

client.on("ready", () => {
  console.log("Client is ready!");
  isClientReady = true;
  qrCode = null;
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
  isClientReady = false;
  clearSession();
});

client.initialize();

const getQrCode = async () => {
  if (qrCode) {
    return await qrcodeImage.toDataURL(qrCode);
  }
  return null;
};

const sendMessage = async (number, message) => {
  const chatId = `${number}@c.us`;
  await client.sendMessage(chatId, message);
};

const getClientStatus = () => {
  return isClientReady;
};

module.exports = {
  getQrCode,
  sendMessage,
  getClientStatus,
};
