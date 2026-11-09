function carregarTodasReviews() {
    mostrarAvisoApi(document.getElementById('lista-todas-reviews'));
}

function filtrarReviews() {
    carregarTodasReviews();
}

document.addEventListener('DOMContentLoaded', carregarTodasReviews);
window.filtrarReviews = filtrarReviews;
