import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Servir arquivos estáticos do build
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy para API (opcional - se o backend estiver em outro domínio)
// Descomente se necessário
/*
import { createProxyMiddleware } from 'http-proxy-middleware';
app.use('/api', createProxyMiddleware({
  target: process.env.API_URL || 'http://localhost:3000',
  changeOrigin: true,
}));
*/

// Todas as rotas retornam o index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Prontuário 2.0 rodando na porta ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
});
