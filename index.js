/* Etapa 2 - Desenvolver uma RESTful API com GET/POST endpoints.
*
* Criando Uma RESTful API com GET/POST Endpoints.
*
*/ 

// Dependências

// Framework para aplicação web (para criar web service)
const express = require('express')

// Cria a app
const app = express()

/* Para tratar uma solicitação HTTP POST no Express.js versão 4 e superior, é necessário instalar o módulo de middleware 
 chamado body-parser. Esse pacote extrai toda a parte do corpo de uma request de entrada e a expõe em req.body.  */
const bodyParser = require('body-parser')

// Bloco e Blockchain
const Block = require('./bloco')
const Blockchain = require('./blockchain')

// Criando instância da classe Blockchain, ou seja, uma nova Blockchain.
const chain = new Blockchain()

// Porta da API
app.listen(8001, () => console.log('API ouvindo na porta 8001'))

// Parse do corpo das requisições
app.use(bodyParser.json())


// Método GET informando que somente /bloco e /bloco/{BLOCK_HEIGHT} podem ser usados como recursos
// http://localhost:8001/
app.get('/', (req, res) => res.status(404).json({
  "status": 404,
  "message": "Endpoints aceitos: POST /bloco ou GET /bloco/{BLOCK_HEIGHT}"
}))


// Obtém id do bloco com método GET
app.get('/bloco/:height', async (req, res) => {
  try {
    const response = await chain.getBlock(req.params.height)
    res.send(response)
  } catch (error) {
    res.status(404).json({
      "status": 404,
      "message": "Bloco não encontrado"
    })
  }
})


// Gravando um bloco na Blockchain com método POST
app.post('/bloco', async (req, res) => {
  if (req.body.body === '' || req.body.body === undefined) {
    res.status(400).json({
      "status": 400,
      message: "Dados do corpo do Bloco"
    })
  }

  await chain.adicionaBloco(new Block(req.body.body))
  const height = await chain.getBlockHeight()
  const response = await chain.getBlock(height)

  res.status(201).send(response)
})
