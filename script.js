function pegarClasseDoElemento(classe, posicao = 0) {
    let elemento = document.getElementsByClassName(classe)[posicao];

    return elemento
}

function pegarIdDoElemento(id) {
    let elemento = document.getElementById(id);

    return elemento
}

let digitoMinutoEsquerda = pegarClasseDoElemento("temporizador-numero", 0);
let digitoMinutoDireita = pegarClasseDoElemento("temporizador-numero", 1);
let digitoSegundoEsquerda = pegarClasseDoElemento("temporizador-numero", 2);
let digitoSegundoDireita = pegarClasseDoElemento("temporizador-numero", 3);

let botaoTemporizador = pegarClasseDoElemento("temporizador-botao");
let imagemBotaoTemporizador = pegarIdDoElemento("botao-temporizador-imagem");
let textoBotaoTemporizador = pegarIdDoElemento('botao-temporizador-texto');

let nomeProjeto = pegarIdDoElemento("input_nome_task");
let tempoProjeto = pegarIdDoElemento("input_previsao_tempo_task");

function checarInput() {
    if(nomeProjeto.value == "" || tempoProjeto.value == "") {
        botaoTemporizador.disabled = true;
    }
    else {
        botaoTemporizador.disabled = false;
    }
}

nomeProjeto.addEventListener('input', checarInput);
tempoProjeto.addEventListener('input', checarInput);

function limparTimer() {
    digitoSegundoDireita.innerHTML = "0";
    digitoSegundoEsquerda.innerHTML = "0";
    digitoMinutoDireita.innerHTML = "0";
    digitoMinutoEsquerda.innerHTML = "0";
}

function adicionarDigito(elemento, valorMaximo) {
    let valorAtual = Number(elemento.innerHTML);

    if(valorAtual < valorMaximo) {
        elemento.innerHTML = valorAtual + 1;
    }
    else {
        elemento.innerHTML = 0;
        return true;
    }

    return false;
}

let projetos = JSON.parse(sessionStorage.getItem("Projeto")) || [];

function guardarDadosProjeto(nomeProjeto, tempoProjeto, status) {
    let dia = new Date();

    let novoProjeto = {
        id: projetos.length,
        nome: nomeProjeto,
        tempo: tempoProjeto,
        inicio: `${dia.getDate()}/${dia.getMonth()}`,
        status: status
    }

    projetos.push(novoProjeto);

    sessionStorage.setItem("Projeto", JSON.stringify(projetos));
}

let timer;
let timerEmAndamento = false;

function tratarBotaoTemporizador(event) {
    event.preventDefault();
    limparTimer();

    if(timerEmAndamento) {
        guardarDadosProjeto(nomeProjeto.value, tempoProjeto.value, "Interrompido");

        timerEmAndamento = false;
    }

    timerEmAndamento = !timerEmAndamento;
    let minutoAtual = 0;

    botaoTemporizador.classList.toggle("temporizador-botao-ativo");

    if(botaoTemporizador.classList.contains("temporizador-botao-ativo")){        
        imagemBotaoTemporizador.src = "/assets/images/stop.svg";
        textoBotaoTemporizador.innerHTML = "Interromper";
        timer = setInterval(() => {
            if(adicionarDigito(digitoSegundoDireita, 9)) {
                if(adicionarDigito(digitoSegundoEsquerda, 5)) {
                    minutoAtual = Number(digitoMinutoEsquerda.textContent + digitoMinutoDireita.textContent) + 1;

                    if(minutoAtual == tempoProjeto.value) {
                        clearInterval(timer);
                        guardarDadosProjeto(nomeProjeto.value, tempoProjeto.value, "Finalizado");
                        timerEmAndamento = false;

                        botaoTemporizador.classList.toggle("temporizador-botao-ativo");
                        imagemBotaoTemporizador.src = "/assets/images/play.svg";
                        textoBotaoTemporizador.innerHTML = "Começar";
                    }

                    if(adicionarDigito(digitoMinutoDireita, 9)) {
                        
                        adicionarDigito(digitoMinutoEsquerda, 6);
                    }
                }
            }
        }, 1000);
    }
    else {
        imagemBotaoTemporizador.src = "/assets/images/play.svg";
        textoBotaoTemporizador.innerHTML = "Começar";
        clearInterval(timer);
    }
}

botaoTemporizador.addEventListener('click', tratarBotaoTemporizador);
