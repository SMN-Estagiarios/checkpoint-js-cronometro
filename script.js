document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.querySelector("button");
    const cards = document.querySelectorAll(".card");
    const iconButton = document.getElementById('icon-botao');
    const textButton = document.getElementById('texto-botao');
    const iconTemp = document.getElementById('icon-temporizador');
    const projectName = document.getElementById('nome-projeto');
    const projectTimer = document.getElementById('tempo-projeto');
    const historyContainer = document.getElementById('cronometro'); // Contêiner para exibir o histórico
    const history = document.getElementById('historico')

    let timerInterval = null;
    let isRunning = false;
    let totalSeconds = 0;

    const iniciarCronometro = () => {
        if (isNaN(projectTimer.value) || !projectName.value.trim()) {
            alert("Parâmetros inválidos");
            return;
        }

        startButton.style.backgroundColor = "var(--cor-vermelha)";
        iconButton.src = "./assets/interromper-cronometro.svg";
        textButton.innerText = "Interromper";
        iconTemp.src = "./assets/cronometro-ativado.svg";

        if (!isRunning) {
            isRunning = true;
            timerInterval = setInterval(() => {
                totalSeconds++;
                updateTimerDisplay(totalSeconds);
            }, 1000);
        }
    };

    const interromperCronometro = () => {
        salvarDadosCronometro();

        startButton.style.backgroundColor = "var(--cor-verde)";
        iconButton.src = "./assets/iniciar-cronometro.svg";
        textButton.innerText = "Começar";
        iconTemp.src = "./assets/cronometro-desativado.svg";

        cards[0].textContent = "0";
        cards[1].textContent = "0";
        cards[2].textContent = "0";
        cards[3].textContent = "0";

        isRunning = false;
        clearInterval(timerInterval);
    };

    const toggleCronometro = () => {
        if (isRunning) {
            interromperCronometro();
        } else {
            iniciarCronometro();
        }
    };

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
            timestamp: new Date().toLocaleString()
        };

        const storedData = JSON.parse(localStorage.getItem("cronometroData")) || [];
        storedData.push(cronometroData);
        localStorage.setItem("cronometroData", JSON.stringify(storedData));
    };

    const renderizarHistorico = () => {
        const storedData = JSON.parse(localStorage.getItem("cronometroData")) || [];
        historyContainer.innerHTML = "";

        storedData.forEach((data) => {
            const historyItem = document.createElement("div");
            historyItem.classList.add("historico-item");
            historyItem.innerHTML = `
                <p><strong>Projeto:</strong> ${data.projectName}</p>
                <p><strong>Duração:</strong> ${data.duration}</p>
                <p><strong>Finalizado em:</strong> ${data.timestamp}</p>
            `;
            historyContainer.appendChild(historyItem);
        });
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    };

    startButton.addEventListener('click', toggleCronometro);
    history.addEventListener('click', renderizarHistorico)
});
