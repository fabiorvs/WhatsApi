const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', whatsappRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
