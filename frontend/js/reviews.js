//controla a exibição de reviews na página de reviews, incluindo a exibição de todas as reviews e a filtragem de reviews
function carregarTodasReviews() {
    mostrarAvisoApi(document.getElementById('lista-todas-reviews'));
}

function filtrarReviews() {
    carregarTodasReviews();
}

document.addEventListener('DOMContentLoaded', carregarTodasReviews);
window.filtrarReviews = filtrarReviews;
