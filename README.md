# Finance | Controle Financeiro Mobile

Finance V2 é a evolução da aplicação de gestão financeira pessoal, agora reconstruída com uma stack moderna e escalável. Projetado com foco total em usabilidade mobile (Thumb-First), o app combina a agilidade do Next.js com o poder de processamento do Python e a robustez do Supabase.

A Evolução: Saímos de uma arquitetura baseada em arquivos JSON no Google Drive para um ecossistema completo com banco de dados relacional e inteligência artificial.
***
## Principais Funcionalidades
**Mobile First & PWA:** Experiência de app nativo direto no navegador, com navegação inferior e Bottom Sheets para fácil uso com uma mão.

**Modo Escuro:** Interface adaptativa com persistência de tema via Tailwind CSS.

**Inteligência Financeira:** Motor em Python para categorização automática de transações e análise de tendências.

**Gerenciamento de Parcelas Inteligente:** Replicação automática de despesas fixas e controle de parcelamentos (ex: 1/12, 2/12) com projeção mensal.

**Autenticação Segura:** Login via Supabase Auth (Suporte a Google OAuth e E-mail/Senha).
***
## Tecnologias Utilizadas
**Frontend**
Next.js 15+ (App Router): Estrutura de rotas e performance.

TypeScript: Segurança de tipos e autocomplete para dados financeiros.

Tailwind CSS: Estilização responsiva e utilitária.

Lucide React: Conjunto de ícones otimizados.

**Backend & Inteligência**
Supabase: PostgreSQL (Banco de dados), Auth e Real-time.

FastAPI (Python): Engine de processamento de dados e Machine Learning.
***
## Como Executar o Projeto
### Pré-requisitos
1. Node.js instalado.

2. Ambiente Python 3.10+ (para o motor de IA).

3. Projeto configurado no Supabase.

### Instalação
1. Clone o repositório:

```Bash
git clone https://github.com/LCapistrano25/financeApp
```
2. Instale as dependências do Frontend:

```Bash
cd financeApp
npm install
```

3. Configure as variáveis de ambiente:
  Crie um arquivo .env.local na raiz:
  ```Bash
  NEXT_PUBLIC_SUPABASE_URL=seu_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
  NEXT_PUBLIC_API_URL=http://localhost:8000 # URL do FastAPI
  ```

4. Inicie o servidor de desenvolvimento:

```Bash
npm run dev
```

## Estrutura de Arquivos
```Plaintext
src/
├── app/              # Rotas, Layouts e Páginas (App Router)
├── components/       # Componentes de UI e Mobile (BottomNav, Drawers)
├── hooks/            # Lógica de estado e consumo de dados (SWR/React Query)
├── lib/              # Configuração do Supabase e clientes de API
├── services/         # Comunicação com o motor de IA (FastAPI)
└── types/            # Definições de tipos TypeScript (Interfaces de Finanças)
```
