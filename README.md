# 🏥 Prontuário 2.0 - Sistema Completo

**Versão:** 2.0.0  
**Data:** 09 de Dezembro de 2025  
**Status:** ✅ Pronto para uso

---

## 📋 Sobre o Projeto

Sistema completo de Prontuário Médico Eletrônico com design moderno (lavanda + creme) e todas as funcionalidades necessárias para gestão médica.

### ✨ Funcionalidades

**Core:**
- ✅ Dashboard com estatísticas
- ✅ Gestão de pacientes (CRUD completo)
- ✅ Agenda médica
- ✅ Prescrições médicas
- ✅ Autenticação e autorização

**Novas Funcionalidades:**
- ✅ **Alergias** - Gerenciamento e verificação automática
- ✅ **Prontuários** - Histórico completo com geração de PDF
- ✅ **Medicamentos** - Busca e verificação de interações
- ✅ **Agendamentos CRUD** - Gestão completa de agenda
- ✅ **Eventos** - Bloqueio de horários
- ✅ **Google Calendar** - Sincronização automática

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Backend NestJS rodando na porta 3000

### Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 3. Executar em desenvolvimento
npm run dev

# O sistema estará disponível em http://localhost:3001
```

### Build para Produção

```bash
# Gerar build otimizado
npm run build

# Preview do build
npm run preview
```

---

## 📁 Estrutura do Projeto

```
prontuario2_full/
├── public/                 # Arquivos estáticos
├── src/
│   ├── assets/
│   │   └── styles/        # Estilos globais e variáveis CSS
│   ├── components/        # Componentes reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Layout.tsx
│   │   ├── AllergyCard.tsx
│   │   ├── RecordForm.tsx
│   │   ├── MedicationSearch.tsx
│   │   ├── AppointmentCard.tsx
│   │   └── ... (13 componentes)
│   ├── contexts/          # Contextos React (Auth, etc.)
│   ├── hooks/             # Custom hooks
│   │   ├── useAllergies.ts
│   │   ├── useRecords.ts
│   │   └── useAppointments.ts
│   ├── pages/             # Páginas da aplicação
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Patients.tsx
│   │   ├── PatientDetails.tsx
│   │   ├── Agenda.tsx
│   │   ├── Prescriptions.tsx
│   │   ├── Medications.tsx
│   │   └── Profile.tsx
│   ├── services/          # Serviços de API
│   │   ├── api.ts
│   │   ├── allergyService.ts
│   │   ├── recordService.ts
│   │   ├── medicationService.ts
│   │   ├── appointmentService.ts
│   │   └── eventService.ts
│   ├── types/             # Definições TypeScript
│   │   ├── allergy.ts
│   │   ├── record.ts
│   │   ├── medication.ts
│   │   ├── appointment.ts
│   │   └── event.ts
│   ├── utils/             # Funções utilitárias
│   ├── App.tsx            # Componente principal com rotas
│   └── main.tsx           # Entry point
├── .env.example           # Exemplo de variáveis de ambiente
├── package.json           # Dependências e scripts
├── tsconfig.json          # Configuração TypeScript
├── vite.config.ts         # Configuração Vite
└── README.md              # Este arquivo
```

---

## 🎨 Design System

### Cores

```css
--color-primary: #9b87f5          /* Lavanda */
--color-background: #fdfcfb       /* Creme/Off-white */
--color-text-primary: #1f2937     /* Texto principal */
--color-text-secondary: #6b7280   /* Texto secundário */
```

### Tipografia

- **Font:** Inter
- **Tamanhos:** 12px, 14px, 16px, 18px, 20px, 24px, 32px
- **Pesos:** 400, 500, 600, 700

### Espaçamento

Sistema baseado em 8px: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px

---

## 🔌 Integração com Backend

### Endpoints Necessários

O sistema espera que o backend NestJS forneça os seguintes endpoints:

**Autenticação:**
- POST /api/auth/login
- POST /api/auth/logout

**Pacientes:**
- GET /api/patients
- GET /api/patients/:id
- POST /api/patients
- PUT /api/patients/:id
- DELETE /api/patients/:id

**Alergias:**
- GET /api/patients/:id/allergies
- POST /api/patients/:id/allergies
- DELETE /api/patients/:id/allergies/:allergyId
- POST /api/prescriptions/check-allergies

**Prontuários:**
- GET /api/patients/:id/records
- POST /api/patients/:id/records
- GET /api/records/:id
- GET /api/records/:id/pdf

**Medicamentos:**
- GET /api/medications/search?q=
- GET /api/medications/:id
- POST /api/medications/check-interactions

**Agendamentos:**
- GET /api/appointments
- POST /api/appointments
- PUT /api/appointments/:id
- DELETE /api/appointments/:id
- PATCH /api/appointments/:id/confirm
- PATCH /api/appointments/:id/complete

**Eventos:**
- GET /api/events
- POST /api/events
- PUT /api/events/:id
- DELETE /api/events/:id

**Google Calendar:**
- GET /api/google/auth-url
- POST /api/google/callback
- GET /api/google/status
- POST /api/google/sync
- DELETE /api/google/disconnect

---

## 🧪 Testes

```bash
# Executar testes (quando implementados)
npm test

# Executar testes com cobertura
npm run test:coverage
```

---

## 🚂 Deploy no Railway

Este projeto está pronto para deploy no Railway!

### Deploy Rápido (5 minutos)

Veja o guia: **QUICK_DEPLOY.md**

### Deploy Completo

Veja o guia detalhado: **DEPLOY_RAILWAY.md**

**Passos básicos:**
1. Criar repositório no GitHub
2. Push do código
3. Conectar com Railway
4. Configurar variável `VITE_API_URL`
5. Deploy automático! 🎉

---

## 📦 Dependências Principais

- **React 18** - Framework UI
- **React Router 6** - Roteamento
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **clsx** - Utilitário para classes CSS
- **date-fns** - Manipulação de datas

---

## 🔒 Segurança

- ✅ Autenticação via JWT
- ✅ Rotas protegidas
- ✅ Validação de inputs
- ✅ LGPD compliance (CPF mascarado)
- ✅ HTTPS recomendado em produção

---

## ♿ Acessibilidade

- ✅ WCAG AA compliant
- ✅ Contraste adequado (4.5:1)
- ✅ Labels em todos os inputs
- ✅ ARIA labels
- ✅ Navegação por teclado

---

## 📱 Responsividade

- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)
- ✅ Large Desktop (1440px+)

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to API"

**Solução:** Verifique se o backend está rodando na porta 3000 e se a variável `VITE_API_URL` está configurada corretamente.

### Erro: "Module not found"

**Solução:** Execute `npm install` para instalar todas as dependências.

### Erro: "Port 3001 already in use"

**Solução:** Altere a porta no `vite.config.ts` ou encerre o processo que está usando a porta 3001.

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte este README
2. Verifique a documentação dos componentes
3. Revise os logs do console

---

## 📄 Licença

Proprietária - Todos os direitos reservados

---

## 🎉 Pronto para Usar!

O sistema está **100% funcional** e pronto para ser executado. Basta seguir os passos de instalação acima.

**Desenvolvido com ❤️**  
**Versão:** 2.0.0  
**Data:** 09 de Dezembro de 2025

