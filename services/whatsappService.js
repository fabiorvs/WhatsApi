const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const qrcodeImage = require("qrcode");
const fs = require("fs");
const path = require("path");

let qrCode = null;
let isClientReady = false;

const sessionPath = path.join(
  __dirname,
  "..",
  ".wwebjs_auth/session-client-one"
);

// Função para limpar o diretório
const clearDirectory = (directory) => {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      const filePath = path.join(directory, file);
      fs.stat(filePath, (err, stats) => {
        if (err) throw err;
        if (stats.isDirectory()) {
          clearDirectory(filePath);
        } else {
          fs.unlink(filePath, (err) => {
            if (err) throw err;
          });
        }
      });
    }
  });
};

const clearSession = () => {
  if (fs.existsSync(sessionPath)) {
    clearDirectory(sessionPath);
    console.log("Session directory cleared");
  }
};

// Inicializa o cliente WhatsApp com autenticação local
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
  qrCode = null; // Limpa o QR code quando o cliente está pronto
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
  isClientReady = false;
  clearSession(); // Limpa a sessão quando o cliente é desconectado
});

// Limpa o diretório IndexedDB antes de inicializar
clearSession();

// Inicializa o cliente WhatsApp
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
