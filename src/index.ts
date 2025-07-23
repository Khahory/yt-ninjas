import http from 'http';

const port = 3000;

const server = http.createServer((req, res) => {
  const path = req.url ?? '/';

  if (path === '/') {
    // Respuesta HTML para navegador
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(`
      <html>
        <head><meta charset="UTF-8"></head>
        <body style="font-family: monospace; background: #1a0000; color: #ff4d4d; padding: 20px;">
          🏰 <strong>Has llegado al Castillo Escarlata, custodiado por Minato Red 🟥 desde el puerto ${port}.</strong><br>
          Ningún visitante cruza estas murallas sin enfrentarse a mi técnica ancestral.
        </body>
      </html>
    `);
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end('🌫️ Las torres están cubiertas por niebla. Ruta no reconocida.');
  }
});

server.listen(port, () => {
  console.log(`🛡️ 🟥 Castillo Escarlata defendido por Minato Red activo en puerto ${port}.`);
});
