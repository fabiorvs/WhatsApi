const express = require('express');
const whatsappService = require('../services/whatsappService');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/send-message', authenticateJWT, async (req, res) => {
    const { number, message } = req.body;
    try {
        await whatsappService.sendMessage(number, message);
        res.status(200).json({ status: 'success', message: 'Mensagem enviada com sucesso!' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Erro ao enviar mensagem: ' + error.message });
    }
});

router.get('/status', authenticateJWT, async (req, res) => {
    if (whatsappService.getClientStatus()) {
        res.status(200).json({ status: 'up', message: 'Client is ready!' });
    } else {
        const qrCodeImage = await whatsappService.getQrCode();
        if (qrCodeImage) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<h1>QR Code para autenticação</h1>');
            res.write(`<img src="${qrCodeImage}">`);
            res.end();
        } else {
            res.status(200).json({ status: 'down', message: 'Client is not ready and QR Code is not available' });
        }
    }
});

module.exports = router;
