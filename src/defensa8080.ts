import http from 'http';
import url from 'url';

const port = 8080;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url ?? '/', true);
  const path = parsedUrl.pathname;

  if (path === '/') {
    // Página HTML con formulario
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <html>
        <head><meta charset="UTF-8"><title>Lupa Blue</title></head>
        <body style="font-family: monospace; background: #0a1f44; color: #5ea4e9; padding: 20px;">
          🛡️ <strong>Soy Lupa Blue 🟦 del puerto 8080.</strong><br>
          Nadie pasa sin enfrentar mi técnica secreta.<br><br>
          <form action="/aliadoDefensa" method="get">
            🔌 Hostname: <input name="host" value="localhost" required /><br>
            🔢 Puerto: <input name="port" value="9090" required /><br><br>
            <button type="submit">Conectar con aliado</button>
          </form>
        </body>
      </html>
    `);
  } else if (path === '/ataque') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('⚔️ 🟦 ¡Has intentado atacar a Lupa! Pero ya estaba preparado...');
    console.log(`⚔️ Alerta de ataque en ${new Date().toISOString()}`);
  } else if (path === '/aliadoDefensa') {
    const hostname = parsedUrl.query.host as string;
    const aliadoPort = parseInt(parsedUrl.query.port as string);

    if (!hostname || isNaN(aliadoPort)) {
      res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('❌ Parámetros inválidos: se requiere "host" y "port".');
      return;
    }

    const options = {
      hostname,
      port: aliadoPort,
      path: '/',
      method: 'GET'
    };

    const aliadoReq = http.request(options, (aliadoRes) => {
      let data = '';
      aliadoRes.on('data', chunk => { data += chunk; });
      aliadoRes.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          🤝 Conexión exitosa con el aliado en ${hostname}:${aliadoPort}.<br><br>
          Respuesta:<br><div style="background:#001a33;padding:10px;color:#b3d1ff;">${data}</div>
          <br><a href="/">⬅️ Volver</a>
        `);
      });
    });

    aliadoReq.on('error', (_err) => {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`❌ No se pudo contactar al aliado en ${hostname}:${aliadoPort}.`);
    });

    aliadoReq.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('❌ Este sendero está cubierto por niebla. Ruta no reconocida.');
  }
});

server.listen(port, () => {
  console.log(`🛡️ 🟦 Servidor de defensa 8080 activo.`);
});
