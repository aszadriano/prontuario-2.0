import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const API_PORT = process.env.API_PORT || 4000;
const API_URL = `http://127.0.0.1:${API_PORT}`;

const backendProcess = spawn('node', ['dist/main.js'], {
  cwd: path.join(__dirname, 'apps', 'api'),
  env: { ...process.env, PORT: API_PORT },
  stdio: 'inherit',
});

backendProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`Backend encerrado com codigo ${code}`);
  }
});

process.on('SIGTERM', () => backendProcess.kill('SIGTERM'));
process.on('SIGINT', () => backendProcess.kill('SIGINT'));

app.use(
  '/api',
  createProxyMiddleware({
    target: API_URL,
    changeOrigin: true,
  })
);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Prontuario 2.0 rodando na porta ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
});
