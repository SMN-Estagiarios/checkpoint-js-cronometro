let tabelaHistorico = document.getElementsByClassName("container-historico-tabela")[0];
let linhaHistorico = document.getElementsByClassName("container-historico-tabela-linha")[0];

let dia = new Date()

function adicionarHistorico() {
    let listaProjetos = JSON.parse(sessionStorage.getItem("Projeto"));
    let novaLinhaHistorico;

    if(!listaProjetos) {
        linhaHistorico.remove();
        return
    }

    for(let projeto of listaProjetos) {
        if(listaProjetos.length == 1) {
            novaLinhaHistorico = linhaHistorico;

            novaLinhaHistorico.children[0].textContent = projeto.nome;
            novaLinhaHistorico.children[1].textContent = projeto.tempo + " minutos";
            novaLinhaHistorico.children[2].textContent = projeto.inicio;
            novaLinhaHistorico.children[3].insertAdjacentHTML("beforeend", projeto.status);
        }
        else{
            novaLinhaHistorico = linhaHistorico.cloneNode(true);
            linhaHistorico.remove();

            novaLinhaHistorico.children[0].textContent = projeto.nome;
            novaLinhaHistorico.children[1].textContent = projeto.tempo + " minutos";
            novaLinhaHistorico.children[2].textContent = projeto.inicio;
            novaLinhaHistorico.children[3].insertAdjacentHTML("beforeend", projeto.status);
        
            tabelaHistorico.appendChild(novaLinhaHistorico);
        }
    }
}

adicionarHistorico();
