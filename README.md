# Finance | Controle Financeiro Mobile

Finance é uma aplicação web progressiva (PWA) focada em simplicidade e privacidade. Projetado especificamente para uso em dispositivos móveis, ele permite que você gerencie suas rendas e despesas diretamente do seu navegador, utilizando o seu Google Drive pessoal como banco de dados.
***
## Principais Funcionalidades
**Mobile First:** Interface pensada para o uso com uma mão, com botões acessíveis e Bottom Sheets.

**Sincronização com Google Drive:** Seus dados não ficam em servidores de terceiros; eles são salvos em um arquivo finance.json na sua própria conta Google.

**Modo Escuro:** Troca de tema inteligente com persistência de preferência.

**Inteligência Financeira:** * Replicação de rendas e despesas fixas para meses futuros.

**Gerenciamento de parcelas (ex: 1/12, 2/12) automático.**

**Privacidade:** Login via Google OAuth2 seguro.
***
## Tecnologias Utilizadas
HTML5 & CSS3: Variáveis CSS e Flexbox/Grid para layout responsivo.

JavaScript (ES6+): Manipulação de DOM, Fetch API e Async/Await.

Google Drive API v3: Persistência de dados em nuvem.

Google Identity Services: Autenticação segura.
***
## Como Executar o Projeto
### Pré-requisitos
1. Um Client ID do Google Cloud Console (com a API do Drive ativada).

2. Adicionar http://localhost e o endereço do seu site aos "Origens JavaScript autorizadas".

### Instalação e Uso Local
1. Clone o repositório:

```Bash
git clone https://github.com/seu-usuario/finance.git
```
2. Abra o arquivo js/auth.js e insira seu CLIENT_ID.

3. Para testar sem o Google Drive (Modo Debug):

  Crie um arquivo finance.json na raiz do projeto com o conteúdo: {"months": {}}.

  Execute um servidor local (ex: Live Server do VS Code) para evitar erros de CORS.

## Estrutura de Arquivos
```Plaintext
├── css/
│   └── style.css      # Estilos e variáveis de tema
├── js/
│   ├── auth.js        # Autenticação Google
│   ├── drive.js       # Comunicação com a API do Drive
│   ├── storage.js     # Fallback para LocalStorage
│   └── app.js         # Lógica de negócio e renderização
├── app.html           # Estrutura principal
├── index.html         # Tela de login
└── finance.json       # (Apenas para debug local)
```
