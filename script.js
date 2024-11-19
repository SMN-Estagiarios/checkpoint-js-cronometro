const inputNomeProjeto = document.getElementById("nome-projeto")
const inputDuracaoProjeto = document.getElementById("duracao-projeto")
const botaoTemporizador = document.getElementById("botao-temporizador")
const botaoIncremento = document.getElementById("botao-incremento")
const botaoDecremento = document.getElementById("botao-decremento")

function habilitarBotao() {
    if (inputNomeProjeto.value && inputDuracaoProjeto.value) {
        botaoTemporizador.style.cursor = 'pointer';
        botaoTemporizador.style.opacity = 1;
    } else {
        botaoTemporizador.style.opacity = 0.7;
        botaoTemporizador.style.cursor = 'initial';
    }
}

function incrementarValor() {
    inputDuracaoProjeto.value = Number(inputDuracaoProjeto.value) + 1;
}

function decrementarValor() {
    if (inputDuracaoProjeto.value == 0) {
        inputDuracaoProjeto.value = ''
    } else {
        inputDuracaoProjeto.value = Number(inputDuracaoProjeto.value) - 1;
    }
}

inputNomeProjeto.addEventListener('input', habilitarBotao);
inputDuracaoProjeto.addEventListener('input', habilitarBotao);
botaoIncremento.addEventListener('click', incrementarValor)
botaoDecremento.addEventListener('click', decrementarValor)