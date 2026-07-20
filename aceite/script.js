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

    const parametros =
        new URLSearchParams(window.location.search);

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

    document.getElementById("cliente").textContent =
        dados.cliente;

    document.getElementById("licenca").textContent =
        dados.licenca;

    document.getElementById("plano").textContent =
        dados.plano;

    document.getElementById("pacote").textContent =
        dados.pacote;

}

consultarPortal();

// ===============================
// BOTÃO
// ===============================

btn.addEventListener("click", () => {

    alert("Pronto! Na próxima etapa este botão enviará o aceite ao servidor.");

});