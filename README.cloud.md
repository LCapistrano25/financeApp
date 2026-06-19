# Finance App - Cloud/AWS Runbook

Este documento registra as informacoes necessarias para acessar e operar o ambiente cloud da aplicacao Finance App.

## Ambiente AWS EC2

- Regiao AWS: `us-east-1` / Norte da Virginia
- Instancia: `finance-app-study`
- ID da instancia: `i-0e7392a7fececbc67`
- Tipo: `t3.micro`
- Sistema: Amazon Linux 2023
- Usuario SSH: `ec2-user`
- IP publico atual: `98.88.77.124`
- Caminho da aplicacao na EC2: `/opt/finance-app`

Importante: como a instancia nao usa IP elastico, o IP publico pode mudar ao parar/iniciar a EC2. Quando isso acontecer, atualize `EC2_HOST`, `EC2_NEXT_PUBLIC_AUTH_REDIRECT_URL` e as URLs de callback no Supabase.

## Links

- Aplicacao: http://98.88.77.124:3000
- Uptime Kuma: http://98.88.77.124:3001
- Callback Supabase/Auth: http://98.88.77.124:3000/auth/callback
- Cloud Run: https://finance-app-244561035477.southamerica-east1.run.app
- Callback Cloud Run: https://finance-app-244561035477.southamerica-east1.run.app/auth/callback

## Portas e Security Group

Security Group: `finance-app-sg`

Regras de entrada esperadas:

| Porta | Origem | Uso |
| --- | --- | --- |
| `22` | Seu IP `/32` | SSH administrativo |
| `22` | `0.0.0.0/0` | SSH temporario para GitHub Actions |
| `80` | `0.0.0.0/0` | HTTP futuro/Nginx |
| `443` | `0.0.0.0/0` | HTTPS futuro/Nginx |
| `3000` | `0.0.0.0/0` | Aplicacao Next.js |
| `3001` | Seu IP `/32` | Uptime Kuma |

Observacao: a regra SSH `0.0.0.0/0` foi usada para permitir deploy via GitHub-hosted runner. Para um ambiente mais seguro, preferir runner self-hosted, AWS SSM, VPN, ou atualizar dinamicamente os ranges do GitHub.

## Docker na EC2

Servicos:

- `finance-app`: aplicacao Next.js
- `uptime-kuma`: monitoramento

Arquivo usado na EC2:

```bash
/opt/finance-app/docker-compose.yml
```

Comandos uteis:

```bash
cd /opt/finance-app
docker compose ps
docker compose logs -f finance-app
docker compose logs -f uptime-kuma
docker compose down --remove-orphans
docker compose up -d --no-build
docker system df
df -h
free -h
```

## GitHub Actions CD

Workflow:

```text
.github/workflows/deploy-ec2.yml
```

Fluxo atual:

1. GitHub Actions faz build da imagem Docker.
2. A imagem e enviada para a EC2 via SSH/SCP.
3. A EC2 carrega a imagem com `docker load`.
4. A EC2 sobe os servicos com `docker compose up -d --no-build`.

Esse modelo evita compilar Next.js dentro da `t3.micro`.

## GitHub Secrets

Cadastrar em:

```text
Repository -> Settings -> Secrets and variables -> Actions
```

Secrets necessarios para AWS EC2:

```env
EC2_HOST=98.88.77.124
EC2_USER=ec2-user
EC2_APP_PATH=/opt/finance-app
EC2_SSH_KEY=conteudo-da-chave-privada-de-deploy

EC2_NEXT_PUBLIC_SUPABASE_URL=https://ipkvvsonczeecsusquve.supabase.co
EC2_NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
EC2_NEXT_PUBLIC_API_URL=http://localhost:8000
EC2_NEXT_PUBLIC_AUTH_REDIRECT_URL=http://98.88.77.124:3000/auth/callback
```

Secrets necessarios para Google Cloud Run:

```env
GCP_PROJECT_ID=seu-projeto-gcp
GCP_WORKLOAD_IDENTITY_PROVIDER=seu-provider
GCP_SERVICE_ACCOUNT=sua-service-account

CLOUD_RUN_NEXT_PUBLIC_SUPABASE_URL=https://ipkvvsonczeecsusquve.supabase.co
CLOUD_RUN_NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
CLOUD_RUN_NEXT_PUBLIC_API_URL=
CLOUD_RUN_NEXT_PUBLIC_AUTH_REDIRECT_URL=https://finance-app-244561035477.southamerica-east1.run.app/auth/callback
```

Nao versionar a chave privada. Ela deve ficar somente no GitHub Secrets.

## Supabase

No painel do Supabase, configurar as URLs de autenticacao para Cloud Run, EC2 e desenvolvimento local.

Callback da EC2:

```text
http://98.88.77.124:3000/auth/callback
```

Callback do Cloud Run:

```text
https://finance-app-244561035477.southamerica-east1.run.app/auth/callback
```

Callback local:

```text
http://localhost:3000/auth/callback
```

Site URL recomendado:

```text
https://finance-app-244561035477.southamerica-east1.run.app
```

Se o Supabase permitir apenas uma Site URL principal, use a URL do ambiente principal e cadastre os demais dominios/callbacks em Additional Redirect URLs.

Quando o IP da EC2 mudar, atualizar:

- `EC2_NEXT_PUBLIC_AUTH_REDIRECT_URL` no GitHub Secrets
- Callback URL no Supabase
- Site URL no Supabase, se configurado

## Testes de Acesso SSH

No PowerShell local:

```powershell
cd $env:USERPROFILE\Downloads
ssh -i .\finance-app-key.pem ec2-user@98.88.77.124
```

Teste da chave usada pelo GitHub Actions:

```powershell
cd $env:USERPROFILE\Downloads
ssh -i .\finance-app-github-actions -o StrictHostKeyChecking=accept-new -o ServerAliveInterval=30 -o ServerAliveCountMax=5 ec2-user@98.88.77.124 "echo SSH_WORKFLOW_STYLE_OK"
```

Resultado esperado:

```text
SSH_WORKFLOW_STYLE_OK
```

## Quando o IP mudar

Se a instancia for parada e iniciada, o IP publico pode mudar.

Checklist:

1. Copiar o novo IPv4 publico da EC2.
2. Atualizar `EC2_HOST` no GitHub Secrets.
3. Atualizar `EC2_NEXT_PUBLIC_AUTH_REDIRECT_URL` no GitHub Secrets.
4. Atualizar callback e Site URL no Supabase.
5. Testar SSH local com a chave de deploy.
6. Rodar novamente o workflow `CD EC2`.

## Observacoes de Custo

- Instancia atual: `t3.micro`
- Disco atual: `16 GiB gp3`
- Evitar CloudWatch detalhado para estudo.
- Evitar IP elastico parado sem associacao, pois pode gerar custo.
- Parar a instancia quando nao estiver estudando reduz custo de compute, mas pode trocar o IP publico.
