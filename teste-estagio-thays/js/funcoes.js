var theUrl = 'https://aiko-estagio-proxy.azurewebsites.net/'

fetch(theUrl + 'Login/Autenticar?token={b6ef9bca8a69bc82f0a0b3c063216fb9871d8bdc7c704cca89612e17e423e2d8}', { 'method': 'POST' }).then(
    function(response) {
        response.json().then(
            function(data) {
                console.log(data)
            }
        )
    }
).catch(function(err) {
    alert("Não foi possível realizar a busca. Tente novamente em alguns instantes.")
})

function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11.3,
        center: { lat: -23.566466, lng: -46.603814 }
    })
}

function goBack() {
    window.history.back()
}