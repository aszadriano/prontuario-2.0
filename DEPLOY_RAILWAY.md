# 🚂 Guia de Deploy no Railway

**Versão:** 2.0.0  
**Data:** 09 de Dezembro de 2025

---

## 📋 Pré-requisitos

1. ✅ Conta no [Railway](https://railway.app) (gratuita)
2. ✅ Conta no GitHub (para conectar o repositório)
3. ✅ Backend NestJS já deployado (ou URL da API)

---

## 🚀 Método 1: Deploy via GitHub (Recomendado)

### Passo 1: Criar Repositório no GitHub

```bash
# 1. Inicializar git no projeto
cd prontuario2_full
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Fazer commit inicial
git commit -m "Initial commit - Prontuário 2.0"

# 4. Criar repositório no GitHub (via interface web)
# https://github.com/new

# 5. Conectar com o repositório remoto
git remote add origin https://github.com/SEU_USUARIO/prontuario-2.0.git

# 6. Fazer push
git branch -M main
git push -u origin main
```

---

### Passo 2: Deploy no Railway

1. **Acessar Railway**
   - Vá para [railway.app](https://railway.app)
   - Faça login com GitHub

2. **Criar Novo Projeto**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Autorize o Railway a acessar seus repositórios
   - Selecione o repositório `prontuario-2.0`

3. **Configurar Variáveis de Ambiente**
   - No dashboard do projeto, clique em "Variables"
   - Adicione as seguintes variáveis:

   ```
   VITE_API_URL=https://seu-backend.railway.app/api
   NODE_ENV=production
   ```

   **⚠️ IMPORTANTE:** Substitua `seu-backend.railway.app` pela URL real do seu backend!

4. **Deploy Automático**
   - O Railway detectará automaticamente o `railway.json`
   - O build será iniciado automaticamente
   - Aguarde 2-5 minutos

5. **Acessar a Aplicação**
   - Após o deploy, clique em "Settings" → "Domains"
   - Clique em "Generate Domain"
   - Sua URL será algo como: `prontuario-2-0-production.up.railway.app`

---

## 🚀 Método 2: Deploy via Railway CLI

### Passo 1: Instalar Railway CLI

```bash
# macOS/Linux
curl -fsSL https://railway.app/install.sh | sh

# Windows (PowerShell)
iwr https://railway.app/install.ps1 | iex
```

### Passo 2: Login

```bash
railway login
```

### Passo 3: Inicializar Projeto

```bash
cd prontuario2_full
railway init
```

### Passo 4: Configurar Variáveis

```bash
# Definir URL da API
railway variables set VITE_API_URL=https://seu-backend.railway.app/api

# Definir ambiente
railway variables set NODE_ENV=production
```

### Passo 5: Deploy

```bash
railway up
```

### Passo 6: Abrir no Navegador

```bash
railway open
```

---

## 🔧 Configurações Importantes

### 1. Conectar com Backend

Se o seu backend também está no Railway:

1. No dashboard do Railway, vá para o projeto do backend
2. Copie a URL pública (ex: `https://backend-production.up.railway.app`)
3. No projeto do front-end, adicione a variável:
   ```
   VITE_API_URL=https://backend-production.up.railway.app/api
   ```

### 2. CORS no Backend

Certifique-se de que o backend aceita requisições do front-end:

```typescript
// No backend NestJS (main.ts)
app.enableCors({
  origin: [
    'http://localhost:3001',
    'https://seu-dominio.railway.app',
    'https://prontuario-2-0-production.up.railway.app'
  ],
  credentials: true,
});
```

### 3. Domínio Customizado (Opcional)

1. No Railway, vá para "Settings" → "Domains"
2. Clique em "Custom Domain"
3. Adicione seu domínio (ex: `app.seudominio.com`)
4. Configure os registros DNS conforme instruções

---

## 📊 Monitoramento

### Ver Logs

```bash
# Via CLI
railway logs

# Via Dashboard
# Clique em "Deployments" → Selecione o deploy → "View Logs"
```

### Métricas

No dashboard do Railway:
- CPU usage
- Memory usage
- Network traffic
- Build time

---

## 🔄 Atualizações

### Deploy Automático (GitHub)

Após configurar via GitHub, toda vez que você fizer push:

```bash
git add .
git commit -m "Atualização X"
git push
```

O Railway fará deploy automaticamente! 🎉

### Deploy Manual (CLI)

```bash
railway up
```

---

## 💰 Custos

### Plano Gratuito (Hobby)

- ✅ $5 de crédito por mês
- ✅ 500 horas de execução
- ✅ 1GB RAM
- ✅ 1GB disco
- ✅ Suficiente para MVP!

### Plano Pro ($20/mês)

- ✅ $20 de crédito + $0.20/hora extra
- ✅ Uso ilimitado
- ✅ 8GB RAM
- ✅ 100GB disco
- ✅ Domínios customizados ilimitados

**Para MVP:** O plano gratuito é suficiente! 🎉

---

## 🐛 Troubleshooting

### Erro: "Build failed"

**Solução:**
```bash
# Limpar cache e rebuildar
railway down
railway up --detach
```

### Erro: "Cannot connect to API"

**Solução:**
1. Verifique se a variável `VITE_API_URL` está correta
2. Verifique se o backend está rodando
3. Verifique CORS no backend

### Erro: "Module not found"

**Solução:**
```bash
# Garantir que todas as dependências estão no package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Build muito lento

**Solução:**
- O primeiro build pode levar 5-10 minutos
- Builds subsequentes são mais rápidos (cache)
- Verifique se não há arquivos grandes no repositório

---

## 📱 Testar a Aplicação

Após o deploy:

1. **Acessar a URL**
   - Ex: `https://prontuario-2-0-production.up.railway.app`

2. **Fazer Login**
   - Use as credenciais do backend

3. **Testar Funcionalidades**
   - Dashboard
   - Pacientes
   - Agenda
   - Prescrições
   - Medicamentos

---

## 🔒 Segurança

### Variáveis de Ambiente

- ✅ Nunca commite o arquivo `.env`
- ✅ Use variáveis de ambiente no Railway
- ✅ Mantenha credenciais seguras

### HTTPS

- ✅ Railway fornece HTTPS automaticamente
- ✅ Certificado SSL gratuito
- ✅ Renovação automática

---

## 📞 Suporte

### Documentação Railway

- [Docs oficiais](https://docs.railway.app)
- [Discord](https://discord.gg/railway)
- [Status](https://status.railway.app)

### Problemas com o Prontuário 2.0

- Revise este guia
- Verifique os logs no Railway
- Verifique a conexão com o backend

---

## ✅ Checklist de Deploy

- [ ] Repositório criado no GitHub
- [ ] Código commitado e pushed
- [ ] Projeto criado no Railway
- [ ] Variável `VITE_API_URL` configurada
- [ ] Backend rodando e acessível
- [ ] CORS configurado no backend
- [ ] Build concluído com sucesso
- [ ] Domínio gerado
- [ ] Aplicação acessível via navegador
- [ ] Login funcionando
- [ ] Conexão com API funcionando

---

## 🎉 Pronto!

Seu **Prontuário 2.0** está no ar! 🚀

**URL de exemplo:**
`https://prontuario-2-0-production.up.railway.app`

Compartilhe com sua equipe e comece a avaliar a MVP! 🎊

---

**Criado por:** Equipe de Desenvolvimento  
**Data:** 09 de Dezembro de 2025  
**Versão:** 2.0.0

