# crawlerml

## Descrição
Trata-se de um crawler de demonstração criado para a resolução de um desafio proposto, para ser executado em Node.js.

## Considerações
1. ATENÇÃO - Usar apenas para pequenos testes privados. Para manter o crawler simples não foram tomadas precauções de segurança nem mesmo uso de Helmet.

2. A API do ML atualmente limita os resultado a no máximo 50 itens. Para realizar buscas de mais resultados, é necessário utilizar offset. É possível realizar várias requisições e concatenar os resultados, mas para manter o crawler simples, não foi implementado.

## Setup e Inicialização
- Setup - Deve-se ter o Node.js e npm (ou yarn, mas como exemplo usaremos npm) instalados na máquina. Navegue para a raiz do repositório clonado. Execute o comando a seguir:

```npm install```

- Inicialização - Inicialize o arquivo server.js com o node com o comando a seguir. Ele rodará na porta 8337 caso nenhuma seja definida para o processo.

```node server.js```
