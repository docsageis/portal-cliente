//==================================================
// CONFIGURAÇÃO
//==================================================

const URL_API = "https://script.google.com/macros/s/AKfycbzNz1xNKdLNLkySIBy2QYEGSkdk6YOeiYUeKoL_wXjElbtLSGDsduJtG_1v_q3PCKBW/exec";

//==================================================
// INÍCIO
//==================================================

document.addEventListener("DOMContentLoaded", iniciarPortal);

//==================================================
// PORTAL
//==================================================

async function iniciarPortal() {

    const assinatura = obterAssinatura();

    if (!assinatura) {

        mostrarErro(
            "Assinatura não informada."
        );

        return;

    }

    try {

        const resposta = await consultarPortal(assinatura);

        if (!resposta.ok) {

            mostrarErro(
                resposta.mensagem
            );

            return;

        }

        preencherTela(resposta);

    }

    catch (erro) {

        mostrarErro(
            "Não foi possível comunicar com o servidor."
        );

    }

}

//==================================================
// CONSULTA
//==================================================

async function consultarPortal(assinatura) {

    const resposta = await fetch(URL_API, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            portal: "CONSULTAR",

            assinatura: assinatura

        })

    });

    return await resposta.json();

}

//==================================================
// URL
//==================================================

function obterAssinatura() {

    const parametros =
        new URLSearchParams(window.location.search);

    return parametros.get("assinatura");

}

//==================================================
// PREENCHER TELA
//==================================================

function preencherTela(dados) {

    ocultarLoading();

    document
        .getElementById("conteudo")
        .classList.remove("hidden");

    document.getElementById("cliente").textContent =
        dados.cliente;

    document.getElementById("cpfCnpj").textContent =
        dados.cpfCnpj;

    document.getElementById("plano").textContent =
        dados.plano;

    document.getElementById("pacote").textContent =
        dados.pacote;

    document.getElementById("versao").textContent =
        dados.versaoDocs;

    document.getElementById("statusAceite").textContent =
        dados.aceite;

}

//==================================================
// ERRO
//==================================================

function mostrarErro(texto) {

    ocultarLoading();

    document
        .getElementById("erro")
        .classList.remove("hidden");

    document
        .getElementById("mensagemErro")
        .textContent = texto;

}

//==================================================
// LOADING
//==================================================

function ocultarLoading() {

    document
        .getElementById("loading")
        .classList.add("hidden");

}