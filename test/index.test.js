/* Etapa 3 - Configurar os endpoints com dados de teste
*
* Configurar os endpoints com dados de teste
*
*/ 

// Dependências

// Ava é um testador de scripts JavaScript
const testa_js = require('ava')

// Supertest é um pacote para testar APIs que oferece chamadas HTTP
const testa_api = require('supertest')

// URL base da nossa API
const BASE_URL = 'http://localhost:8001'

// Teste da URL base
testa_js.before('Precisa especificar a BASE_URL', t => {
  t.truthy(BASE_URL)
})

// API
const app = require('../index')

// Testa o método POST
testa_js.cb('1. /bloco: deve retornar um novo bloco adicionado', (t) => {
    testa_api(BASE_URL)
    .post('/bloco')
    .send({body: 'Isso é apenas um teste'})
    .expect(201)
    .expect((response) => {
      t.hasOwnProperty('hash')
      t.hasOwnProperty('height')
      t.hasOwnProperty('body')
      t.hasOwnProperty('time')
      t.hasOwnProperty('previousBlockHash')
    })
    .end(t.end)
})

// Testa o método GET
testa_js.cb('2. /bloco/height: deve retornar o bloco por id', (t) => {
  setTimeout(() => {
    testa_api(BASE_URL)
      .get('/bloco/1')
      .expect(200)
      .expect((response) => {
        t.hasOwnProperty('hash')
        t.hasOwnProperty('height')
        t.hasOwnProperty('body')
        t.hasOwnProperty('time')
        t.hasOwnProperty('previousBlockHash')
      })
      .end(t.end)
  }, 1000)
})
