var vue = new Vue({
    el: '#app',
    data: {
        linha: '',
        horario: ''
    },
    methods: {
        buscaLinha() {
            fetch(theUrl + '/Linha/Buscar?termosBusca=' + this.linha).then(
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
                                card.setAttribute("onclick", `vue.buscaParadas(${cardContent.cl})`)
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
        buscaParadas(codLinha) {
            fetch(theUrl + 'Parada/BuscarParadasPorLinha?codigoLinha=' + codLinha).then(
                function(response) {
                    response.json().then(
                        function(data) {
                            if (data.length == 0) {
                                alert("Não houveram resultados para a busca")
                            } else {
                                vue.$data.horario = data.hr
                                var mapOptions = {
                                    zoom: 11.3,
                                    center: { lat: data[0].py, lng: data[0].px }
                                }
                                var map = new google.maps.Map(document.getElementById("map"), mapOptions)

                                data.forEach(function(parada) {
                                    var marker = new google.maps.Marker({
                                        position: { lat: parada.py, lng: parada.px }
                                    })
                                    var infowindow = new google.maps.InfoWindow({
                                        content: `<p>${parada.np}</p>
                                                  <p>${parada.ed}</p>`
                                    })
                                    marker.addListener("click", function() {
                                        infowindow.open(map, marker)
                                    })
                                    marker.setMap(map)
                                })

                            }
                        }
                    )
                }
            )
        }
    }
})