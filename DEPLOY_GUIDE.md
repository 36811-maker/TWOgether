# TWOgether 1.0 — Guia Oficial de Instalação e Hospedagem
> **Slogan:** *Our future, together.*  
> **Plataforma Privada de Planejamento de Vida a Dois de Pedro & Emilly**

Este projeto foi arquitetado exclusivamente para:
- **Frontend:** Hospedado no **GitHub Pages** (HTML5, CSS3, JavaScript puro).
- **Backend:** Hospedado no **Render** (Node.js, Express.js, WebSockets, PostgreSQL).
- **Sem provedores externos adicionais** (sem Firebase, Supabase, Appwrite ou Vercel).

---

## 1. Estrutura do Projeto

```
twogether/
├── frontend/               # Frontend puro pronto para GitHub Pages
│   ├── index.html          # Interface única e responsiva
│   ├── css/style.css       # Estilos delicados e modernos
│   └── js/
│       ├── config.js       # URL do backend no Render
│       └── app.js          # Lógica, autenticação e telas
├── backend/                # Servidor Express pronto para o Render
│   ├── server.js           # API REST e WebSockets
│   └── package.json        # Dependências Node.js
├── src/                    # Aplicação Next.js + Drizzle ORM Fullstack
├── .env.example            # Variáveis de ambiente de exemplo
└── README.md
```

---

## 2. Configuração das Contas Privadas

A plataforma possui acesso estritamente restrito. Não existe cadastro aberto para visitantes.

- **Conta 1 (Pedro):**
  - E-mail: `pedro@gmail.com`
  - Senha: `USER_ONE_PASSWORD` (padrão: `13052009`)
- **Conta 2 (Emilly):**
  - E-mail: `emilly@gmail.com`
  - Senha: `USER_TWO_PASSWORD` (padrão: `11042011`)

---

## 3. Hospedagem do Backend no Render

1. Crie uma conta gratuita em [render.com](https://render.com).
2. No painel do Render, crie um **PostgreSQL Database**:
   - Nome: `twogether-db`
   - Copie a **Internal Database URL** (ou External Database URL).
3. Crie um **New Web Service**:
   - Conecte ao seu repositório GitHub.
   - **Root Directory:** `backend` (ou deixe vazio se publicar o repositório do backend separadamente).
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Na aba **Environment Variables**, adicione:
   - `DATABASE_URL`: URL do seu banco PostgreSQL criado no Render.
   - `USER_ONE_EMAIL`: `pedro@gmail.com`
   - `USER_ONE_PASSWORD`: `13052009`
   - `USER_TWO_EMAIL`: `emilly@gmail.com`
   - `USER_TWO_PASSWORD`: `11042011`
5. Clique em **Deploy**. Quando o deploy finalizar, copie a URL gerada (ex: `https://twogether-api.onrender.com`).

---

## 4. Hospedagem do Frontend no GitHub Pages

1. Acesse o arquivo `frontend/js/config.js`.
2. Altere `BASE_URL` para a URL do seu backend no Render:
   ```javascript
   window.API_CONFIG = {
     BASE_URL: "https://seu-backend.onrender.com/api",
   };
   ```
3. Suba o código para o GitHub.
4. No repositório, acesse **Settings > Pages**.
5. Em **Source**, selecione a branch `main` e a pasta `/frontend` (ou use a raiz caso mova os arquivos para a raiz de uma branch `gh-pages`).
6. Salve. O GitHub Pages fornecerá o endereço público de acesso (ex: `https://seu-usuario.github.io/twogether/`).

---

## 5. Áreas Integradas na Plataforma 1.0

1. **Visão Geral (Dashboard):** Contador de dias juntos, status de humor em tempo real, mural de bilhetes recados (post-its).
2. **Planejamento de Objetivos:** Metas de vida a dois com barras de progresso interativas.
3. **Lista de Sonhos (Bucket List):** Sonhos e viagens prioritárias com fotos e celebração de conquistas.
4. **Calendário Compartilhado:** Datas especiais, aniversários e contagem regressiva em dias.
5. **Planejamento da Futura Casa:** Cômodo por cômodo, móveis planejados, orçamentos e itens já adquiridos.
6. **Organização Financeira:** Metas de poupança/caixinhas conjuntas e histórico de aportes.
7. **Viagens e Passeios:** Roteiro dia a dia, pontos turísticos e checklist interativo de mala do casal.
8. **Memórias e Fotos:** Álbum em estilo polaroid com legendas românticas e favoritos.
9. **Cartas e Mensagens:** Cartas de amor e cápsulas do tempo lacradas até datas futuras.
10. **Linha do Tempo Compartilhada:** Marcos cronológicos do relacionamento do início ao futuro.
