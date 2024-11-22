const inputNomeTarefa = document.getElementById("nome-tarefa");
const inputDuracaoTarefa = document.getElementById("duracao-tarefa");
const botaoTemporizadorComecar = document.getElementById("botao-temporizador-comecar");
const botaoTemporizadorInterromper = document.getElementById("botao-temporizador-interromper");
const botaoIncremento = document.getElementById("botao-incremento");
const botaoDecremento = document.getElementById("botao-decremento");
const listaDeTarefas = document.getElementById("lista-de-tarefas");
const abaTemporizador = document.getElementById("link-temporizador");
const abaHistorico = document.getElementById("link-historico");
const linkIgnite = document.getElementById("link-ignite");
const containerRegistrarTarefa = document.getElementById("container-registrar-tarefa");
const containerHistorico = document.getElementById("container-historico");
const iconeBotao = document.getElementById("icone-botao");
const textoBotao = document.getElementById("texto-botao");
const conteudoMain = document.getElementById("conteudo-main");
const statusTarefa = ["Em andamento", "Interrompido", "Concluído"];
let minutoDecimal = document.getElementById("minuto-decimal");
let minutoUnitario = document.getElementById("minuto-unitario");
let segundoDecimal = document.getElementById("segundo-decimal");
let segundoUnitario = document.getElementById("segundo-unitario");
let contadorTemporizador;

function verificarInputs() {
    if (inputNomeTarefa.value && inputDuracaoTarefa.value) {
        return true;
    }
    return false;
}

function habilitarBotao() {
    if (verificarInputs()) {
        botaoTemporizadorComecar.style.cursor = "pointer";
        botaoTemporizadorComecar.style.opacity = 1;
    } else {
        botaoTemporizadorComecar.style.opacity = 0.7;
        botaoTemporizadorComecar.style.cursor = "initial";
    }
}

function incrementarValor() {
    inputDuracaoTarefa.value = Number(inputDuracaoTarefa.value) + 1;
}

function decrementarValor() {
    if (inputDuracaoTarefa.value <= 1) {
        inputDuracaoTarefa.value = "";
    } else {
        inputDuracaoTarefa.value = Number(inputDuracaoTarefa.value) - 1;
    }
}

function iniciarTarefa() {
    let arrayTarefas;

    if (verificarInputs()) {
        if (inputDuracaoTarefa.value.length == 1) {
            minutoUnitario.innerText = inputDuracaoTarefa.value[0];
        } else if (inputDuracaoTarefa.value.length == 2) {
            minutoDecimal.innerText = inputDuracaoTarefa.value[0];
            minutoUnitario.innerText = inputDuracaoTarefa.value[1];
        } else {
            return alert("Valor ultrapassou do limite.");
        }

        botaoTemporizadorComecar.style.display = "none";
        botaoTemporizadorInterromper.style.display = "flex";
        inputNomeTarefa.innerHTML = inputNomeTarefa.value;
        inputDuracaoTarefa.innerHTML = inputDuracaoTarefa.value;

        const tarefa = {
            id: Date.now(),
            nome: inputNomeTarefa.value,
            duracao: minutoDecimal.innerText == 0 ? minutoUnitario.innerText : minutoDecimal.innerText + minutoUnitario.innerText,
            status: statusTarefa[0],
            dataInicio: new Date(Date.now()),
        };

        arrayTarefas = JSON.parse(localStorage.getItem("tarefas")) ?? [];
        arrayTarefas.push(tarefa);
        localStorage.setItem("tarefas", JSON.stringify(arrayTarefas));
    }
}

function listarTarefas() {
    let textoMinuto;
    let dataInicio;
    let dataAtual;
    let diferencaDeDatas;
    let diferencaEmSegundos;
    let diferencaEmMinutos;
    let diferencaEmHoras;
    let diferencaEmDias;
    let diferencaEmMeses;
    let dataInicioString;
    let urlImagemStatus;

    if (!localStorage.getItem("tarefas")) {
        listaDeTarefas.innerHTML = "";
        return;
    }

    listaDeTarefas.innerHTML = "";

    const arrayTarefas = JSON.parse(localStorage.getItem("tarefas"));
    const arrayTarefasOrdenado = arrayTarefas.reverse();
    arrayTarefasOrdenado.map((tarefa) => {
        textoMinuto = Number(tarefa.duracao) > 1 ? "minutos" : "minuto";
        dataInicio = new Date(Date.parse(tarefa.dataInicio));
        dataAtual = new Date(Date.now());
        diferencaDeDatas = dataAtual - dataInicio;
        diferencaEmSegundos = diferencaDeDatas / 1000;
        diferencaEmMinutos = diferencaEmSegundos / 60;
        diferencaEmHoras = diferencaEmMinutos / 60;
        diferencaEmDias = diferencaEmHoras / 24;
        diferencaEmMeses = diferencaEmDias / 30;

        if (diferencaEmMeses.toFixed() == 1) {
            dataInicioString = `Há cerca de ${diferencaEmMeses.toFixed()} mês`;
        } else if (diferencaEmMeses.toFixed() > 1) {
            dataInicioString = `Há cerca de ${diferencaEmMeses.toFixed()} meses`;
        } else {
            if (diferencaEmDias.toFixed() == 1) {
                dataInicioString = `Há cerca de ${diferencaEmDias.toFixed()} dia`;
            } else if (diferencaEmDias.toFixed() > 1) {
                dataInicioString = `Há cerca de ${diferencaEmDias.toFixed()} dias`;
            } else {
                if (diferencaEmHoras.toFixed() == 1) {
                    dataInicioString = `Há cerca de ${diferencaEmHoras.toFixed()} hora`;
                } else if (diferencaEmHoras.toFixed() > 1) {
                    dataInicioString = `Há cerca de ${diferencaEmHoras.toFixed()} horas`;
                } else {
                    if (diferencaEmMinutos.toFixed() == 1) {
                        dataInicioString = `Há cerca de ${diferencaEmMinutos.toFixed()} minuto`;
                    } else if (diferencaEmMinutos.toFixed() > 1) {
                        dataInicioString = `Há cerca de ${diferencaEmMinutos.toFixed()} minutos`;
                    } else {
                        if (diferencaEmSegundos.toFixed() <= 1) {
                            dataInicioString = `Há cerca de ${diferencaEmSegundos.toFixed()} segundo`;
                        } else if (diferencaEmSegundos.toFixed() > 1) {
                            dataInicioString = `Há cerca de ${diferencaEmSegundos.toFixed()} segundos`;
                        }
                    }
                }
            }
        }

        if (tarefa.status == statusTarefa[0]) {
            urlImagemStatus = "./assets/circulo-andamento.svg";
        } else if (tarefa.status == statusTarefa[1]) {
            urlImagemStatus = "./assets/circulo-interrompido.svg";
        } else if (tarefa.status == statusTarefa[2]) {
            urlImagemStatus = "./assets/circulo-concluido.svg";
        }

        listaDeTarefas.innerHTML += `
            <div class="uk-margin-small-top">
                <div class="uk-grid-collapse linha-tabela" uk-grid>
                    <div class="uk-width-2-5">
                        <div>${tarefa.nome}</div>
                    </div>
                    <div class="uk-width-1-5">
                        <div>${tarefa.duracao} ${textoMinuto}</div>
                    </div>
                    <div class="uk-width-1-5">
                        <div>${dataInicioString}</div>
                    </div>
                    <div class="uk-width-1-5">
                        <div class="uk-flex">
                            <img src="${urlImagemStatus}" class="uk-margin-right" alt="Icone do status">
                            ${tarefa.status}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

function habilitarContainerRegistroTarefa() {
    if (containerRegistrarTarefa.style.display == "" || containerRegistrarTarefa.style.display == "none") {
        containerRegistrarTarefa.style.display = "block";
        containerHistorico.style.display = "none";
        abaHistorico.innerHTML = `<img src="./assets/lista-desativada.svg" alt="Icone da lista para o histórico" />`;
        abaTemporizador.innerHTML = `<img src="./assets/relogio-ativado.svg" alt="Icone do relogio" />`;

        if (!conteudoMain.classList.contains("uk-margin-auto-vertical") && !conteudoMain.classList.contains("uk-width-1-2")) {
            conteudoMain.classList.add("uk-margin-auto-vertical");
            conteudoMain.classList.add("uk-width-1-2");
        }

        if (conteudoMain.classList.contains("uk-margin-medium-top") && conteudoMain.classList.contains("uk-width-4-5")) {
            conteudoMain.classList.remove("uk-margin-medium-top");
            conteudoMain.classList.remove("uk-width-4-5");
        }
    }
}

function habilitarContainerHistorico() {
    if (containerHistorico.style.display == "" || containerHistorico.style.display == "none") {
        containerHistorico.style.display = "block";
        containerRegistrarTarefa.style.display = "none";
        abaHistorico.innerHTML = `<img src="./assets/lista-ativada.svg" alt="Icone da lista para o histórico" />`;
        abaTemporizador.innerHTML = `<img src="./assets/relogio-desativado.svg" alt="Icone do relogio" />`;
    }

    if (conteudoMain.classList.contains("uk-margin-auto-vertical") && conteudoMain.classList.contains("uk-width-1-2")) {
        conteudoMain.classList.remove("uk-margin-auto-vertical");
        conteudoMain.classList.remove("uk-width-1-2");
    }

    if (!conteudoMain.classList.contains("uk-margin-medium-top") && !conteudoMain.classList.contains("uk-width-4-5")) {
        conteudoMain.classList.add("uk-margin-medium-top");
        conteudoMain.classList.add("uk-width-4-5");
    }
}

function iniciarContagem() {
    iniciarTarefa();
    let minutos = Number(minutoDecimal.innerText + minutoUnitario.innerText);
    let segundos = Number(segundoDecimal.innerText + segundoUnitario.innerText);

    contadorTemporizador = setInterval(() => {
        if (segundos == 0 && minutos > 0) {
            minutos--;
            segundos = 59;
        } else if (segundos <= 59 && segundos > 0) {
            segundos--;
        } else {
            pararTempo();
        }

        if (segundos < 10) {
            segundoDecimal.innerText = 0;
            segundoUnitario.innerText = segundos;
        } else {
            segundoDecimal.innerText = segundos.toString()[0];
            segundoUnitario.innerText = segundos.toString()[1];
        }

        if (minutos < 10) {
            minutoDecimal.innerText = 0;
            minutoUnitario.innerText = minutos;
        } else {
            minutoDecimal.innerText = minutos.toString()[0];
            minutoUnitario.innerText = minutos.toString()[1];
        }
    }, 1000);
    listarTarefas();
}

function pararTempo() {
    clearInterval(contadorTemporizador);
    let arrayTarefas = JSON.parse(localStorage.getItem("tarefas"));
    let duracaoEmSegundos = Number(inputDuracaoTarefa.value) * 60 - (Number(minutoDecimal.innerText + minutoUnitario.innerText) * 60 + Number(segundoDecimal.innerText + segundoUnitario.innerText));
    let duracaoAproximadaEmMinutos = duracaoEmSegundos / 60;
    arrayTarefas[arrayTarefas.length - 1].duracao = duracaoAproximadaEmMinutos.toFixed();

    if (minutoDecimal.innerText == 0 && minutoUnitario.innerText == 0 && segundoDecimal.innerText == 0 && segundoUnitario.innerText == 0) {
        arrayTarefas[arrayTarefas.length - 1].status = statusTarefa[2];
    } else {
        arrayTarefas[arrayTarefas.length - 1].status = statusTarefa[1];
    }

    botaoTemporizadorComecar.style.display = "flex";
    botaoTemporizadorInterromper.style.display = "none";

    minutoDecimal.innerText = 0;
    minutoUnitario.innerText = 0;
    segundoDecimal.innerText = 0;
    segundoUnitario.innerText = 0;
    inputDuracaoTarefa.value = "";
    inputNomeTarefa.value = "";

    localStorage.setItem("tarefas", JSON.stringify(arrayTarefas));
    listarTarefas();
}

inputNomeTarefa.addEventListener("input", habilitarBotao);
inputDuracaoTarefa.addEventListener("input", habilitarBotao);
botaoIncremento.addEventListener("click", incrementarValor);
botaoIncremento.addEventListener("click", habilitarBotao);
botaoDecremento.addEventListener("click", decrementarValor);
botaoDecremento.addEventListener("click", habilitarBotao);
botaoTemporizadorComecar.addEventListener("click", iniciarContagem);
botaoTemporizadorInterromper.addEventListener("click", pararTempo);
linkIgnite.addEventListener("click", habilitarContainerRegistroTarefa);
abaTemporizador.addEventListener("click", habilitarContainerRegistroTarefa);
abaHistorico.addEventListener("click", habilitarContainerHistorico);
abaHistorico.addEventListener("click", listarTarefas);
