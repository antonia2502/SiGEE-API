const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',  // Servidor do MySQL
    user: 'root',       // Usuário padrão do XAMPP
    password: '',       // Senha
    database: 'sigee'   // Nome do banco de dados
});

module.exports = pool.promise();
