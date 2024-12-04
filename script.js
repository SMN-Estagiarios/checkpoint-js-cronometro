document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.querySelector("button");
    const cards = document.querySelectorAll(".card");
    const iconButton = document.getElementById("icon-botao");
    const textButton = document.getElementById("texto-botao");
    const iconTemp = document.getElementById("icon-temporizador");
    const projectName = document.getElementById("nome-projeto");
    const projectTimer = document.getElementById("tempo-projeto");
    const history = document.getElementById("historico");
    const ancorIconTemporizador = document.getElementById("item-navegacao-temporizador");
    const ancorIconLogo = document.getElementById("ancor-logo");
    const temporizador = document.getElementById("cronometro");
    const tabelaGrid = document.getElementById("tabela-grid");

    let timerInterval = 0;
    let isRunning = false;
    let totalSeconds = 0;

    const iniciarOuPausarCronometro = () => {
        const timeInputInSeconds = projectTimer.value * 60;

        if (
            projectTimer.value <= 0 ||
            projectName.value === "" ||
            isNaN(projectTimer.value)
        ) {
            alert("parametros incorretos");
            return;
        }
                   
        if (!isRunning) {
            iniciarCronometro();
            isRunning = true;
            salvarDadosCronometro('Em andamento')

            timerInterval = setInterval(() => {
                totalSeconds++;
                console.log(isRunning)
                updateTimerDisplay(totalSeconds);

                if (totalSeconds >= timeInputInSeconds) {
                    alert(
                        `O tempo de ${projectTimer.value} minuto(s) foi atingido!`
                    );
                    atualizarStatusDoCronometro();
                    interromperCronometro();
                }
                salvarEstadoCronometro();
            }, 1000);
        } else {
            pausarCronometro();
            atualizarStatusDoCronometro();
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
            isRunning: isRunning,
        };
        localStorage.setItem( 
            "cronometroState",
            JSON.stringify(cronometroState)
        );
    };

    const recuperarEstadoCronometro = () => {
        const savedState = JSON.parse(localStorage.getItem("cronometroState"));
        if (savedState) {
            projectName.value = savedState.projectName;
            totalSeconds = savedState.totalSeconds;
            isRunning = savedState.isRunning;
            projectTimer.value = savedState.projectTimerInminutes;
            const timeInputInSeconds = savedState.projectTimerInSeconds;

            if (
                projectTimer.value <= 0 ||
                projectName.value === "" ||
                isNaN(projectTimer.value)
            ) {
                alert("parametros incorretos");
                return;
            }

            iniciarCronometro();
            updateTimerDisplay(totalSeconds);

            if (isRunning) {
                isRunning = true;
                timerInterval = setInterval(() => {
                    totalSeconds++;
                    updateTimerDisplay(totalSeconds);
                    if (totalSeconds >= timeInputInSeconds) {
                        alert(
                            `O tempo de ${projectTimer.value} minuto(s) foi atingido!`
                        );
                        atualizarStatusDoCronometro();
                        interromperCronometro();
                    }
                    salvarEstadoCronometro();
                }, 1000);
            }
        }
    };

    const interromperCronometro = () => {
        isRunning = false;
        salvarEstadoCronometro();
        pausarCronometro();

        cards[0].textContent = "0";
        cards[1].textContent = "0";
        cards[2].textContent = "0";
        cards[3].textContent = "0";

        totalSeconds = 0;
        clearInterval(timerInterval);
        timerInterval = 0;
    };

    const pausarCronometro = () => {
        startButton.style.backgroundColor = "var(--cor-verde)";
        iconButton.src = "./assets/iniciar-cronometro.svg";
        textButton.innerText = "Começar";
        iconTemp.src = "./assets/cronometro-desativado.svg";
    };

    const iniciarCronometro = () => {
        startButton.style.backgroundColor = "var(--cor-vermelha)";
        iconButton.src = "./assets/interromper-cronometro.svg";
        textButton.innerText = "interromper";
        iconTemp.src = "./assets/cronometro-ativado.svg";
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

    const salvarDadosCronometro = (status) => {
        const cronometroData = {
            projectName: projectName.value,
            duration: projectTimer.value,
            startTime: new Date().toLocaleString(),
            result: status,
        };

        const storedData =
            JSON.parse(localStorage.getItem("cronometroData")) || [];
        storedData.push(cronometroData);
        localStorage.setItem("cronometroData", JSON.stringify(storedData));
    };

    const atualizarStatusDoCronometro = () => {
        const register = JSON.parse(localStorage.getItem('cronometroData')) || []
        const lastRegister = register.find(e => e.result === "Em andamento")
        if(lastRegister){
            let realTime = lastRegister.duration * 60;
            let result = '';
            if(realTime > totalSeconds){
                result = "Interrompido"
            }
            else{
                result = "Finalizado"
            }
            lastRegister.result = result;
            localStorage.setItem('cronometroData', JSON.stringify(register));
        } 
    }

    const renderizarHistorico = () => {
        const historicoContainer = document.getElementById("body-resultado");
        const storedData =
            JSON.parse(localStorage.getItem("cronometroData")) || [];
        isRunning = true;
        temporizador.classList.add("esconder");
        tabelaGrid.classList.remove("esconder");
        history.src = "./assets/historico-ativado.svg";
        iconTemp.src = "./assets/cronometro-desativado.svg";
        temporizador.classList.add("esconder");
        tabelaGrid.classList.remove("esconder");
        historicoContainer.innerHTML = "";

        storedData.forEach((data) => {
            historicoContainer.innerHTML += `
                <div class=" body-tabela-resultados">
                    <div class="uk-child-width-1-3 uk-text-center uk-flex">
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
                            <div class="uk-card">${data.result}</div>
                        </div>
                    </div>
                </div>
            `;
        });
    };

    const mudarParaTemporizador = () => {
        temporizador.classList.remove("esconder");
        tabelaGrid.classList.add("esconder");
        history.src = "./assets/historico.svg";
        iconTemp.src = "./assets/cronometro-ativado.svg";
    };
    startButton.addEventListener("click", iniciarOuPausarCronometro);
    history.addEventListener("click", renderizarHistorico);
    ancorIconTemporizador.addEventListener("click", mudarParaTemporizador);
    ancorIconLogo.addEventListener("click", recuperarEstadoCronometro);

    updateTimerDisplay(totalSeconds);
});
