const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Importa a conexão com o MySQL

const SECRET_KEY = "sigee_secret";

// Cadastro de usuário
router.post('/cadastro', async (req, res) => {
    const { nome, email, data_nasc, senha } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);

    try {
        await db.query('INSERT INTO usuarios (nome, email, data_nasc, senha) VALUES (?, ?, ?, ?)', [nome, email, data_nasc, senhaHash]);
        res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Login de usuário
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ erro: 'Usuário não encontrado' });

        const usuario = rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) return res.status(401).json({ erro: 'Senha incorreta' });

        const token = jwt.sign({ id: usuario.id, nome: usuario.nome }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, nome: usuario.nome });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Middleware para autenticação
function autenticarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ erro: 'Acesso negado' });

    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ erro: 'Token inválido' });
        req.user = user;
        next();
    });
}

// Rota protegida para Home
router.get('/home', autenticarToken, (req, res) => {
    res.json({ mensagem: `Bem-vindo, ${req.user.nome}!` });
});

// Rotas para Unidade Consumidora

// Criar unidade consumidora
router.post('/unidades', autenticarToken, async (req, res) => {
    console.log("Recebendo dados:", req.body); // Verifica os dados recebidos

    const { nome, cep, estado, cidade, bairro, logradouro, numero, complemento } = req.body;
    const usuario_id = req.user.id;

    if (!nome || !cep || !estado || !cidade || !bairro || !logradouro || !numero) {
        return res.status(400).json({ erro: "Todos os campos obrigatórios devem ser preenchidos!" });
    }

    try {
        await db.query(`
            INSERT INTO unidades_consumidoras 
            (usuario_id, nome, cep, estado, cidade, bairro, logradouro, numero, complemento) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [usuario_id, nome, cep, estado, cidade, bairro, logradouro, numero, complemento || null]);

        res.status(201).json({ mensagem: 'Unidade cadastrada com sucesso!' });
    } catch (error) {
        console.error("Erro ao cadastrar unidade:", error);
        res.status(500).json({ erro: error.message });
    }
});

router.get('/unidades', autenticarToken, async (req, res) => {
    const usuario_id = req.user.id;

    try {
        const [rows] = await db.query(`
            SELECT id, nome, cep, estado, cidade, bairro, logradouro, numero, complemento 
            FROM unidades_consumidoras 
            WHERE usuario_id = ?`, [usuario_id]);

        res.json(rows);
    } catch (error) {
        console.error("Erro ao buscar unidades consumidoras:", error);
        res.status(500).json({ erro: error.message });
    }
});

// Excluir unidade consumidora
router.delete('/unidades/:id', autenticarToken, async (req, res) => {
    const { id } = req.params;
    const usuario_id = req.user.id;

    try {
        const [result] = await db.query('DELETE FROM unidades_consumidoras WHERE id = ? AND usuario_id = ?', [id, usuario_id]);
        if (result.affectedRows === 0) return res.status(404).json({ erro: 'Unidade não encontrada!' });

        res.json({ mensagem: 'Unidade excluída com sucesso!' });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

module.exports = router;

// Rotas para consumo

// Cadastrar consumo
router.post('/consumo', autenticarToken, async (req, res) => {
    const { unidade_id, data_registro, consumo_kwh } = req.body;

    try {
        const [unidade] = await db.query('SELECT * FROM unidades_consumidoras WHERE id = ? AND usuario_id = ?', 
            [unidade_id, req.user.id]);

        if (unidade.length === 0) {
            return res.status(403).json({ mensagem: 'A unidade informada não pertence ao usuário.' });
        }

        await db.query('INSERT INTO consumo (unidade_id, data_registro, consumo_kwh) VALUES (?, ?, ?)', 
            [unidade_id, data_registro, consumo_kwh]);

        res.status(201).json({ mensagem: 'Registro de consumo cadastrado com sucesso!' }); // 🔥 Retorne sempre um JSON válido
    } catch (error) {
        console.error('Erro ao cadastrar consumo:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});


// Listar consumo de uma unidade específica
router.get('/consumo/:unidade_id', autenticarToken, async (req, res) => {
    const { unidade_id } = req.params;

    try {
        const [unidade] = await db.query('SELECT * FROM unidades_consumidoras WHERE id = ? AND usuario_id = ?', 
            [unidade_id, req.user.id]);
        if (unidade.length === 0) return res.status(403).json({ erro: 'A unidade informada não pertence ao usuário.' });

        const [dados] = await db.query('SELECT * FROM consumo WHERE unidade_id = ? ORDER BY data_registro DESC', 
            [unidade_id]);
        res.json(dados);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Excluir registro de consumo
router.delete('/consumo/:id', autenticarToken, async (req, res) => {
    const { id } = req.params;

    try {
        const [consumo] = await db.query(`
            SELECT dc.id, uc.usuario_id 
            FROM consumo dc 
            JOIN unidades_consumidoras uc ON dc.unidade_id = uc.id 
            WHERE dc.id = ? AND uc.usuario_id = ?`, 
            [id, req.user.id]);

        if (consumo.length === 0) return res.status(403).json({ erro: 'Registro não encontrado ou sem permissão.' });

        await db.query('DELETE FROM consumo WHERE id = ?', [id]);
        res.json({ mensagem: 'Registro de consumo excluído!' });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});
