# <p align="center">Finance V2 | Controle Financeiro</p>

<p align="center">
  <strong>Projeto das Disciplina de Práticas Profissionais em Devops e Cloud Computing e Design de Melhoria de Software</strong><br>
  7° Periodo | Engenharia de Software | Unicatólica-TO
</p>

Finance V2 é a evolução da aplicação de gestão financeira pessoal, agora reconstruída com uma stack moderna, escalável e focada na qualidade de software. Projetado com foco total em usabilidade mobile (Thumb-First), o app combina a agilidade do Next.js com a robustez do Supabase.

**A Evolução:** Saímos de uma arquitetura legada para um ecossistema completo guiado por **Clean Architecture** e **Domain-Driven Design (DDD)**, garantindo um código mais testável e desacoplado de serviços externos.

---

## Principais Funcionalidades

*  **Mobile First:** experiência otimizada para uso em telas pequenas, com navegação inferior e *Bottom Sheets* para uso com uma mão.
*  **Modo Escuro:** interface adaptativa com persistência de tema via Tailwind CSS.
*  **Gerenciamento Financeiro:** controle de despesas fixas, parcelamentos e visualização de receitas e despesas.
*  **Autenticação Segura:** login centralizado via Supabase Auth (suporte a Google OAuth).
*  **Arquitetura Limpa:** regras de negócio isoladas da interface gráfica e do banco de dados, facilitando manutenção e testes.

---

## Tecnologias Utilizadas

**Frontend & UI**
- **Next.js 16 (App Router):** estrutura de rotas e renderização moderna.
- **React 19:** interface reativa e compatível com App Router.
- **TypeScript:** tipagem estática para domínio e UI.
- **Tailwind CSS v4 & Lucide React:** estilização utilitária e iconografia.
- **next-themes:** suporte a temas no cliente.

**Backend & Integrações**
- **Supabase:** PostgreSQL e autenticação.

**Qualidade & CI/CD**
- **Jest & React Testing Library:** testes unitários e de integração para domínio, hooks e componentes.
- **ESLint:** análise estática e padronização de código.
- **GitHub Actions:** pipeline automatizada de integração contínua.

---

## Estrutura de Arquivos (Clean Architecture)

A aplicação foi reestruturada para separar responsabilidades, garantindo que o núcleo do negócio não dependa de frameworks externos:

```plaintext
src/
├── domain/ # O coração do software: Entidades, Value Objects e contratos de domínio
├── application/ # Casos de Uso: orquestram as operações de negócio e dependem de portas abstratas
├── infrastructure/ # Implementações de integrações externas (Supabase)
├── presentation/ # Camada visual: componentes UI, hooks e utilitários de estado
├── app/ # Rotas do Next.js (App Router)
└── proxy.ts # Middleware para proteção de rotas e gestão de sessão no servidor
```
---

## Como Executar o Projeto

### Pré-requisitos

1. Node.js (v18+ recomendado).
3. Projeto configurado no Supabase.

### Instalação e Execução

1. Clone o repositório:

```bash
git clone [https://github.com/LCapistrano25/financeApp](https://github.com/LCapistrano25/financeApp)
cd financeApp

```

2. Instale as dependências:

```bash
npm install

```

3. Configure as variáveis de ambiente (crie um arquivo `.env` ou `.env.local` na raiz):

```env
NEXT_PUBLIC_SUPABASE_URL=seu_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
NEXT_PUBLIC_AUTH_REDIRECT_URL=http://localhost:3000/auth/callback
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev

```

---

## Testes e Integração Contínua (CI)

O projeto conta com uma pipeline de Integração Contínua (CI) robusta e automatizada, garantindo que nenhum código suba para produção sem passar por rigorosos critérios de qualidade e segurança de software. Para garantir a qualidade do código antes de realizar commits, utilize os comandos locais abaixo:

**Executar a suíte de testes (Jest):**

```bash
npm test
```

**Verificar a padronização do código (Linter):**

```bash
npm run lint
```

---

## Deploy com Docker na EC2

O projeto possui um `Dockerfile` multi-stage para gerar a imagem de producao do Next.js e um `docker-compose.yml` com dois servicos:

- `finance-app`: aplicacao Next.js na porta `3000`.
- `uptime-kuma`: painel de monitoramento na porta `3001`.

O Uptime Kuma fica em um container separado. Esse modelo facilita atualizar, reiniciar e persistir os dados do monitoramento sem misturar processos dentro da imagem da aplicacao.

### 1. Configure as variaveis

```bash
cp .env.production.example .env
```

Edite o `.env` com os dados reais do Supabase e com a URL publica da aplicacao:

```env
APP_PORT=3000
KUMA_PORT=3001
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
NEXT_PUBLIC_AUTH_REDIRECT_URL=http://SEU_IP_OU_DOMINIO:3000/auth/callback
```

As variaveis `NEXT_PUBLIC_*` sao embutidas no bundle do Next.js durante o build. Sempre que elas mudarem, execute o build novamente.

### 2. Suba os containers

```bash
docker compose up -d --build
```

Acesse:

- App: `http://SEU_IP_OU_DOMINIO:3000`
- Uptime Kuma: `http://SEU_IP_OU_DOMINIO:3001`

No Kuma, crie um monitor HTTP apontando para `http://finance-app:3000` ou para a URL publica da aplicacao.

### 3. Comandos uteis

```bash
docker compose logs -f finance-app
docker compose ps
docker compose pull
docker compose up -d --build
```

