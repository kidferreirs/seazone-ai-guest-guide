# 🚀 Seazone AI Guest Guide

Guia digital inteligente para hóspedes, criado como desafio técnico para a vaga de **Desenvolvedor Fullstack (AI Builder)** na Seazone.

---

## ✨ Funcionalidades

- URL única por imóvel (`/FLN001`, `/GRM001`)
- Visualização dos dados do imóvel
- Informações de acesso, WiFi, regras e anfitrião
- Guia de experiências gerado por IA
- Persistência do guia gerado no banco
- Assistente virtual com streaming em tempo real
- Respostas baseadas no contexto do imóvel
- Layout responsivo para mobile e desktop
- Tela amigável para imóvel inexistente

---

## 🛠️ Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite
- OpenAI API
- Vercel AI SDK

---

## 📁 Arquitetura

```txt
src/
├── app/
│   ├── [code]/
│   ├── api/
│   │   ├── guides/
│   │   └── chat/
│   ├── layout.tsx
│   └── not-found.tsx
├── components/
│   ├── chat/
│   └── guide/
├── data/
├── lib/
└── types/
```

---

## 🧠 Decisões Técnicas

O projeto utiliza uma rota dinâmica baseada no código do imóvel.

Cada propriedade é armazenada no banco com seus dados estruturados em JSON utilizando Prisma ORM.

O guia de experiências é gerado por IA apenas uma vez por imóvel e persistido no banco, evitando custo e latência em acessos futuros.

O assistente virtual utiliza os dados do imóvel e o guia salvo como contexto, com instruções explícitas para evitar alucinação de informações.

---

## 🤖 Fluxo de IA

1. O hóspede acessa `/FLN001`
2. A aplicação carrega os dados do imóvel
3. O usuário gera o guia de experiências
4. A IA cria recomendações contextualizadas por bairro e cidade
5. O conteúdo é persistido no banco
6. O chat utiliza os dados do imóvel e o guia salvo como contexto
7. As respostas são exibidas em streaming em tempo real

---

## ⚙️ Como rodar localmente

### Instalar dependências

```bash
npm install
```

### Configurar variáveis de ambiente

Crie um arquivo `.env`:

```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="sua_chave_aqui"
```

### Rodar migrations

```bash
npx prisma migrate dev
```

### Popular banco de dados

```bash
npm run seed
```

### Iniciar aplicação

```bash
npm run dev
```

---

## 🌐 Rotas disponíveis

```txt
http://localhost:3000/FLN001
http://localhost:3000/GRM001
```

---

## 📜 Scripts

```bash
npm run dev
npm run build
npm run start
npm run seed
```

---

## 💬 Exemplos de perguntas para o assistente

```txt
Qual a senha do WiFi?
Posso levar meu cachorro?
A que horas posso fazer check-in?
Que restaurantes tem perto?
```

---

## ⭐ Diferenciais implementados

- Conteúdo gerado por IA com persistência
- Chat com resposta progressiva em streaming
- Prompt engineering contextualizado
- Restrição de contexto para evitar alucinação
- Tratamento elegante para imóvel inexistente
- Estrutura organizada e modular
- Cache inteligente para evitar regeneração desnecessária

---

## 🔮 Melhorias futuras

- Autenticação para anfitriões
- Painel administrativo para cadastro de imóveis
- Integração com Google Places API
- Histórico de conversas
- Suporte multilíngue
- Testes automatizados com Vitest/Playwright
- Deploy com PostgreSQL em produção

---

## 👨‍💻 Desenvolvido por

**Amir Ferreira**  
Desafio técnico — Seazone AI Builder