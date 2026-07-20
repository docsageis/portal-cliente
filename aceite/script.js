// ===============================
// ABAS
// ===============================

const tabs = document.querySelectorAll(".tab");
const conteudos = document.querySelectorAll(".conteudo");

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        tabs.forEach(t => t.classList.remove("active"));
        conteudos.forEach(c => c.classList.remove("ativo"));

        tab.classList.add("active");

        document
            .getElementById(tab.dataset.tab)
            .classList.add("ativo");

    });

});

// ===============================
// CHECKBOXES
// ===============================

const ckTermos = document.getElementById("ckTermos");
const ckContrato = document.getElementById("ckContrato");
const ckLgpd = document.getElementById("ckLgpd");
const ckFinal = document.getElementById("ckFinal");

const btn = document.getElementById("btnAceitar");

function verificarAceite() {

    const ok =
        ckTermos.checked &&
        ckContrato.checked &&
        ckLgpd.checked &&
        ckFinal.checked;

    btn.disabled = !ok;

}

ckTermos.addEventListener("change", verificarAceite);
ckContrato.addEventListener("change", verificarAceite);
ckLgpd.addEventListener("change", verificarAceite);
ckFinal.addEventListener("change", verificarAceite);

// ===============================
// PORTAL
// ===============================

const URL_API =
    "https://worker-portal.docsageis.workers.dev";

function obterAssinaturaURL() {

    console.log(window.location.href);
    console.log(window.location.search);

    const parametros =
        new URLSearchParams(window.location.search);

    console.log(parametros.get("assinatura"));

    return parametros.get("assinatura") || "";

}

async function consultarPortal() {

    const assinatura =
        obterAssinaturaURL();

    if (assinatura === "") {

        alert("Assinatura não informada.");

        return;

    }

    try {

        const resposta =
            await fetch(URL_API, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    portal: "CONSULTAR",

                    assinatura: assinatura

                })

            });

        const dados =
            await resposta.json();
console.log(dados);
        preencherTela(dados);

    }

    catch (erro) {

        console.error(erro);

        alert("Erro ao consultar o Portal.");

    }

}

function preencherTela(dados) {
 
    if (!dados.ok) {

        alert(dados.mensagem);
        return;

    }

    // Dados do cliente

    document.getElementById("cliente").textContent =
        dados.cliente;

    document.getElementById("licenca").textContent =
        dados.licenca;

    document.getElementById("plano").textContent =
        dados.plano;

    document.getElementById("pacote").textContent =
        dados.pacote;

    // Carrega os documentos conforme a versão

    const versao = dados.versaoDocs || "1.0";
    const pasta = `documentos/${versao}/`;

    document.getElementById("pdfTermos").src =
        pasta + "Termos de Uso RMC.pdf";

    document.getElementById("downloadTermos").href =
        pasta + "Termos de Uso RMC.pdf";

    document.getElementById("pdfContrato").src =
        pasta + "Contrato RMC.pdf";

    document.getElementById("downloadContrato").href =
        pasta + "Contrato RMC.pdf";

    document.getElementById("pdfLgpd").src =
        pasta + "Politica de Privacidade RMC - LGPD.pdf";

    document.getElementById("downloadLgpd").href =
        pasta + "Politica de Privacidade RMC - LGPD.pdf";

    // Status

    const status = document.getElementById("status");

    document.getElementById("campoDataAceite").style.display = "none";

    document.getElementById("mensagemAceite").style.display = "none";
    
    ckTermos.checked = false;

    ckContrato.checked = false;

    ckLgpd.checked = false;

    ckFinal.checked = false;

    btn.disabled = true;
    
    if (dados.podeAceitar) {

        status.innerHTML =
            '<span class="status pendente">PENDENTE DE ACEITE</span>';

    } else {

        status.innerHTML =
            '<span class="status aceito">ACEITO</span>';

    }

    // Estado padrão da tela
    document.getElementById("ckTermos").parentElement.style.display = "";

    document.getElementById("ckContrato").parentElement.style.display = "";

    document.getElementById("ckLgpd").parentElement.style.display = "";

    document.getElementById("ckFinal").parentElement.style.display = "";

    document.getElementById("btnAceitar").style.display = "block";

    // Se o aceite já foi realizado

    if (!dados.podeAceitar) {

        document.getElementById("ckTermos").parentElement.style.display = "none";

        document.getElementById("ckContrato").parentElement.style.display = "none";

        document.getElementById("ckLgpd").parentElement.style.display = "none";

        document.getElementById("ckFinal").parentElement.style.display = "none";

        document.getElementById("btnAceitar").style.display = "none";

        document.getElementById("campoDataAceite").style.display = "block";

        document.getElementById("mensagemAceite").style.display = "block";

        if (dados.dataAceite) {

            document.getElementById("dataAceite").textContent =
                new Date(dados.dataAceite).toLocaleString("pt-BR");

        } else {

            document.getElementById("dataAceite").textContent = "-";

        }

    }

}

consultarPortal();

// ===============================
// BOTÃO
// ===============================

btn.addEventListener("click", async () => {

    try {

        btn.disabled = true;

        const resposta = await fetch(URL_API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                aceite: true,

                assinatura: obterAssinaturaURL()

            })

        });

        const dados = await resposta.json();

        if (dados.ok) {

            await consultarPortal();

            alert("Aceite registrado com sucesso!");

        } else {

            alert(dados.mensagem);

            btn.disabled = false;

        }

    } catch (erro) {

        console.error(erro);

        alert("Erro ao registrar o aceite.");

        btn.disabled = false;

    }

});