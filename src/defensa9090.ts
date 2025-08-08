import http from 'http';

const port = 9090;

const server = http.createServer((req, res) => {
  const path = req.url ?? '/';

  if (path === '/') {
    // Respuesta HTML para navegador
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(`
      <html>
        <head><meta charset="UTF-8"></head>
          <body style="font-family: monospace; background: #0b3d0b; color: #a6d785; padding: 20px;">
            🛡️ <strong>Soy Minato Green 🟩 del puerto 9090.</strong><br>
            Nadie pasa sin enfrentar mi técnica secreta.
          </body>
      </html>
    `);
  } else if (path === '/ataque') {
    // Respuesta para API (texto plano o JSON)
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end('⚔️ 🟩¡Has intentado atacar a Takeshi! Pero ya estaba preparado...');
    console.log(`⚔️ 🟩 Alerta de ataque en ${new Date().toISOString()}`);
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
    res.end('❌ Este sendero está cubierto por niebla. Ruta no reconocida.');
  }
});

server.listen(port, () => {
  console.log(`🛡️ 🟩 Servidor de defensa 9090 activo.`);
});
