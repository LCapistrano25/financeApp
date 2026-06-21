# Entrega Final do Projeto

## 1. Identificação do projeto

- Nome do projeto: Finance V2
- Integrantes do grupo: 
    - João Victor Ferreira Costa
    - Eville Vitória Nunes Coelho
    - Fernanda Galvão Marçal
- Link do repositório:

    [![repo](https://img.shields.io/badge/Acessar_Repositório-Finance_V2-2563EB?style=for-the-badge&logo=github&logoColor=white)](https://github.com/LCapistrano25/financeApp)
    
- Tecnologia utilizada:

    - **Frontend & UI**
        - **Next.js 16 (App Router):** Estrutura de rotas e performance.
        - **TypeScript:** Segurança de tipos e tipagem de domínio.
        - **Tailwind CSS & Lucide React:** Estilização responsiva e iconografia otimizada.

    - **Backend & Inteligência**
        - **Supabase:** PostgreSQL (Banco de dados) e Autenticação.

    - **Qualidade & CI/CD**
        - **Jest & React Testing Library:** Testes unitários e de integração garantindo a confiabilidade dos *Handlers* e Componentes.
        - **ESLint & SonarQube:** Análise estática de código e padronização.
        - **GitHub Actions:** Pipeline automatizada para integração contínua (CI).

- Funcionalidade principal desenvolvida:

        Finance V2 é uma aplicação web focada em simplicidade e privacidade. Projetado especificamente para uso em dispositivos móveis, ele permite que você gerencie suas rendas e despesas diretamente do seu navegador.

## 2. Descrição do case

O Finance App é uma solução focada em simplicidade e privacidade para gerenciamento financeiro em dispositivos móveis. O sistema permite o controle centralizado de receitas e despesas, garantindo a integridade dos saldos, a correta categorização dos gastos e o controle atômico de transações financeiras, sejam elas únicas ou recorrentes.

## 3. Estado do projeto antes da análise externa

Antes da refatoração (Entregável 02), o projeto possuía uma estrutura em camadas, mas sofria de "Domínio Anêmico". Entidades como `Transaction`, `Account` e `Category` eram apenas interfaces TypeScript puras. As regras de negócio e os cálculos financeiros estavam concentrados na camada de aplicação, e havia um forte acoplamento com a infraestrutura (uso direto do cliente Supabase para recuperar sessões dentro dos handlers).

## 4. Alterações realizadas pelo outro grupo

O grupo avaliador implementou as seguintes melhorias:

* **Extração de Regras de Cálculo:** Isolamento do cálculo de receitas, despesas e saldo financeiro no Value Object `TransactionSummary` (Side-Effect-Free Function).
* **Isolamento da Autenticação:** Criação da porta `IAuthService` na camada de aplicação para abstrair completamente o Supabase dos fluxos centrais.
* **Inversão de Dependência:** Casos de uso passaram a depender de abstrações (`ITransactionRepository`, `IAccountRepository`, `ICategoryRepository`) injetadas via construtor.
* **Fortalecimento das Entidades:** `Transaction`, `Account` e `Category` tornaram-se classes ricas com métodos, propriedades encapsuladas e validações internas (`validate()`).
* **Value Objects Expressivos:** Criação do VO `Amount` para proteger invariantes matemáticas (finitude e positividade).
* **Adição de Testes Automatizados:** Implementação de suítes de testes unitários com Jest cobrindo Value Objects, Entidades e Casos de Uso.

## 5. Avaliação das alterações recebidas

O grupo original realizou uma revisão crítica e minuciosa do relatório técnico e das refatorações propostas pelo grupo avaliador. Todas as alterações estruturais que visavam eliminar o modelo de domínio anêmico e mitigar o acoplamento tecnológico foram aceitas e integradas definitivamente à branch principal (`main`).

### Alterações Mantidas e Integração Tática:
* **Isolamento de Infraestrutura na Autenticação:** A extração do cliente do Supabase de dentro dos casos de uso para a criação da porta `IAuthService` (camada de *Application*) foi mantida. Isso removeu o vazamento de tipos do framework externo e garantiu que a aplicação dependa exclusivamente de uma abstração limpa (`AuthenticatedUser`).
* **Conversão de Interfaces em Entidades Ricas:** Mantivemos a transformação das antigas interfaces anêmicas `Transaction`, `Account` e `Category` em classes de domínio ricas com métodos de validação internos (`validate()`).
* **Encapsulamento de Primitivos por Value Objects:** A introdução do Value Object `Amount` foi integralmente validada. Ele agora impede que valores monetários inválidos, negativos ou não-finitos circulem pelo sistema.
* **Centralização do Cálculo de Totais:** O objeto de valor `TransactionSummary` foi adotado como a única fonte da verdade para a consolidação matemática de receitas, despesas e saldos líquidos do dashboard.

### Justificativa Técnica:
A aceitação dessas alterações é justificada pelo princípio do isolamento do núcleo de negócios (*Core Domain*). Sem essas correções, a evolução do Finance App geraria um alto endividamento técnico, onde qualquer mudança na SDK do Supabase ou nas regras de validação visual quebraria diretamente a persistência de dados e as regras de negócio essenciais. A introdução de testes unitários automatizados pelo outro grupo serviu como ferramenta de regressão para validar que o comportamento puro do domínio foi preservado e blindado.


## 6. Melhorias adicionais realizadas pelo grupo original

Após estabilizar as alterações recebidas, o grupo original identificou que algumas diretrizes de modelagem ainda operavam de forma incompleta ou parcial. Implementamos as seguintes melhorias adicionais para garantir a conformidade estrita com os requisitos da disciplina:

* **Desenvolvimento do Domain Service `TransactionRecurrenceService`:** O relatório externo apontava que o sistema possuía campos e validações de recorrência, mas carecia de um mecanismo que gerasse de fato as parcelas futuras. Como uma transação individual não deve ter a responsabilidade de instanciar e gerenciar o ciclo de vida de outras transações (o que violaria suas fronteiras de consistência), extraímos essa regra para um Serviço de Domínio puro (`TransactionRecurrenceService`).
* **Orquestração Transacional de Recorrência no Caso de Uso:** Modificamos o `CreateTransactionUseCase` para consumir o novo serviço de domínio. Agora, quando uma transação base com a flag `repeat` ativa é persistida, o caso de uso intercepta o fluxo, invoca o `TransactionRecurrenceService.generateRecurrences()` e salva em lote (usando `Promise.all`) todas as parcelas herdeiras de forma atômica.
* **Sanitização de Inconsistências na Documentação:** Removemos todas as menções legadas a um "motor em Python/FastAPI" do `README.md`. Alinhamos os termos técnicos de "Handlers" para "Use Cases", refletindo fielmente a organização de arquivos atual do repositório.

## 7. Linguagem Ubíqua

* **Transação (Transaction):** Qualquer movimentação financeira registrada no sistema (paga, não-paga, recorrente ou avulsa).
* **Conta (Account):** Origem ou destino real dos fundos gerenciados pelo usuário.
* **Categoria (Category):** Classificação lógica atrelada a despesas ou receitas.
* **Recorrência (RepeatFrequency):** Regra de intervalo temporal ditando a repetição padronizada de transações geradas no futuro.

## 8. Módulos

O projeto organiza seus limites táticos através de uma rigorosa segregação por diretórios (camadas concêntricas):

* **Domain:** Contém as `entities`, `value-objects`, `enum`, `services` e os contratos de `repositories`. Totalmente agnóstico.
* **Application:** Casos de Uso (`usecases`) organizados por domínios secundários (`account`, `auth`, `category`, `transaction`) coordenando os fluxos.
* **Infrastructure:** Implementações físicas concretas de bancos de dados (`supabase`), `services` em nuvem e os mapeadores estruturais (`mappers`).
* **Presentation / App:** Elementos reativos (UI), páginas visuais, hooks assíncronos e componentes do React.

## 9. Entities

### Transaction

* **Identidade:** ID único gerado.
* **Responsabilidades:** Registrar transações, gerenciar datas, categorização e indicar pagamento.
* **Comportamentos:** `create()`, `restore()`, `update()`, `markAsPaid()`, `markAsUnpaid()`, `isExpense()`, `isIncome()`, `validate()`.
* **Regras de negócio:** A data deve ser válida; deve ser linkada ao UUID do proprietário (`user_id`); e se for recorrente, número de vezes e frequência são imperativos; o `amount` deve ser sempre válido.
* **Justificativa:** Entidade rica de negócio que muta durante o ciclo vital.

### Account

* **Identidade:** ID único.
* **Responsabilidades:** Definir as carteiras e cofres.
* **Comportamentos:** `create()`, `restore()`, `update()`, `validate()`.
* **Regras de negócio:** Presença obrigatória de ícone e cores, além do vínculo intransferível ao `user_id`.
* **Justificativa:** Ciclo de vida independente (Criada antes da transação operar sobre ela).

### Category

* **Identidade:** ID único.
* **Responsabilidades:** Segmentar tipos lógicos de gasto/renda.
* **Comportamentos:** `create()`, `restore()`, `update()`, `validate()`.
* **Regras de negócio:** Só é possível inserir categoria dos tipos aceitos (EXPENSE ou INCOME).
* **Justificativa:** Identidade vital para as listagens e agregações financeiras do sistema.

## 10. Value Objects

### Amount

* **Atributos:** `value` (numérico encapsulado).
* **Validações:** Realiza a proteção "Fail-Fast" de que nenhum valor numérico no domínio possa nascer não-finito (ex: `NaN`) ou negativo (sendo igual ou menor a zero).
* **Critérios de igualdade:** Baseada em seu valor unitário.
* **Justificativa:** Impede que problemas clássicos com tipos flutuantes do Javascript ou corrupção de UI causem inserção de lixo matemático no banco de dados.

### TransactionSummary

* **Atributos:** `income`, `expense`, `balance`.
* **Validações:** O construtor orquestra uma soma baseada apenas em transações sinalizadas ativamente como `isPaid`.
* **Justificativa:** Encapsula o cálculo de totais, fornecendo um Side-Effect-Free Service robusto para dashboards e balanços.

## 11. Aggregates e Aggregate Roots

Neste cenário do escopo financeiro básico, atuamos com entidades singulares gerindo seus limites transacionais independentemente:

* **Transaction (Aggregate Root Central):** Protege suas variáveis internas (`isPaid`, recursividade e datas). Impede alterações de estado (invariantes) que fujam de chamadas aos seus métodos proprietários. Contém os objetos de valor anexos na sua persistência.
* **Account e Category:** Roots de configuração cadastradas de forma atômica no projeto e referenciadas indiretamente nas transações por chaves identificadoras.

## 12. Factories

Aplicadas pragmática e intrinsecamente dentro das Classes Concretas na forma de Estáticos (Static Members).

* O método `Transaction.create(props)` atua formalmente como uma Factory. Em vez de utilizar o `new` diretamente pelo programador, exigimos o `.create()`, que além do repasse atômico de tipagem, roda o `.validate()` imediatamente. Isto bloqueia e lança erro obstativo impedindo a compilação do objeto na memória se as regras estipuladas no Domínio estiverem violadas, obedecendo a criação padronizada recomendada por Eric Evans. O mesmo ocorre via o método `restore()` durante os retornos dos Data Mappers.

## 13. Domain Services

* **TransactionRecurrenceService:** Adicionado neste último ciclo de revisão. As regras de expansão e previsão de datas mensais, diárias e semanais baseadas num "template" de transação não são responsabilidade de uma única Entidade (seria bizarro uma Transação criar sub-transações de si). O serviço de domínio recebe as premissas, calcula em calendário e cospe transações filhas configuradas para o futuro (`isPaid: false`, com `repeat: false`).

## 14. Repositories

Todos blindados por "Inversão de Dependência".

* **Abstrações no Domínio:** Estipulam as exigências (`ITransactionRepository`, `IAccountRepository`...). Todas recebem e retornam unicamente instâncias de Entidades (ex: recebem objeto `Transaction`).
* **Supabase (Infra):** Implementa os contratos operando Data Mapping e lidando com os construtos de SDK externos sem que a camada principal perceba a presença do banco.

## 15. Regras de negócio

| Regra de negócio | Classe responsável | Forma de proteção |
| --- | --- | --- |
| Valores financeiros lógicos (>0) | `Amount` (Value Object) | *Fail Fast*: Lança Erro caso nasça nulo ou negativo. |
| Dono real vinculado a contas/categorias | `CreateTransactionUseCase` | Checagens de permissão explícitas validando igualdade entre a sessão de usuário e dados recuperados do Repositório. |
| Categorias incompatíveis barradas | `CreateTransactionUseCase` | Validação rejeitando categorias `INCOME` sendo inseridas em formulários nativos de despesa (`EXPENSE`) e vice-versa. |
| Exigência de consistência na Recorrência | `Transaction` (Entity) | `.validate()` garantindo a presença simultânea de vezes/intervalo em transações com chave de Repetição ativa. |
| Omissão do ciclo infinito na clonagem | `TransactionRecurrenceService` | Forçamento rígido de atributos de que herdeiras no tempo nasçam marcadas em falso para gerar filhos. |

## 16. Aplicação de Supple Design

Para tornar o modelo de domínio do Finance App não apenas expressivo, mas simples de usar corretamente e difícil de usar de forma incorreta, aplicamos intencionalmente os padrões de *Supple Design* propostos por Eric Evans:

### Intention-Revealing Interfaces (Interfaces Reveladoras de Intenção)
Os nomes das classes, parâmetros e métodos eliminam ambiguidades técnicas e expõem diretamente a semântica do fluxo financeiro. Métodos como `transaction.markAsPaid()`, `transaction.markAsUnpaid()`, `transaction.isExpense()` e `transaction.isIncome()` revelam o propósito do negócio sem que o desenvolvedor precise inspecionar ou alterar propriedades booleanas brutas de forma manual.

### Side-Effect-Free Functions (Funções Sem Efeitos Colaterais)
O cálculo do balanço financeiro foi encapsulado no Value Object `TransactionSummary`. O método de agregação opera como uma função pura: ele recebe um array de transações, executa uma redução matemática e retorna uma nova estrutura imutável contendo receitas, despesas e saldo. Esse cálculo não altera o estado interno de nenhuma entidade, eliminando efeitos colaterais indesejados no sistema.

### Assertions (Afirmações e Invariantes)
Utilizamos cláusulas de guarda (*Guard Clauses*) com o padrão *Fail-Fast* no método `validate()` encapsulado nas entidades e nos construtores dos Value Objects. Ao tentar instanciar uma `Transaction` com valores zerados ou negativos através do `Amount`, ou ao tentar configurar uma repetição sem definir sua frequência e quantidade de parcelas, o sistema lança uma exceção imediatamente, impedindo que dados corrompidos se propaguem pelo domínio ou alcancem a camada de persistência.

### Conceptual Contours (Contornos Conceituais)
Identificamos que o valor numérico bruto (`number`) e os intervalos de data possuíam contornos conceituais profundos no negócio financeiro. Ao isolar o número primitivo dentro do Value Object `Amount` e a manipulação de períodos dentro de `MonthYear`, o design agrupou elementos de forma coesa, reduzindo o acoplamento e facilitando a legibilidade e a manutenção independente de cada conceito.

## 17. Arquitetura final

O Finance App adota uma arquitetura estrutural baseada em **Clean Architecture** alinhada aos padrões táticos do **Domain-Driven Design (DDD)**. O código-fonte está fisicamente segregado no diretório `src/` em cinco camadas principais, com a regra de dependência apontando estritamente para o centro (o Domínio).

### Detalhamento das Camadas e Responsabilidades:

**1. Domain (`src/domain/`) - O Núcleo Agnóstico**

* **Responsabilidade:** Contém o coração da aplicação, isolado de qualquer tecnologia externa (sem dependências de React, Next.js ou Supabase). Dita as regras de negócio puras.
* **Elementos:** * `entities/`: Classes ricas (`Transaction`, `Account`, `Category`) que garantem suas próprias invariantes.
* `value-objects/`: Tipos imutáveis como `Amount` e `TransactionSummary`.
* `services/`: Serviços puros de domínio, como o `TransactionRecurrenceService`, que calculam e geram transações futuras.
* `enum/`: Vocabulário padronizado (`TransactionType`, `RepeatFrequency`).
* `repositories/`: Contratos/Interfaces estritas (`ITransactionRepository`) definindo o que o domínio precisa para persistência, sem saber *como* será feito.



**2. Application (`src/application/`) - Coordenação e Casos de Uso**

* **Responsabilidade:** Orquestra as intenções do usuário. Recebe dados brutos da interface, aciona as entidades de domínio para validação/processamento e delega a persistência à infraestrutura.
* **Elementos:** * `usecases/`: Agrupados por subdomínios (`account`, `auth`, `category`, `transaction`). Cada diretório (ex: `create-transaction`) contém interfaces (`iusecase.ts`), DTOs (`dto.ts`) e o orquestrador concreto (`usecase.ts`).
* `ports/`: Contratos de serviços de aplicação que não são de persistência, como a interface de autenticação (`iauth.service.ts`).



**3. Infrastructure (`src/infrastructure/`) - Mecanismos e Detalhes Técnicos**

* **Responsabilidade:** Fornece as implementações concretas para as interfaces declaradas no domínio e na aplicação. É a única camada que "conversa" com o banco de dados e APIs externas.
* **Elementos:** * `repositories/supabase/`: Implementações reais que executam queries no PostgreSQL/Supabase (ex: `transaction.repository.ts`).
* `services/`: Implementação concreta do serviço de autenticação (`supabase-auth.service.ts`).
* `mappers/`: Tradutores fundamentais (`account.mapper.ts`, etc.) que convertem respostas JSON cruas do Supabase em instâncias reais das Entidades de Domínio via `restore()`, e vice-versa.



**4. Presentation (`src/presentation/`) - Interface e Estado Local**

* **Responsabilidade:** Isolar a lógica de apresentação e a gestão de estado do React das regras de negócio.
* **Elementos:** * `components/`: Elementos visuais burros e reutilizáveis (UI) separados por categorias genéricas (`cards`, `forms`, `mobile`).
* `hooks/`: Camada adaptadora vital (ex: `use-create-transaction.ts`). Estes Custom Hooks do React têm a função de instanciar os casos de uso da camada de `Application`, injetando as dependências de `Infrastructure` e tratando os estados de loading/erro para a tela.



**5. App / UI (`src/app/`) - Entrega Externa (Next.js)**

* **Responsabilidade:** Lidar exclusivamente com o roteamento, layouts e renderização da página (Server e Client Components).
* **Elementos:** Rotas do App Router do Next.js (ex: `dashboard/accounts/page.tsx` e `auth/login/page.tsx`), atuando apenas como os pontos de entrada finais (endpoints) que consomem os `hooks` e `components` da camada de Presentation.

## 18. Diagrama do modelo de domínio

## 19. Testes e validações realizadas

* **Cobertura (Jest automatizada):** Foram realizados os scripts de teste e cobertura que varrem as lógicas unitárias essenciais da Aplicação e do Domínio.

## 20. Instruções para execução

Siga os passos abaixo para clonar, configurar, testar e executar a versão consolidada e definitiva do Finance App em seu ambiente de desenvolvimento local:

### 1. Pré-requisitos
Certifique-se de possuir instalado em sua estação de trabalho:
* Node.js (versão `>= 18.x` recomendada)
* npm (versão `>= 9.x`)

### 2. Instalação de Dependências
Navegue até o diretório raiz do projeto e instale os pacotes necessários:
```bash
npm install
```

### 3. Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto com base no arquivo de exemplo existente.
Abra o arquivo `.env` e insira as credenciais do seu projeto do Supabase e as configurações de porta local:

```env
NEXT_PUBLIC_SUPABASE_URL=[https://seu-projeto.supabase.co](https://seu-projeto.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
NEXT_PUBLIC_AUTH_REDIRECT_URL=http://localhost:3000/auth/callback
```

### 4. Execução dos Testes Automatizados

Para rodar toda a suíte de testes unitários e de integração do domínio e da aplicação, garantindo que todas as regras de DDD estão passando com sucesso, execute:

```bash
npm run test
```

### 5. Execução do Servidor de Desenvolvimento

Inicie o servidor local do Next.js:

```bash
npm run dev
```

Após o build inicial, abra o seu navegador e acesse a URL:

```text
http://localhost:3000
```

## 21. Limitações e trabalhos futuros

## 22. Conclusão
