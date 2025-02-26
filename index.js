//Este código configura um servidor básico que responde com uma mensagem de boas-vindas na rota raiz.

const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const sigeeRoutes = require('./routes/sigee');

app.use(express.json());
app.use('/sigee', sigeeRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

