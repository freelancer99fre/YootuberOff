const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let clients = [];

wss.on('connection', (ws) => {
  // Armazena o cliente
  clients.push(ws);

  // Quando receber uma mensagem de sinalização
  ws.on('message', (message) => {
    // Encaminha para todos os outros clientes
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Remover cliente quando desconectar
  ws.on('close', () => {
    clients = clients.filter(client => client !== ws);
  });
});

console.log('Servidor WebSocket rodando na porta 8080');
