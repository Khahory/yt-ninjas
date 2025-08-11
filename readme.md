# 🏰 Castillo Escarlata

Un servidor web simple con contador interactivo, defendido por Minato Red 🟥.

## 🐳 Docker Commands

### Construir la imagen
```bash
docker build -t castillo-escarlata .
```

### Iniciar el servidor
```bash
docker run -d -p 3000:3000 --name castillo castillo-escarlata
```

### Detener el servidor
```bash
docker stop castillo
```

### Eliminar el contenedor
```bash
docker rm castillo
```

### Ver logs
```bash
docker logs castillo
```

## 🚀 Acceso

Una vez iniciado, visita: **http://localhost:3000**

## 🎮 Funcionalidad

- ⚔️ Botón interactivo para incrementar contador
- 🔄 Contador se reinicia al recargar la página
- 🎨 Interfaz moderna y responsiva
- 🛡️ Defendido desde el puerto 3000

## 📝 Notas

- El contador se reinicia automáticamente al recargar la página
- El servidor está configurado para el puerto 3000 por defecto
- Puedes cambiar el puerto usando la variable de entorno `PORT`