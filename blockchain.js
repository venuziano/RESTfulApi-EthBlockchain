/* Etapa 1 - Criar uma Blockchain Privada
*
* Criando uma Blockchain com levelDB para persistir o conjunto de dados usando a biblioteca level do Node.js.
*
*/ 

// Dependências
const SHA256 = require('crypto-js/sha256')
const Bloco = require('./bloco')
const db = require('level')('./dados/chain')

class Blockchain {
    
  constructor() {
    
    this.getBlockHeight().then((height) => {
      
        if (height === -1) {
        this.adicionaBloco(new Bloco("Bloco Genesis")).then(() => console.log("Bloco Genesis adicionado!"))
    
        }
    })
  }

  // Método para adicionar um bloco
  async adicionaBloco(newBlock) {
    const height = parseInt(await this.getBlockHeight())

    newBlock.height = height + 1
    newBlock.time = new Date().getTime().toString().slice(0, -3)

    if (newBlock.height > 0) {
      const prevBlock = await this.getBlock(height)
      newBlock.previousBlockHash = prevBlock.hash
      console.log(`Hash Anterior: ${newBlock.previousBlockHash}`)
    }

    // Hash
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString()
    console.log(`Novo hash: ${newBlock.hash}`)

    await this.addBlockToDB(newBlock.height, JSON.stringify(newBlock))
  }


  // Método para obter o id de um bloco
  async getBlockHeight() {
    return await this.getBlockHeightFromDB()
  }


  // Método para obter um bloco
  async getBlock(blockHeight) {
    return await this.getBlockByHeight(blockHeight)
  }


  // Método para validar um bloco
  async validaBloco(blockHeight) {
    let block = await this.getBlock(blockHeight)
    const blockHash = block.hash
    block.hash = ''
    
    let validBlockHash = SHA256(JSON.stringify(block)).toString()

    if (blockHash === validBlockHash) {
        return true
      } else {
        console.log(`Bloco #${blockHeight} hash inválido: ${blockHash} <> ${validBlockHash}`)
        return false
      }
  }


  // Método para validar a Blockchain
  async validaChain() {
    let errorLog = []
    let previousHash = ''
    let isValidBlock = false

    const heigh = await this.getBlockHeightFromDB()

    for (let i = 0; i < heigh; i++) {
      this.getBlock(i).then((block) => {
        isValidBlock = this.validaBloco(block.height)

        if (!isValidBlock) {
          errorLog.push(i)
        } 

        if (block.previousBlockHash !== previousHash) {
          errorLog.push(i)
        }

        previousHash = block.hash

        if (i === (heigh -1)) {
          if (errorLog.length > 0) {
            console.log(`Erros em Blocos = ${errorLog.length}`)
            console.log(`Blocos: ${errorLog}`)
          } else {
            console.log('Nenhum erro detectado')
          }
        }
      })
    }
  }


  // Funções do Level db

  // Adiciona um bloco no database para persistência
  async addBlockToDB(key, value) {
    return new Promise((resolve, reject) => {
      db.put(key, value, (error) => {
        if (error) {
          return reject(error)
        }

        console.log(`Bloco adicionado #${key}`)
        return resolve(`Bloco adicionado #${key}`)
      })
    })
  }

  // Obtém o id de um bloco do database
  async getBlockHeightFromDB() {
    return new Promise((resolve, reject) => {
      let height = -1

      db.createReadStream().on('data', (data) => {
        height++
      }).on('error', (error) => {
        return reject(error)
      }).on('close', () => {
        return resolve(height)
      })
    })
  }

  // Obtém um bloco pelo id
  async getBlockByHeight(key) {
    return new Promise((resolve, reject) => {
      db.get(key, (error, value) => {
        if (value === undefined) {
          return reject('Not found')
        } else if (error) {
          return reject(error)
        }

        value = JSON.parse(value)

        return resolve(value)
      })
    })
  }
}

module.exports = Blockchain
