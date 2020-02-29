/* Classe Bloco */

class Bloco {

    constructor(dados) {

        this.hash = '',
        this.height = 0,
        this.body = dados,
        this.time = 0,
        this.previousBlockHash = ''

    }

}

module.exports = Bloco