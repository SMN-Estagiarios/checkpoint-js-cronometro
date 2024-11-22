document.addEventListener('DOMContentLoaded', function() {
    const timerLink = document.getElementById('timer-link');
    const historicoLink = document.getElementById('lista-link');
    const timerImagem = document.getElementById('timer-image');
    const historicoImagem = document.getElementById('lista-image');
    const containerTimer = document.querySelector('.container-timer');
    const containerHistorico = document.querySelector('.container-historico');
    const botaoMenosInputTempo = document.getElementById('botao-menos');
    const botaoMaisInputTempo = document.getElementById('botao-mais');
    const tempoProjetoInput = document.getElementById('tempo-projeto');
    const numeroMinutos1 = document.querySelectorAll('.numero-timer')[0];
    const numeroMinutos2 = document.querySelectorAll('.numero-timer')[1];
    const numeroSegundos1 = document.querySelectorAll('.numero-timer')[2];
    const numeroSegundos2 = document.querySelectorAll('.numero-timer')[3];
    const botaoIniciarFinalizar = document.querySelector('.iniciar-timer');
    const botaoImagem = document.getElementById('botaoImagem');
    const campoNome = document.getElementById('texto-projeto');
    const campoTempo = document.getElementById('tempo-projeto');  
    let segundos = 0;
    let timer;
    let cronometroAtivo = false;
    let tarefaAtualId = null;

    function mudarIcone() {
        historicoLink.addEventListener('click', function() {
            historicoImagem.src = "./assets/listaativa.svg";
            timerImagem.src = "./assets/timerdesativado.svg";
            containerTimer.style.display = "none";
            containerHistorico.style.display = "block";
        });

        timerLink.addEventListener('click', function() {
            historicoImagem.src = "./assets/listadesativa.svg";
            timerImagem.src = "./assets/timerativado.svg";
            containerTimer.style.display = "block";
            containerHistorico.style.display = "none";
        });
    };
    mudarIcone();

    function adicionarTempoInput() {
        botaoMenosInputTempo.addEventListener('click', function() {
            if (cronometroAtivo){
                return;
            }
            let tempo = parseInt(tempoProjetoInput.value) || 0;
            tempo = tempo > 0 ? tempo - 1 : 0;
            tempoProjetoInput.value = tempo;
        });    
        botaoMaisInputTempo.addEventListener('click', function() {
            if (cronometroAtivo){
                return;
            }
            let tempo = parseInt(tempoProjetoInput.value) || 0;            
            tempo++;            
            tempoProjetoInput.value = tempo;
        });        
    }
    adicionarTempoInput();

    function salvarTarefa() {
        const nomeTarefa = campoNome.value.trim();
        const tempoTarefa = campoTempo.value.trim();
        const dataatual = new Date();
        const status = 'Em andamento';    
        if (nomeTarefa && tempoTarefa && dataatual) {
            const tarefa = {
                id: tarefaAtualId || Date.now(),
                nome: nomeTarefa,
                tempo: tempoTarefa,
                data: dataatual,
                status: status
            };    
            let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
            tarefas.push(tarefa);
            localStorage.setItem('tarefas', JSON.stringify(tarefas));                
            exibirTarefas();
        }
    };

    function exibirTarefas() {
        let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        tarefas.reverse();
        const containerLista = document.querySelector('.container-lista');    
        containerLista.innerHTML = '';
        tarefas.forEach(tarefa => {
            if (tarefa === null || tarefa === undefined) {
                console.error('Tarefa nula ou indefinida.');
                return;
            }
            const tarefaDiv = document.createElement('div');
            const bolinha = document.createElement('img');
            const descricaoTempo = () => {
                if (!tarefa.data) {
                    return 'Data inválida';
                }
                const dataAtual = new Date();
                const dataHistorio = new Date(tarefa.data);
                const diferencaMs = dataAtual - dataHistorio;
                const msPorMinuto = 60 * 1000;
                const msPorHora = msPorMinuto * 60;
                const msPorDia = msPorHora * 24;
                const msPorSemana = msPorDia * 7;
                const msPorMes = msPorDia * 30;
                const msPorAno = msPorDia * 365;
    
                if (diferencaMs < msPorMinuto) {
                    return `Há cerca de ${Math.floor(diferencaMs / 1000)} segundo(s)`;
                } else if (diferencaMs < msPorHora) {
                    return `Há cerca de ${Math.floor(diferencaMs / msPorMinuto)} minuto(s)`;
                } else if (diferencaMs < msPorDia) {
                    return `Há cerca de ${Math.floor(diferencaMs / msPorHora)} hora(s)`;
                } else if (diferencaMs < msPorSemana) {
                    return `Há cerca de ${Math.floor(diferencaMs / msPorDia)} dia(s)`;
                } else if (diferencaMs < msPorMes) {
                    return `Há cerca de ${Math.floor(diferencaMs / msPorSemana)} semana(s)`;
                } else if (diferencaMs < msPorAno) {
                    return `Há cerca de ${Math.floor(diferencaMs / msPorMes)} mese(s)`;
                } else {
                    return `Há cerca de ${Math.floor(diferencaMs / msPorAno)} ano(s)`;
                };
            };

            tarefaDiv.classList.add('uk-child-width-1-2', 'uk-grid-collapse', 'tabela-linha', 'uk-margin-small-bottom');
            tarefaDiv.setAttribute('uk-grid', '');
            bolinha.style.width = '10px';
            bolinha.style.height = '10px';
            bolinha.style.marginRight = '5px';
            if (tarefa.status === 'Em andamento') {
                bolinha.src = './assets/bolinhaamarela.svg';
            } else if (tarefa.status === 'Finalizado') {
                bolinha.src = './assets/bolinhaverde.svg';
            } else if (tarefa.status === 'Interrompido') {
                bolinha.src = './assets/bolinhavermelha.svg';
            }
            tarefaDiv.innerHTML = `
                <div>
                    <div class="uk-card padding">${tarefa.nome}</div>
                </div>
                <div>
                    <div class="uk-child-width-1-3 uk-text-center uk-grid-collapse" uk-grid>
                        <div class="padding">
                            <div class="uk-card">${tarefa.tempo} minutos</div>
                        </div>
                        <div class="padding">
                            <div class="uk-card">${descricaoTempo()}</div>
                        </div>
                        <div class="padding">
                            <div class="uk-card">
                                ${bolinha.outerHTML} ${tarefa.status}
                            </div>
                        </div>
                    </div>
                </div>
            `;    
            containerLista.appendChild(tarefaDiv);
        });
    }

    function criaHoraDosSegundos(segundos) {
        const minutos = Math.floor(segundos / 60);
        const sec = segundos % 60;
        return {
            minutosFormatado: minutos < 10 ? '0' + minutos : minutos.toString(),
            segundosFormatado: sec < 10 ? '0' + sec : sec.toString()
        };
    };

    function atualizarCronometro() {
        const { minutosFormatado, segundosFormatado } = criaHoraDosSegundos(segundos);
        numeroMinutos1.textContent = minutosFormatado[0];
        numeroMinutos2.textContent = minutosFormatado[1];
        numeroSegundos1.textContent = segundosFormatado[0];
        numeroSegundos2.textContent = segundosFormatado[1];
    };

    function iniciaRelogio() {
        if (campoTempo.value.trim() <= 0) {
            alert('Por favor, insira um tempo maior que 0 minutos.');
            return;
        };
        tarefaAtualId = Date.now();
        timer = setInterval(function () {
            segundos++;
            const { minutosFormatado, segundosFormatado } = criaHoraDosSegundos(segundos);
            numeroMinutos1.textContent = minutosFormatado[0];
            numeroMinutos2.textContent = minutosFormatado[1];
            numeroSegundos1.textContent = segundosFormatado[0];
            numeroSegundos2.textContent = segundosFormatado[1];
            localStorage.setItem('segundos', segundos);
        }, 1000);
        salvarTarefa();
        botaoIniciarFinalizar.innerHTML = `<img src="assets/mao.svg" alt="stop"><span class="uk-margin-small-left">Parar</span>`;
        botaoIniciarFinalizar.style.backgroundColor = 'red';
        botaoIniciarFinalizar.style.color = 'white';        
        cronometroAtivo = true;
    };
    
    function pararCronometro() {
        clearInterval(timer);
        cronometroAtivo = false;    
        let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        let tarefa = tarefas.find(tarefa => tarefa.id === tarefaAtualId);
        if (tarefa) {
            const tempoConfigurado = parseInt(tarefa.tempo) * 60;
            let statusTarefa = 'Finalizado';
            if (segundos < tempoConfigurado) {
                statusTarefa = 'Interrompido';
            }
            tarefa.status = statusTarefa;
            localStorage.setItem('tarefas', JSON.stringify(tarefas));
            exibirTarefas();
        } else {
            return
        }        
        localStorage.removeItem('segundos');
        segundos = 0;
        atualizarCronometro();
        botaoIniciarFinalizar.innerHTML = `<img src="assets/play.svg" alt="play"><span class="uk-margin-small-left">Começar</span>`;
        botaoIniciarFinalizar.style.backgroundColor = '';
        botaoIniciarFinalizar.style.color = '';
    };
    

    botaoIniciarFinalizar.addEventListener('click', function() {
        if (cronometroAtivo) {
            campoNome.value = '';
            campoTempo.value = '';
            campoNome.disabled = false;            
            campoTempo.disabled = false;
            pararCronometro();
        } else {
            if (!campoNome.value || !campoTempo.value) {
                alert('Por favor, preencha os campos de nome e tempo antes de iniciar o cronômetro.');
                return;
            }
            iniciaRelogio();
            campoNome.disabled = true;
            campoTempo.disabled = true;
        }
    });

    if (localStorage.getItem('segundos')) {
        segundos = parseInt(localStorage.getItem('segundos'));
        atualizarCronometro();
        iniciaRelogio();
    } else {
        segundos = 0;
        atualizarCronometro();
    } 
    if(cronometroAtivo) {
        campoNome.disabled = true;
        campoTempo.disabled = true;    
    }    

    document.addEventListener("keydown", function(event) {
        if (event.key === "F5") {
            event.preventDefault();
        }
    });

    document.addEventListener("keydown", function(event) {
        if (event.ctrlKey && event.key === "r") {
            event.preventDefault();
        }
    });

    window.addEventListener("beforeunload", function(event) {
        event.preventDefault();
        event.returnValue = "";
    });

    atualizarCronometro();
    exibirTarefas();
});
