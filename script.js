// Arquivo script.js - Portal Cliente
// Versão organizada

const URL_API = "https://worker-portal.docsageis.workers.dev";
let assinaturaAtual = "";

document.addEventListener("DOMContentLoaded", iniciarPortal);

async function iniciarPortal() {

    assinaturaAtual = obterAssinatura();

    if (!assinaturaAtual) {
        return mostrarErro("Assinatura não informada.");
    }

    try {

        const dados = await consultarPortal(assinaturaAtual);

        if (!dados.ok) {
            return mostrarErro(
                dados.mensagem || "Assinatura não localizada."
            );
        }

        preencherTela(dados);

        configurarEventos();

        // Se o aceite não puder mais ser realizado,
        // oculta toda a área de aceite.
        if (!dados.podeAceitar) {

            document.getElementById("areaAceite").style.display = "none";

            mostrarSucesso(
                dados.motivoBloqueio ||
                "Esta assinatura já foi realizada anteriormente."
            );

        }

    }
    catch (e) {

        console.error(e);

        mostrarErro(
            "Não foi possível comunicar com o servidor."
        );

    }

}

async function consultarPortal(assinatura) {
    const resposta = await fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            portal: "CONSULTAR",
            assinatura: assinatura
        })
    });

    return await resposta.json();
}

function obterAssinatura() {
    return new URLSearchParams(window.location.search).get("assinatura");
}

function preencherTela(d) {
    ocultarLoading();
    document.getElementById("conteudo").classList.remove("hidden");
    document.getElementById("cliente").textContent = d.cliente || "";
    document.getElementById("cpfCnpj").textContent = d.cpfCnpj || "";
    document.getElementById("plano").textContent = d.plano || "";
    document.getElementById("pacote").textContent = d.pacote || "";
    document.getElementById("versao").textContent = d.versaoDocs || "";
    document.getElementById("statusAceite").textContent = d.aceite || "PENDENTE";
}

function configurarEventos() {
    const chk = document.getElementById("chkAceite");
    const btnAceitar = document.getElementById("btnAceitar");
    const btnDocumentos = document.getElementById("btnDocumentos");

    if (chk && btnAceitar) {
        chk.addEventListener("change", () => {
            btnAceitar.disabled = !chk.checked;
        });
    }

    if (btnDocumentos) btnDocumentos.onclick = abrirDocumentos;
    if (btnAceitar) btnAceitar.onclick = realizarAceite;
}

function abrirDocumentos() {
    const versao = document.getElementById("versao").textContent.trim();
    if (!versao) return alert("Versão dos documentos não encontrada.");
    window.open("https://docsageis.com.br/documentos/" + versao + "/", "_blank");
}

async function realizarAceite() {
    const chk = document.getElementById("chkAceite");
    const btn = document.getElementById("btnAceitar");

    if (!chk.checked) return alert("Confirme a leitura dos documentos.");

    btn.disabled = true;
    btn.textContent = "ENVIANDO...";

    try {
        const resposta = await fetch(URL_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                aceite: "CONFIRMAR",
                assinatura: assinaturaAtual
            })
        });

        const json = await resposta.json();

        if (!json.ok) throw new Error(json.mensagem || "Erro ao registrar aceite.");

        document.getElementById("statusAceite").textContent = "ACEITO";
        document.getElementById("statusAceite").style.color = "#16A34A";
        mostrarSucesso("Aceite realizado com sucesso.");

    } catch (e) {
        alert(e.message);
        btn.disabled = false;
        btn.textContent = "REALIZAR ACEITE";
    }
}

function mostrarSucesso(msg){

    document.getElementById("areaAceite").innerHTML = `
        <div class="sucesso">

            <h2>${msg}</h2>

            <p>
                Sua assinatura eletrônica foi registrada com sucesso.
            </p>

            <p>
                Não é necessária nenhuma outra ação.
            </p>

        </div>
    `;

}

function mostrarErro(msg) {
    ocultarLoading();
    document.getElementById("erro").classList.remove("hidden");
    document.getElementById("mensagemErro").textContent = msg;
}

function ocultarLoading() {
    document.getElementById("loading").classList.add("hidden");
}
