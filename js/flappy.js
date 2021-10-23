/*
Author: João Victor David de Oliveira (j.victordavid2@gmail.com)
flappy.js (c) 2021
Desc: JS file for project flappy
Created:  2021-10-23T03:31:17.453Z
Modified: 2021-10-23T04:37:14.430Z
*/

// Função para gerar um elemento
function NovoElemento(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

// Função Construtora para construir uma barreira 
function CriarBarreira(reversa = false) {
    this.elemento = NovoElemento('div', 'barreira')
    const borda = NovoElemento('div', 'borda')
    const corpo = NovoElemento('div', 'corpo')

    // Verificando o parametro reverso para adicionar o corpo ou a borda primeiramente
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)
    // Função para facilitar a alteração da altura do corpo da barreira
    this.setAltura = altura => corpo.style.height = `${altura}px`
}

// Testando criação de Barreira
// const b = new CriarBarreira(true)
// b.setAltura(200)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)

// Função Construtora para criar par de barreiras
function CriarParDeBarreiras(altura, abertura, x) {
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
    
    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = (x) => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth
    
    this.setAlturaBarreiras()
    this.setX(x)

}

// Testando Par de Barreiras
const b = new CriarParDeBarreiras(700, 200, 400)
document.querySelector('[wm-flappy]').appendChild(b.elemento)