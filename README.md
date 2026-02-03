# AM-Dashboard
Repositório destinado ao projeto de Dashboard Administrativo para o desafio técnico da AMentoria.

# Descrição
O projeto consiste em criar um sistema que possua login e um dashboard com métricas e filtros importantes para uma determinada empresa.

## Escolha de Empresa
Para seguir no ramo da AMentoria, optei por fazer o dashboard de uma empresa que vende cursos para alunos do ensino fundamental, médio e intensivos para vestibular/enem

# Instalação
Para instalar o projeto, basta clonar esse repositório, navegar até a pasta de frontend e backend, e rodar o "npm install"

# Variáveis de ambiente
## .env - Backend
Para o backend, são necessárias as seguintes variáveis:
- DATABASE_URL='connection_string_do_seu_bd'
- JWT_SECRET='secret_do_jwt'
- FRONTEND_URL='url_de_permissao_do_cors'

## .env - front
Para o frontend, são necessárias as seguintes variáveis:
VITE_API_URL='url_base_da_api'

# Rodando Localmente
Após realizar a instalação e configurações das envs, deve-se rodar:
## No Backend
1. npx prisma migrate dev --name init_cloned_project (Cria as tabelas no banco)
2. npx prisma db seed (Gera dados no banco)
3. npm run start:dev (Inicia a aplicação)
4. curl -X POST http://localhost:3000/users \
   -H 'Content-Type: application/json' \
   -d '{"name": "Admin", "email": "admin@teste.com", "password": "123456"}' (Cria um usuário para você conseguir logar)
## No Frontend
1. npm run dev

# Crendenciais de Teste
- email: admintester@gmail.com
- password: Admin123Admin


# Esquema do BD
<img width="2186" height="1775" alt="shapes at 26-02-02 23 25 57" src="https://github.com/user-attachments/assets/a1563a0c-f101-4fef-afef-28aad7eae14f" />

   
