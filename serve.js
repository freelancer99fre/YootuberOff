const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Map();

wss.on('connection', (ws) => {
  const id = Date.now().toString();
  clients.set(id, ws);
  console.log(`🔌 Novo usuário conectado: ${id}`);

  ws.send(JSON.stringify({ type: 'init', id }));

  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message);
    } catch (err) {
      return;
    }

    // Encaminha a mensagem para o destinatário
    const target = clients.get(data.target);
    if (target) {
      target.send(JSON.stringify({ ...data, from: id }));
    }
  });

  ws.on('close', () => {
    clients.delete(id);
    console.log(`❌ Usuário desconectado: ${id}`);
  });
});

app.use(express.static(path.join(__dirname, 'public')));

server.listen(3000, () => {
  console.log('🚀 Servidor rodando em http://localhost:3000');
});
