# <p align="center">Finance V2 | Controle Financeiro</p>

<p align="center">
  <strong>Projeto das Disciplina de Práticas Profissionais em Devops e Cloud Computing e Design de Melhoria de Software</strong><br>
  7° Periodo | Engenharia de Software | Unicatólica-TO
</p>

Finance V2 é a evolução da aplicação de gestão financeira pessoal, agora reconstruída com uma stack moderna, escalável e focada na qualidade de software. Projetado com foco total em usabilidade mobile (Thumb-First), o app combina a agilidade do Next.js com o poder de processamento do Python e a robustez do Supabase.

**A Evolução:** Saímos de uma arquitetura legada para um ecossistema completo guiado por **Clean Architecture**, **Domain-Driven Design (DDD)** e **CQRS**, garantindo um código altamente testável e desacoplado de serviços externos.

---

## Principais Funcionalidades

*  **Mobile First & PWA:** Experiência de app nativo direto no navegador, com navegação inferior e *Bottom Sheets* para fácil uso com uma mão.
*  **Modo Escuro:** Interface adaptativa com persistência de tema via Tailwind CSS.
*  **Inteligência Financeira:** Motor em Python para categorização automática de transações e análise de tendências.
*  **Gerenciamento Inteligente:** Controle de despesas fixas e parcelamentos (ex: 1/12, 2/12) com projeção mensal.
*  **Autenticação Segura:** Login centralizado via Supabase Auth (Suporte a Google OAuth e E-mail/Senha).
*  **Arquitetura Limpa:** Regras de negócio totalmente isoladas da interface gráfica e do banco de dados, facilitando manutenção e testes.

---

## Tecnologias Utilizadas

**Frontend & UI**
- **Next.js 16 (App Router):** Estrutura de rotas e performance.
- **TypeScript:** Segurança de tipos e tipagem de domínio.
- **Tailwind CSS & Lucide React:** Estilização responsiva e iconografia otimizada.

**Backend & Inteligência**
- **Supabase:** PostgreSQL (Banco de dados) e Autenticação.
- **FastAPI (Python):** Engine de processamento de dados e Machine Learning.

**Qualidade & CI/CD**
- **Jest & React Testing Library:** Testes unitários e de integração garantindo a confiabilidade dos *Handlers* e Componentes.
- **ESLint & SonarQube:** Análise estática de código e padronização.
- **GitHub Actions:** Pipeline automatizada para integração contínua (CI).

---

## Estrutura de Arquivos (Clean Architecture)

A aplicação foi reestruturada para separar responsabilidades, garantindo que o núcleo do negócio não dependa de frameworks externos:

```plaintext
src/
├── domain/ # O coração do software: Entidades, Value Objects e Contratos (Regras de negócio puras)
├── application/ # Casos de Uso: Handlers que orquestram a leitura (Queries) e escrita (Commands) - CQRS
├── infrastructure/ # Implementação de integrações externas (Supabase, API de IA em Python)
├── presentation/ # Camada visual: Componentes UI, Hooks de estado (desacoplados do banco) e Estilos globais
├── app/ # Rotas do Next.js (App Router)
└── proxy.ts # Middleware para proteção de rotas e gestão de sessão no lado do servidor
```
---

## Como Executar o Projeto

### Pré-requisitos

1. Node.js (v18+ recomendado).
2. Ambiente Python 3.10+ (para o motor de IA).
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
NEXT_PUBLIC_API_URL=http://localhost:8000 # URL do motor FastAPI
NEXT_PUBLIC_AUTH_REDIRECT_URL=http://localhost:3000/auth/callback # URL de redirecionamento após login (Obrigatório para AWS/Prod)

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

**Executar análise do SonarQube (Requer configuração local do SonarScanner):**

```bash
npm run sonar

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
NEXT_PUBLIC_API_URL=http://localhost:8000
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

