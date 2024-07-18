const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Configurar CORS para permitir apenas o frontend específico
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware para analisar o corpo da requisição como JSON
app.use(express.json());

app.use('/api', authRoutes); // Mover authRoutes para cima para evitar problemas de autenticação
app.use('/api', userRoutes);
app.use('/api', whatsappRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
