var vue = new Vue({
    el: '#app',
    data: {
        busca: '',
        horario: ''
    },
    methods: {
        localiza() {
            fetch(theUrl + '/Linha/Buscar?termosBusca=' + this.busca).then(
                function(response) {
                    response.json().then(
                        function(data) {
                            var divcards = document.getElementById("card")
                            divcards.parentNode.removeChild(divcards)
                            divcards = document.createElement("div")
                            divcards.setAttribute("id", "card")
                            divcards.setAttribute("class", "row row-cols-3")
                            document.getElementById("hcontainer").appendChild(divcards)

                            data.forEach(function(cardContent) {
                                var card = document.createElement("div")
                                card.setAttribute("class", "col card")
                                card.setAttribute("onclick", `vue.buscaLinha(${cardContent.cl})`)
                                var info = document.createElement("p")
                                if (cardContent.sl == 1)
                                    var infoText = document.createTextNode(`Linha: ${cardContent.tp} → ${cardContent.ts}`)
                                else
                                    var infoText = document.createTextNode(`Linha: ${cardContent.ts} → ${cardContent.tp}`)
                                info.appendChild(infoText)
                                card.appendChild(info)
                                var info = document.createElement("p")
                                var infoText = document.createTextNode(`${cardContent.lt} - ${cardContent.tl}`)
                                info.appendChild(infoText)
                                card.appendChild(info)
                                document.getElementById("card").appendChild(card)
                            })
                        }
                    )
                }
            )
        },
        buscaLinha(linhaCod) {
            fetch(theUrl + 'Parada/BuscarParadasPorLinha?codigoLinha=' + linhaCod).then(
                function(response) {
                    response.json().then(
                        function(data) {
                            if (data.length == 0) {
                                alert("Não houveram resultados para a busca")
                            } else {
                                vue.$data.horario = data.hr
                                var mapOptions = {
                                    zoom: 15,
                                    center: { lat: data[0].py, lng: data[0].px }
                                }
                                var map = new google.maps.Map(document.getElementById("map"), mapOptions)

                                data.sort(function(a, b) {
                                    if (a.py > b.py) {
                                        return 1
                                    }
                                    if (a.py < b.py) {
                                        return -1
                                    }
                                    return 0
                                })

                                var rotaLinha = []

                                data.forEach(function(cardContent) {
                                    var marker = new google.maps.Marker({
                                        position: { lat: cardContent.py, lng: cardContent.px }
                                    })
                                    var infowindow = new google.maps.InfoWindow({
                                        content: cardContent.np
                                    })
                                    marker.addListener("click", function() {
                                        infowindow.open(map, marker)
                                    })
                                    marker.setMap(map)
                                    rotaLinha.push({ lat: cardContent.py, lng: cardContent.px })
                                })

                                var rota = new google.maps.Polyline({
                                    path: rotaLinha,
                                    strokeColor: "#FF0000",
                                    strokeOpacity: 1.0,
                                    strokeWeight: 2
                                })

                                rota.setMap(map)
                            }
                        }
                    )
                }
            )
        }
    }
})