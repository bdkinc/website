import net from 'node:net';
import { spawn } from 'node:child_process';

const port = Number(process.env.CMS_PORT || 3001);

function isPortAvailable(targetPort) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });

    server.listen(targetPort, '0.0.0.0');
  });
}

const available = await isPortAvailable(port);

if (!available) {
  console.error(
    `[cms] Port ${port} is already in use. Stop the existing process or run with CMS_PORT=<free-port>.`
  );
  process.exit(1);
}

const child = spawn('next', ['dev', '-p', String(port)], {
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
