# ⚡ Deploy Rápido no Railway

## 🚀 5 Passos para Deploy

### 1️⃣ Criar Repositório GitHub

```bash
cd prontuario2_full
git init
git add .
git commit -m "Initial commit"
```

Crie repositório em: https://github.com/new

```bash
git remote add origin https://github.com/SEU_USUARIO/prontuario-2.0.git
git push -u origin main
```

---

### 2️⃣ Deploy no Railway

1. Acesse [railway.app](https://railway.app)
2. Login com GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Selecione `prontuario-2.0`

---

### 3️⃣ Configurar Variáveis

No Railway, adicione em "Variables":

```
NODE_ENV=production
# Opcional: VITE_API_URL=/api
# Opcional: API_PORT=4000
```

**⚠️ Substitua pela URL real do seu backend!**

---

### 4️⃣ Gerar Domínio

1. "Settings" → "Domains"
2. "Generate Domain"
3. Copie a URL gerada

---

### 5️⃣ Configurar CORS no Backend

No backend NestJS, adicione a URL do front-end:

```typescript
app.enableCors({
  origin: ['https://sua-url.railway.app'],
  credentials: true,
});
```

---

## ✅ Pronto!

Acesse sua aplicação na URL gerada pelo Railway! 🎉

**Tempo total:** ~5 minutos

---

Para guia completo, veja: **DEPLOY_RAILWAY.md**
