import http from 'http';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function pregunta(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  try {
    const hostname = await pregunta('Ingresa el hostname a atacar (ej: localhost): ');
    const portStr = await pregunta('Ingresa el puerto a atacar (ej: 8080): ');
    const port = Number(portStr);

    if (!hostname || isNaN(port)) {
      console.error('Hostname o puerto inválido.');
      rl.close();
      return;
    }

    const options = {
      hostname,
      port,
      path: '/ataque',
      method: 'GET',
      timeout: 1000,
    };

    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        if (res.statusCode !== 200) {
          console.error(`❌ No se recibió respuesta en 1 segundos. El ataque ha fallado. 😨`);
          rl.close();
          return;
        }

        console.log(`✅ Respuesta del servidor en ${hostname}:${port}/ataque:`);
        console.log(data);
        rl.close();
      });
    });

    req.on('error', err => {
      console.error('Error al consultar /ataque:', err.message);
      rl.close();
    });

    req.end();

  } catch (error) {
    console.error('Error inesperado:', error);
    rl.close();
  }
}

main();
