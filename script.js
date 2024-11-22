document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.querySelector("button");
    const cards = document.querySelectorAll(".card");
    const iconButton = document.getElementById('icon-botao');
    const textButton = document.getElementById('texto-botao');
    const iconTemp = document.getElementById('icon-temporizador');
    const projectName = document.getElementById('nome-projeto');
    const projectTimer = document.getElementById('tempo-projeto');
    const mainContent = document.getElementById('conteudo-principal');
    const history = document.getElementById('historico');
    const ancorIconTemporizador = document.getElementById('item-navegacao-temporizador');
    const ancorIconLogo = document.getElementById('ancor-logo');
    const temporizador = document.getElementById('cronometro');
    const tabelaGrid = document.getElementById('tabela-grid')

    let timerInterval = 0;
    let isRunning = false;
    let totalSeconds = 0;

    const iniciarOuPausarCronometro = () => {
        const timeInputInSeconds = projectTimer.value * 60;

        startButton.style.backgroundColor = "var(--cor-vermelha)";
        iconButton.src = "./assets/interromper-cronometro.svg";
        textButton.innerText = "interromper";
        iconTemp.src = "./assets/cronometro-ativado.svg";

        if (timerInterval === 0) {
            isRunning = true;

            timerInterval = setInterval(() => {
                totalSeconds++;
                updateTimerDisplay(totalSeconds);

                if (totalSeconds >= timeInputInSeconds) {
                    alert(`O tempo de ${projectTimer.value} minuto(s) foi atingido!`);
                    interromperCronometro();
                }
                salvarEstadoCronometro();
            }, 1000);
        } else {
            pausarCronometro();
            interromperCronometro();
        }
    };

    const salvarEstadoCronometro = () => {
        const timeInputInSeconds = projectTimer.value * 60;
        const cronometroState = {
            projectName: projectName.value,
            totalSeconds: totalSeconds,
            projectTimerInSeconds: timeInputInSeconds,
            projectTimerInminutes: projectTimer.value,
            isRunning: isRunning
        };
        localStorage.setItem("cronometroState", JSON.stringify(cronometroState));
    };

    const recuperarEstadoCronometro = () => {
        
         startButton.style.backgroundColor = "var(--cor-vermelha)";
        iconButton.src = "./assets/interromper-cronometro.svg";
        textButton.innerText = "interromper";
        iconTemp.src = "./assets/cronometro-ativado.svg"; 
       
        const savedState = JSON.parse(localStorage.getItem("cronometroState"));
        if (savedState) {
            projectName.value = savedState.projectName || '';
            totalSeconds = savedState.totalSeconds || 0;
            isRunning = savedState.isRunning || false;
            projectTimer.value = savedState.projectTimerInminutes;
            const timeInputInSeconds = savedState.projectTimerInSeconds

            updateTimerDisplay(totalSeconds);

            if (isRunning) {
                timerInterval = setInterval(() => {
                    totalSeconds++;
                    updateTimerDisplay(totalSeconds);
        
                    if (totalSeconds >= timeInputInSeconds) {
                        alert(`O tempo de ${projectTimer.value} minuto(s) foi atingido!`);
                        interromperCronometro();
                    }
                }, 1000);
            }
        }
    };

    const interromperCronometro = () => {
       
        salvarDadosCronometro();

        startButton.style.backgroundColor = "var(--cor-verde)";
        iconButton.src = "./assets/iniciar-cronometro.svg";
        textButton.innerText = "Começar";
        iconTemp.src = "./assets/cronometro-desativado.svg";
        projectName.value = ""
        projectTimer.value = '0'

        cards[0].textContent = "0";
        cards[1].textContent = "0";
        cards[2].textContent = "0";
        cards[3].textContent = "0";

        isRunning = false;
        clearInterval(timerInterval);
    };

    const pausarCronometro = () => {
        
        clearInterval(timerInterval)
        timerInterval = 0
        startButton.style.backgroundColor = "var(--cor-verde)";
        iconButton.src = "./assets/iniciar-cronometro.svg";
        textButton.innerText = "Começar";
        iconTemp.src = "./assets/cronometro-desativado.svg";
        isRunning = false;
        }
    
    const updateTimerDisplay = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const minutesArray = String(minutes).padStart(2, "0").split("");
        const secondsArray = String(seconds).padStart(2, "0").split("");

        cards[0].textContent = minutesArray[0];
        cards[1].textContent = minutesArray[1];
        cards[2].textContent = secondsArray[0];
        cards[3].textContent = secondsArray[1];
    };

    const salvarDadosCronometro = () => {
        const cronometroData = {
            projectName: projectName.value,
            duration: formatTime(totalSeconds),
            startTime: new Date().toLocaleString()
        };

        const storedData = JSON.parse(localStorage.getItem("cronometroData")) || [];
        storedData.push(cronometroData);
        localStorage.setItem("cronometroData", JSON.stringify(storedData));
    };

    const renderizarHistorico = () => {
        salvarEstadoCronometro();
        history.src = "./assets/historico-ativado.svg";
        iconTemp.src = "./assets/cronometro-desativado.svg";
        temporizador.classList.add('esconder')
        tabelaGrid.classList.remove('esconder')

        const storedData = JSON.parse(localStorage.getItem("cronometroData")) || [];

        storedData.forEach((data) => {
            const historicoContainer = document.getElementById("body-resultado");
            historicoContainer.innerHTML += `
                <div>
                    <div class="uk-child-width-1-3 uk-text-center uk-flex" uk-grid>
                        <div>
                            <div class="uk-card padding">${data.projectName}</div>
                        </div>    
                        <div class="padding">
                            <div class="uk-card">${data.duration} minutos</div>
                        </div>
                        <div class="padding">
                            <div class="uk-card">${data.startTime}</div>
                        </div>
                        <div class="padding">
                            <div class="uk-card">status</div>
                        </div>
                    </div>
                </div>
            `;
        });
    };

    const mudarParaTemporizador = () =>{  
        const conteudo = getElementById('conteudo-principal')

            ancorIconTemporizador.onclick = function (e) {
                e.preventDefault()
            fetch(link.href)
                .then(resp => resp.text())
                .then(html => conteudo.innerHTML = html)
                recuperarEstadoCronometro();
        }
    }

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    };

    startButton.addEventListener('click', iniciarOuPausarCronometro);
    history.addEventListener('click', renderizarHistorico);
    ancorIconTemporizador.addEventListener('click', mudarParaTemporizador);
    ancorIconLogo.addEventListener('click', recuperarEstadoCronometro)
 
});
