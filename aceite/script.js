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

    console.log("01 - Entrou em preencherTela");

    if (!dados.ok) {

        console.log("02 - dados.ok = false");

        alert(dados.mensagem);
        return;

    }

    console.log("03");

    // Dados do cliente

    document.getElementById("cliente").textContent = dados.cliente;
    console.log("04");

    document.getElementById("licenca").textContent = dados.licenca;
    console.log("05");

    document.getElementById("plano").textContent = dados.plano;
    console.log("06");

    document.getElementById("pacote").textContent = dados.pacote;
    console.log("07");

    // Carrega os documentos conforme a versão

    const versao = dados.versaoDocs || "1.0";
    const pasta = `documentos/${versao}/`;

    console.log("08");

    document.getElementById("pdfTermos").src =
        pasta + "Termos de Uso RMC.pdf";

    console.log("09");

    document.getElementById("downloadTermos").href =
        pasta + "Termos de Uso RMC.pdf";

    console.log("10");

    document.getElementById("pdfContrato").src =
        pasta + "Contrato RMC.pdf";

    console.log("11");

    document.getElementById("downloadContrato").href =
        pasta + "Contrato RMC.pdf";

    console.log("12");

    document.getElementById("pdfLgpd").src =
        pasta + "Politica de Privacidade RMC - LGPD.pdf";

    console.log("13");

    document.getElementById("downloadLgpd").href =
        pasta + "Politica de Privacidade RMC - LGPD.pdf";

    console.log("14");

    // Status

    const status = document.getElementById("status");

    console.log("15");

    document.getElementById("campoDataAceite").style.display = "none";

    console.log("16");

    document.getElementById("mensagemAceite").style.display = "none";

    console.log("17");

    ckTermos.checked = false;

    console.log("18");

    ckContrato.checked = false;

    console.log("19");

    ckLgpd.checked = false;

    console.log("20");

    ckFinal.checked = false;

    console.log("21");

    btn.disabled = true;

    console.log("22");

    if (dados.podeAceitar) {

        status.innerHTML =
            '<span class="status pendente">PENDENTE DE ACEITE</span>';

    } else {

        status.innerHTML =
            '<span class="status aceito">ACEITO</span>';

    }

    console.log("23");

    document.getElementById("ckTermos").parentElement.style.display = "";
    console.log("24");

    document.getElementById("ckContrato").parentElement.style.display = "";
    console.log("25");

    document.getElementById("ckLgpd").parentElement.style.display = "";
    console.log("26");

    document.getElementById("ckFinal").parentElement.style.display = "";
    console.log("27");

    document.getElementById("btnAceitar").style.display = "block";
    console.log("28");

    if (!dados.podeAceitar) {

        document.getElementById("ckTermos").parentElement.style.display = "none";
        console.log("29");

        document.getElementById("ckContrato").parentElement.style.display = "none";
        console.log("30");

        document.getElementById("ckLgpd").parentElement.style.display = "none";
        console.log("31");

        document.getElementById("ckFinal").parentElement.style.display = "none";
        console.log("32");

        document.getElementById("btnAceitar").style.display = "none";
        console.log("33");

        document.getElementById("campoDataAceite").style.display = "block";
        console.log("34");

        document.getElementById("mensagemAceite").style.display = "block";
        console.log("35");

        if (dados.dataAceite) {

            document.getElementById("dataAceite").textContent =
                new Date(dados.dataAceite).toLocaleString("pt-BR");

        } else {

            document.getElementById("dataAceite").textContent = "-";

        }

        console.log("36");

    }

    console.log("37 - Fim da função");
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