const inputNomeProjeto = document.getElementById("nome-projeto");
const inputDuracaoProjeto = document.getElementById("duracao-projeto");
const botaoTemporizador = document.getElementById("botao-temporizador");
const botaoIncremento = document.getElementById("botao-incremento");
const botaoDecremento = document.getElementById("botao-decremento");
const listaDeProjetos = document.getElementById("lista-de-projetos");

const statusProjeto = ["Em andamento", "Interrompido", "Concluído"];
let minutoDecimal = document.getElementById("minuto-decimal");
let minutoUnitario = document.getElementById("minuto-unitario");
let segundoDecimal = document.getElementById("segundo-decimal");
let segundoUnitario = document.getElementById("segundo-unitario");

function verificarInputs() {
    if (inputNomeProjeto.value && inputDuracaoProjeto.value) {
        return true;
    }
    return false;
}

function habilitarBotao() {
    if (verificarInputs()) {
        botaoTemporizador.style.cursor = "pointer";
        botaoTemporizador.style.opacity = 1;
    } else {
        botaoTemporizador.style.opacity = 0.7;
        botaoTemporizador.style.cursor = "initial";
    }
}

function incrementarValor() {
    inputDuracaoProjeto.value = Number(inputDuracaoProjeto.value) + 1;
}

function decrementarValor() {
    if (inputDuracaoProjeto.value <= 1) {
        inputDuracaoProjeto.value = "";
    } else {
        inputDuracaoProjeto.value = Number(inputDuracaoProjeto.value) - 1;
    }
}

function iniciarTemporizador() {
    if (verificarInputs()) {
        if (inputDuracaoProjeto.value.length == 1) {
            minutoUnitario.innerText = inputDuracaoProjeto.value[0];
        } else if (inputDuracaoProjeto.value.length == 2) {
            minutoDecimal.innerText = inputDuracaoProjeto.value[0];
            minutoUnitario.innerText = inputDuracaoProjeto.value[1];
        } else {
            alert("Valor ultrapassou do limite.");
        }

        const projeto = {
            nome: inputNomeProjeto.value,
            duracao: Number(inputDuracaoProjeto.value),
            status: statusProjeto[0],
            dataInicio: new Date(Date.now()),
        };

        let arrayProjetos = JSON.parse(localStorage.getItem('projetos')) ?? [];
        console.log(arrayProjetos);
        arrayProjetos.push(projeto);
        localStorage.setItem('projetos', JSON.stringify(arrayProjetos));
    }
}

function listarTarefas() {
    if(!localStorage.getItem('projetos')) {
        return;
    }
    const arrayProjetos = JSON.parse(localStorage.getItem('projetos')); 
    const arrayProjetosOrdenado = arrayProjetos.reverse()
    arrayProjetosOrdenado.forEach((projeto) => {
        let dataInicio = new Date(Date.parse(projeto.dataInicio));
        let dataAtual = new Date(Date.now());
        let diferencaDeDatas = dataAtual - dataInicio;
        let diferencaEmSegundos = diferencaDeDatas / 1000;
        let diferencaEmMinutos = diferencaEmSegundos / 60;
        let diferencaEmHoras = diferencaEmMinutos / 60;
        let diferencaEmDias = diferencaEmHoras / 24;
        let diferencaEmMeses = diferencaEmDias / 30;
        let dataInicioString;
        let urlImagemStatus;

        if (diferencaEmMeses.toFixed() == 1) {
            dataInicioString = `Há cerca de ${diferencaEmMeses.toFixed()} mês.`;
        } else if (diferencaEmMeses.toFixed() > 1) {
            dataInicioString = `Há cerca de ${diferencaEmMeses.toFixed()} meses.`;
        } else {
            if (diferencaEmDias.toFixed() == 1) {
                dataInicioString = `Há cerca de ${diferencaEmDias.toFixed()} dia.`;
            } else if (diferencaEmDias.toFixed() > 1) {
                dataInicioString = `Há cerca de ${diferencaEmDias.toFixed()} dias.`;
            } else {
                if (diferencaEmHoras.toFixed() == 1) {
                    dataInicioString = `Há cerca de ${diferencaEmHoras.toFixed()} hora.`;
                } else if (diferencaEmHoras.toFixed() > 1) {
                    dataInicioString = `Há cerca de ${diferencaEmHoras.toFixed()} horas.`;
                } else {
                    if (diferencaEmMinutos.toFixed() == 1) {
                        dataInicioString = `Há cerca de ${diferencaEmMinutos.toFixed()} minuto.`;
                    } else if (diferencaEmMinutos.toFixed() > 1) {
                        dataInicioString = `Há cerca de ${diferencaEmMinutos.toFixed()} minutos.`;
                    } else {
                        if (diferencaEmSegundos.toFixed() == 1) {
                            dataInicioString = `Há cerca de ${diferencaEmSegundos.toFixed()} segundo.`;
                        } else if (diferencaEmSegundos.toFixed() > 1) {
                            dataInicioString = `Há cerca de ${diferencaEmSegundos.toFixed()} segundos.`;
                        }
                    }
                }
            }
        }

        if (projeto.status == statusProjeto[0]) {
            urlImagemStatus = './assets/circulo-andamento.svg'
        } else if (projeto.status == statusProjeto[1]) {
            urlImagemStatus = './assets/circulo-interrompido.svg'
        } else if (projeto.status == statusProjeto[2]) {
            urlImagemStatus = './assets/circulo-concluido.svg'
        }

        listaDeProjetos.innerHTML += `
            <div class="uk-margin-small-top">
                <div class="uk-grid-collapse linha-tabela" uk-grid>
                    <div class="uk-width-2-5">
                        <div>${projeto.nome}</div>
                    </div>
                    <div class="uk-width-1-5">
                        <div class="uk-margin-left">${projeto.duracao}</div>
                    </div>
                    <div class="uk-width-1-5">
                        <div>${dataInicioString}</div>
                    </div>
                    <div class="uk-width-1-5">
                        <div class="uk-flex">
                            <img src="${urlImagemStatus}" class="uk-margin-right" alt="Icone do status">
                            ${projeto.status}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

if (document.location.pathname.includes("index")) {
    inputNomeProjeto.addEventListener("input", habilitarBotao);
    inputDuracaoProjeto.addEventListener("input", habilitarBotao);
    botaoIncremento.addEventListener("click", incrementarValor);
    botaoIncremento.addEventListener("click", habilitarBotao);
    botaoDecremento.addEventListener("click", decrementarValor);
    botaoDecremento.addEventListener("click", habilitarBotao);
    botaoTemporizador.addEventListener("click", iniciarTemporizador);
} else if (document.location.pathname.includes("historico")) {
    window.onload = listarTarefas();
}
