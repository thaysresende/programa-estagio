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
                                card.setAttribute("onclick", "vue.buscaLinha(" + cardContent.cl + ")")
                                var info = document.createElement("p")
                                if (cardContent.sl == 1)
                                    var infoText = document.createTextNode("Linha: " + cardContent.tp + " → " + cardContent.ts)
                                else
                                    var infoText = document.createTextNode("Linha: " + cardContent.ts + " → " + cardContent.tp)
                                info.appendChild(infoText)
                                card.appendChild(info)
                                var info = document.createElement("p")
                                var infoText = document.createTextNode(cardContent.lt + "-" + cardContent.tl)
                                info.appendChild(infoText)
                                card.appendChild(info)
                                document.getElementById("card").appendChild(card)
                            })
                        }
                    )
                }
            )
        },
        buscaLinha(cod) {
            fetch(theUrl + 'Posicao/Linha?codigoLinha=' + cod).then(
                function(response) {
                    response.json().then(
                        function(data) {
                            vue.$data.horario = data.hr
                            if (data.lenght == 0) {
                                alert("Erro ao realizar a busca dos dados.")
                            } else {
                                if (data.vs.length == 0) {
                                    alert("Veículo não está em circulação!")
                                } else {
                                    var mapOptions = {
                                        zoom: 11.3,
                                        center: { lat: data.vs[0].py, lng: data.vs[0].px }
                                    }
                                    var map = new google.maps.Map(document.getElementById("map"), mapOptions)
                                    data.vs.forEach(function(element) {
                                        var marker = new google.maps.Marker({
                                            position: { lat: element.py, lng: element.px },
                                            icon: "/img/bus.png"
                                        })
                                        marker.setMap(map)
                                    })
                                }
                            }
                        }
                    )
                }
            )
        }
    }
})