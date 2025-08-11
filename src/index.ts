import http from 'http';
import { IncomingMessage, ServerResponse } from 'http';

const port = process.env.PORT || 3000;
let contador = 0;

function sendJSON(res: ServerResponse, status: number, obj: any): void {
  const payload = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  const { pathname } = new URL(req.url || '', `http://${req.headers.host}`);

  if (req.method === 'GET' && pathname === '/') {
    // Página principal con contador y botón - reinicia el contador
    contador = 0;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <title>Castillo Escarlata</title>
        </head>
        <body style="font-family: monospace; background:#1a0000; color:#ff4d4d; padding:20px;">
          🏰 <strong>Has llegado al Castillo Escarlata, custodiado por Minato Red 🟥 desde el puerto ${port}.</strong>
          <p>Ningún visitante cruza estas murallas sin enfrentarse a mi técnica ancestral.</p>

          <div style="margin-top:20px; text-align:center;">
            <button id="btn" style="padding:12px 24px; background:#ff4d4d; color:white; border:none; border-radius:8px; cursor:pointer; font-size:18px; font-weight:bold; box-shadow:0 4px 8px rgba(255,77,77,0.3); transition:all 0.2s;">
              ⚔️ Desafiar
            </button>
            <div style="margin-top:12px; font-size:16px;">
              Presionado: <strong id="num" style="color:#ffcc00;">0</strong> veces
            </div>
          </div>

          <script>
            const btn = document.getElementById('btn');
            const numEl = document.getElementById('num');

            // Carga inicial del contador
            async function cargaContador() {
              try {
                const res = await fetch('/contador');
                if (!res.ok) throw new Error('Error al obtener contador');
                const data = await res.json();
                numEl.textContent = data.contador ?? 0;
              } catch (err) {
                console.error(err);
              }
            }

            // Manejo del click
            btn.addEventListener('click', async () => {
              btn.disabled = true;
              const prevText = btn.textContent;
              btn.textContent = '⏳ Enviando...';
              try {
                const res = await fetch('/sumar', { method: 'POST' });
                if (!res.ok) throw new Error('Respuesta no OK');
                const data = await res.json();
                numEl.textContent = data.contador;
                console.log('Respuesta del servidor:', data);
              } catch (err) {
                console.error('Error al sumar:', err);
                alert('Ocurrió un error. Revisa la consola.');
              } finally {
                btn.disabled = false;
                btn.textContent = prevText;
              }
            });

            // Inicializar
            cargaContador();
          </script>
        </body>
      </html>
    `);
  } else if (req.method === 'GET' && pathname === '/contador') {
    // Endpoint para obtener el contador actual (útil al iniciar la página)
    sendJSON(res, 200, { contador });
  } else if (req.method === 'POST' && pathname === '/sumar') {
    // Incrementa y responde con JSON
    contador++;
    console.log(`🔴 Botón presionado: ${contador} veces`);
    sendJSON(res, 200, { contador });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('🌫️ Las torres están cubiertas por niebla. Ruta no reconocida.');
  }
});

server.listen(port, () => {
  console.log(`🛡️ 🟥 Castillo Escarlata defendido por Minato Red activo en puerto ${port}.`);
});
