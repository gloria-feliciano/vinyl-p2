//controla elemntos da página principal, como modais, playlists e feed global
function carregarDestaquesPublicos() {
    mostrarAvisoApi(document.getElementById('vitrine-publica'));
}

function carregarFeedGlobal() {
    mostrarAvisoApi(document.getElementById('feed-reviews-global'));
}

function scrollVitrine(id, distancia) {
    const vitrine = document.getElementById(id);
    if (vitrine) vitrine.scrollBy({ left: distancia, behavior: 'smooth' });
}

function exibirLogin() {
    alert('A autenticação estará disponível quando a API for implementada.');
}

document.addEventListener('DOMContentLoaded', () => {
    carregarDestaquesPublicos();
    carregarFeedGlobal();
});

window.scrollVitrine = scrollVitrine;
window.carregarDestaquesPublicos = carregarDestaquesPublicos;
window.carregarFeedGlobal = carregarFeedGlobal;
window.exibirLogin = exibirLogin;
