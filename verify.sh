#!/bin/bash

# Script de Verificação - Prontuário 2.0
# Verifica se o código está correto antes do push

echo "🔍 Verificando código do Prontuário 2.0..."
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0

# 1. Verificar se vite-env.d.ts existe
echo -n "1. Verificando vite-env.d.ts... "
if [ -f "src/vite-env.d.ts" ]; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FALTANDO${NC}"
    errors=$((errors+1))
fi

# 2. Verificar se PatientDetails.tsx está correto (linha 93)
echo -n "2. Verificando PatientDetails.tsx linha 93... "
line93=$(sed -n '93p' src/pages/PatientDetails.tsx)
if [[ "$line93" == *'<div className="grid" style={{ gap: 12 }}>'* ]]; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ ERRO - Código antigo detectado${NC}"
    echo "   Linha 93: $line93"
    errors=$((errors+1))
fi

# 3. Verificar se Login.tsx tem isLoading
echo -n "3. Verificando Login.tsx (isLoading)... "
if grep -q "const \[isLoading, setIsLoading\]" src/pages/Login.tsx; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FALTANDO${NC}"
    errors=$((errors+1))
fi

# 4. Verificar se Patients.tsx tem optional chaining
echo -n "4. Verificando Patients.tsx (allergies)... "
if grep -q "row.allergies?.length" src/pages/Patients.tsx; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FALTANDO${NC}"
    errors=$((errors+1))
fi

# 5. Verificar se utils/format.ts existe
echo -n "5. Verificando utils/format.ts... "
if [ -f "src/utils/format.ts" ]; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FALTANDO${NC}"
    errors=$((errors+1))
fi

# 6. Verificar se utils/masks.ts existe
echo -n "6. Verificando utils/masks.ts... "
if [ -f "src/utils/masks.ts" ]; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FALTANDO${NC}"
    errors=$((errors+1))
fi

# 7. Verificar se data/patients.ts exporta Patient
echo -n "7. Verificando data/patients.ts (export)... "
if grep -q "export type { Patient }" src/data/patients.ts; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FALTANDO${NC}"
    errors=$((errors+1))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $errors -eq 0 ]; then
    echo -e "${GREEN}✅ TUDO CORRETO! Código pronto para push!${NC}"
    echo ""
    echo "Próximos passos:"
    echo "  git add ."
    echo "  git commit -m \"fix: Código corrigido e testado\""
    echo "  git push origin main"
    exit 0
else
    echo -e "${RED}❌ ENCONTRADOS $errors ERROS!${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  NÃO FAÇA PUSH AINDA!${NC}"
    echo ""
    echo "Solução:"
    echo "  1. Descompacte novamente o prontuario2_tested_final.zip"
    echo "  2. Copie TODOS os arquivos para o repositório"
    echo "  3. Execute este script novamente"
    exit 1
fi
