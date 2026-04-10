# Configuração do Banco de Dados

## Problema Comum

Após reiniciar o WSL ou o PC, o Prisma Client gerado pode ficar fora de sync com o banco de dados, causando erros.

## Solução Correta

### Ao iniciar o projeto (após reiniciar o PC/WSL):



### Comandos Disponíveis

| Comando | O que faz | Reseta o banco? |
|---------|-----------|-----------------|
| prisma migrate dev | Gera o Prisma Client | ❌ Não |
| prisma migrate deploy | Aplica migrations em produção | ❌ Não |
| prisma migrate dev | Desenvolvimento com migrations | ⚠️ Sim, se detectar mismatch |

### ⚠️ NUNCA use  se quiser preservar os dados!

O comando  é feito para desenvolvimento e **pode resetar o banco** se detectar que o schema está fora de sync.

### Se precisar adicionar dados de teste

Crie um arquivo  e rode:

