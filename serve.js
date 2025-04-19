const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

// Diretório para servir os arquivos HTML/JS
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do WebSocket para comunicação em tempo real
wss.on('connection', (ws) => {
  console.log('Novo cliente conectado');
  
  // Enviar uma mensagem quando um novo cliente entrar
  ws.send(JSON.stringify({ message: 'Conectado à chamada' }));

  // Receber mensagens de outros clientes
  ws.on('message', (message) => {
    console.log('Mensagem recebida: ' + message);
    // Repassar a mensagem para todos os outros clientes
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Quando o cliente se desconectar
  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar o servidor na porta 3000
server.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
