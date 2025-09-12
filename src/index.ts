import http from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import { config } from 'dotenv';
import { Client } from 'pg';
config();

const port = process.env.PORT || 3000;
let contador = 0;

// Configuración de variables de entorno
console.log("process.env.PASSWORD", process.env.PASSWORD);
console.log("process.env.USERNAME", process.env.USERNAME);

// Función para probar conexión a PostgreSQL
async function testDatabaseConnection(): Promise<{ success: boolean; message: string; details?: any }> {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    await client.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as version');
    await client.end();
    
    return {
      success: true,
      message: '✅ Conexión a PostgreSQL exitosa',
      details: {
        currentTime: result.rows[0].current_time,
        version: result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]
      }
    };
  } catch (error) {
    await client.end();
    return {
      success: false,
      message: '❌ Error al conectar con PostgreSQL',
      details: {
        error: error instanceof Error ? error.message : 'Error desconocido',
        config: {
          host: process.env.DB_HOST || 'localhost',
          port: process.env.DB_PORT || '5432',
          database: process.env.DB_NAME || 'postgres',
          user: process.env.DB_USER || 'postgres'
        }
      }
    };
  }
}

function sendJSON(res: ServerResponse, status: number, obj: any): void {
  const payload = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
  });
  res.end(payload);
}

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
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
          <img src="https://theanarchistsite.wordpress.com/wp-content/uploads/2019/08/giphy.gif?w=700" alt="hxh">
          <img src="https://theanarchistsite.wordpress.com/wp-content/uploads/2019/08/giphy.gif?w=700" alt="hxh">
          <img src="https://theanarchistsite.wordpress.com/wp-content/uploads/2019/08/giphy.gif?w=700" alt="hxh">
          <img src="https://theanarchistsite.wordpress.com/wp-content/uploads/2019/08/giphy.gif?w=700" alt="hxh">

          <div style="margin-top:20px; text-align:center;">
            <button id="btn" style="padding:12px 24px; background:#ff4d4d; color:white; border:none; border-radius:8px; cursor:pointer; font-size:18px; font-weight:bold; box-shadow:0 4px 8px rgba(255,77,77,0.3); transition:all 0.2s; margin-right:10px;">
              ⚔️ Desafiar
            </button>
            <button id="dbBtn" style="padding:12px 24px; background:#4d79ff; color:white; border:none; border-radius:8px; cursor:pointer; font-size:18px; font-weight:bold; box-shadow:0 4px 8px rgba(77,121,255,0.3); transition:all 0.2s;">
              🗄️ Test DB
            </button>
            <div style="margin-top:12px; font-size:16px;">
              Presionado: <strong id="num" style="color:#ffcc00;">0</strong> veces
            </div>
            <div id="dbResult" style="margin-top:20px; padding:15px; border-radius:8px; display:none; font-family: monospace; font-size:14px;"></div>
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

            // Manejo del botón de test DB
            const dbBtn = document.getElementById('dbBtn');
            const dbResult = document.getElementById('dbResult');

            dbBtn.addEventListener('click', async () => {
              dbBtn.disabled = true;
              const prevText = dbBtn.textContent;
              dbBtn.textContent = '⏳ Probando...';
              dbResult.style.display = 'none';
              
              try {
                const res = await fetch('/test-db');
                if (!res.ok) throw new Error('Respuesta no OK');
                const data = await res.json();
                
                dbResult.style.display = 'block';
                if (data.success) {
                  dbResult.style.background = '#1a3a1a';
                  dbResult.style.border = '2px solid #4dff4d';
                  dbResult.style.color = '#4dff4d';
                  dbResult.innerHTML = 
                    '<strong>' + data.message + '</strong><br>' +
                    '<strong>Hora del servidor:</strong> ' + data.details.currentTime + '<br>' +
                    '<strong>Versión PostgreSQL:</strong> ' + data.details.version;
                } else {
                  dbResult.style.background = '#3a1a1a';
                  dbResult.style.border = '2px solid #ff4d4d';
                  dbResult.style.color = '#ff4d4d';
                  dbResult.innerHTML = 
                    '<strong>' + data.message + '</strong><br>' +
                    '<strong>Error:</strong> ' + data.details.error + '<br>' +
                    '<strong>Configuración:</strong> ' + data.details.config.host + ':' + data.details.config.port + '/' + data.details.config.database;
                }
              } catch (err) {
                dbResult.style.display = 'block';
                dbResult.style.background = '#3a1a1a';
                dbResult.style.border = '2px solid #ff4d4d';
                dbResult.style.color = '#ff4d4d';
                dbResult.innerHTML = '<strong>❌ Error de conexión:</strong> ' + err.message;
              } finally {
                dbBtn.disabled = false;
                dbBtn.textContent = prevText;
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
  } else if (req.method === 'GET' && pathname === '/test-db') {
    // Endpoint para probar conexión a PostgreSQL
    console.log('🔍 Probando conexión a PostgreSQL...');
    try {
      const result = await testDatabaseConnection();
      sendJSON(res, result.success ? 200 : 500, result);
    } catch (error) {
      sendJSON(res, 500, {
        success: false,
        message: '❌ Error interno del servidor',
        details: { error: error instanceof Error ? error.message : 'Error desconocido' }
      });
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('🌫️ Las torres están cubiertas por niebla. Ruta no reconocida.');
  }
});

server.listen(port, () => {
  console.log(`🛡️ 🟥 Castillo Escarlata defendido por Minato Red activo en puerto ${port}.`);
});
