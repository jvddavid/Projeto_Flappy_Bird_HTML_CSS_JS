/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
flappy.js (c) 2021
Desc: JS file for project flappy
Created:  2021-10-23T03:31:17.453Z
Modified: 2021-10-23T14:51:07.208Z
*/

// Função para gerar um elemento
function NovoElemento(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

// Função Construtora para construir uma barreira 
class CriarBarreira {
    constructor(reversa = false) {
        this.elemento = NovoElemento('div', 'barreira')
        const borda = NovoElemento('div', 'borda')
        const corpo = NovoElemento('div', 'corpo')

        // Verificando o parametro reverso para adicionar o corpo ou a borda primeiramente
        this.elemento.appendChild(reversa ? corpo : borda)
        this.elemento.appendChild(reversa ? borda : corpo)
        // Função para facilitar a alteração da altura do corpo da barreira
        this.setAltura = altura => corpo.style.height = `${altura}px`
    }
}

// Testando criação de Barreira
// const b = new CriarBarreira(true)
// b.setAltura(200)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)

// Função Construtora para criar par de barreiras
class CriarParDeBarreiras {
    constructor(altura, abertura, x) {
        this.elemento = NovoElemento('div', 'par-de-barreiras')
        // Criando Barreira Superior
        this.superior = new CriarBarreira(true)
        // Criando Barreira Inferior
        this.inferior = new CriarBarreira()
        this.setAlturaBarreiras = (minRandom = 0.15, maxRandom = 0.85) => {
            // Pegando retira a abertura da altura total
            const alturaBarreira = Number(altura) - Number(abertura)
            // Gerando valor Aleatório para a barreira superior
            let aleatorioMultiply = Math.random()
            // Verificando valor maximo e minimo do random
            if (aleatorioMultiply < minRandom || aleatorioMultiply > maxRandom) {
                aleatorioMultiply = aleatorioMultiply < minRandom ? minRandom : maxRandom
            }
            // Calculando a altura de cada barreira
            const alturaBarreiraSuperior = parseInt(aleatorioMultiply * alturaBarreira)
            const alturaBarreiraInferior = alturaBarreira - alturaBarreiraSuperior
            // Alterando o valor de cada barreira
            this.superior.setAltura(alturaBarreiraSuperior)
            this.inferior.setAltura(alturaBarreiraInferior)
            // Retornando Par De Barreiras caso queira invocar outras chamadas
            return this
        }
        this.elemento.appendChild(this.superior.elemento)
        this.elemento.appendChild(this.inferior.elemento)
        // Função para pegar a posição X do elemento
        this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
        this.setX = (x) => this.elemento.style.left = `${x}px`
        // Função para pegar altura atual do elemento
        this.getLargura = () => this.elemento.clientWidth

        // Setando valores iniciais
        this.setAlturaBarreiras()
        this.setX(x)

    }
}

// Testando Par de Barreiras
// const b = new CriarParDeBarreiras(700, 200, 400)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)

class Barreiras {
    constructor(altura, largura, abertura, espaco, notificarPonto) {
        this.pares = [
            new CriarParDeBarreiras(altura, abertura, largura),
            new CriarParDeBarreiras(altura, abertura, largura + espaco),
            new CriarParDeBarreiras(altura, abertura, largura + espaco * 2),
            new CriarParDeBarreiras(altura, abertura, largura + espaco * 3)
        ]
        const deslocamento = 3
        this.animar = () => {
            this.pares.forEach(
                par => {
                    par.setX(par.getX() - deslocamento)
                    // calculando quando o elemento sair
                    if (par.getX() < -par.getLargura()) {
                        par.setX(par.getX() + (espaco * this.pares.length))
                        par.setAlturaBarreiras()
                    }

                    const meio = largura / 2
                    const cruzouOMeio = par.getX() + deslocamento >= meio && par.getX() < meio
                    if (cruzouOMeio && notificarPonto)
                        notificarPonto()
                }
            )
        }
    }
}

class CriarPassaro {
    constructor(alturaJogo) {
        let voando = false
        this.elemento = NovoElemento('img', 'passaro')
        this.elemento.src = 'imgs/passaro.png'

        this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
        this.setY = (y) => this.elemento.style.bottom = `${y}px`
        window.onkeydown = e => voando = true
        window.onkeyup = e => voando = false

        this.animar = () => {
            const novoY = this.getY() + (voando ? 8 : -5)
            // calculando a altura maxima do jogo, retirando a largura do passaro
            // a largura do pássaro possui a mesma altura e largura
            const alturaMaxima = alturaJogo - this.elemento.clientWidth
            // definindo limites de altura do pássaro
            if (novoY <= 0) {
                this.setY(0)
            } else if (novoY >= alturaMaxima) {
                this.setY(alturaMaxima)
            } else {
                this.setY(novoY)
            }
        }
        this.setY(alturaJogo / 2)
    }
}

class CriarProgresso {
    constructor() {
        this.elemento = NovoElemento('span', 'progresso')
        this.atualizarPontos = pontos => {
            this.elemento.innerHTML = pontos
        }
        this.atualizarPontos(0)
    }
}

// Fixed the values of width and height
// const barreiras = new Barreiras(690, 1190, 200, 400)
// const passaro = new CriarPassaro(690)
// const areaDoJogo = document.querySelector('[wm-flappy]')
// areaDoJogo.appendChild(passaro.elemento)
// areaDoJogo.appendChild(new CriarProgresso().elemento)
// barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
// setInterval(() => {
//     barreiras.animar()
//     passaro.animar()
// }, 20)

class FlappyBird {
    constructor() {
        let pontos = 0

        const areaDoJogo = document.querySelector('[wm-flappy]')
        const altura = areaDoJogo.clientHeight
        const largura = areaDoJogo.clientWidth
        const abertura = altura / 3
        const espaco = largura / 3

        const progresso = new CriarProgresso()
        const barreiras = new Barreiras(altura, largura, abertura, espaco,
            () => progresso.atualizarPontos(++pontos))
        const passaro = new CriarPassaro(altura)

        areaDoJogo.append(progresso.elemento, passaro.elemento)
        barreiras.pares.forEach((e) => areaDoJogo.appendChild(e.elemento))
        this.start = () => {
            // loop do jogo
            const temporizador = setInterval(() => {
                barreiras.animar()
                passaro.animar()
            }, 20)
            
        }
    }
}

new FlappyBird().start()