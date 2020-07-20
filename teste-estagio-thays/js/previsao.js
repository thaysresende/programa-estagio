var vue = new Vue({
    el: '#app',
    data: {
        input: '',
        linha: '',
        parada: '',
        horario: '',
        paradas: '',
        linhas: ''
    },
    methods: {
        buscaL() {
            this.linha = this.input
            this.buscaLinhaCod()
        },
        buscaP() {
            this.parada = this.input
            this.buscaParadaCod()
        },
        buscaLinhaCod() {
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
        buscaParadaCod() {
            fetch(theUrl + 'Parada/Buscar?termosBusca=' + this.parada).then(
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
                                card.setAttribute("onclick", `vue.buscaParada(${cardContent.cp})`)
                                var info = document.createElement("p")
                                var infoText = document.createTextNode(`${cardContent.np} - ${cardContent.ed}`)
                                info.appendChild(infoText)
                                card.appendChild(info)
                                document.getElementById("card").appendChild(card)
                            })
                        }
                    )
                }
            )
        },
        paradaMarker(i) {
            if (this.paradas.lenght == 0) {
                alert("Linha indisponível")
            } else {
                var mapOptions = {
                    zoom: 12,
                    center: { lat: this.paradas[i].py, lng: this.paradas[i].px }
                }
                var map = new google.maps.Map(document.getElementById("map"), mapOptions)

                var marker = new google.maps.Marker({
                    position: { lat: this.paradas[i].py, lng: this.paradas[i].px }
                })
                var infowindow = new google.maps.InfoWindow({
                    content: "Ponto de ônibus"
                })
                marker.addListener("click", function() {
                    infowindow.open(map, marker)
                })
                marker.setMap(map)

                this.paradas[i].vs.forEach(function(veiculo) {
                    var marker = new google.maps.Marker({
                        position: { lat: veiculo.py, lng: veiculo.px },
                        icon: "/img/bus.png"
                    })
                    var infowindow = new google.maps.InfoWindow({
                        content: veiculo.t
                    })
                    marker.addListener("click", function() {
                        infowindow.open(map, marker)
                    })
                    marker.setMap(map)
                })

            }


        },
        buscaLinha(cod) {
            fetch(theUrl + '/Previsao/Linha?codigoLinha=' + cod).then(
                function(response) {
                    response.json().then(
                        function(data) {
                            vue.$data.horario = data.hr

                            if (data.ps.length == 0) {
                                alert("Linha indisponível")
                            } else {
                                var divcards = document.getElementById("card")
                                divcards.parentNode.removeChild(divcards)
                                divcards = document.createElement("div")
                                divcards.setAttribute("id", "card")
                                divcards.setAttribute("class", "row row-cols-3")
                                document.getElementById("hcontainer").appendChild(divcards)

                                var i = 0
                                vue.$data.paradas = data.ps
                                data.ps.forEach(function(cardContent) {
                                    var card = document.createElement("div")
                                    card.setAttribute("class", "col card")
                                    card.setAttribute("onclick", `vue.paradaMarker(${i})`)
                                    var info = document.createElement("p")
                                    if (cardContent.np == "") {
                                        var infoText = document.createTextNode("Parada sem nome")
                                    } else {
                                        var infoText = document.createTextNode(cardContent.np)
                                    }
                                    info.appendChild(infoText)
                                    card.appendChild(info)
                                    info = document.createElement("p")
                                    infoText = document.createTextNode(`Quantidade de veículos: ${cardContent.vs.length}`)
                                    info.appendChild(infoText)
                                    card.appendChild(info)
                                    document.getElementById("card").appendChild(card)
                                    i++
                                })

                            }
                        }
                    )
                }
            )
        },
        buscaParada(cod) {
            fetch(theUrl + 'Previsao/Parada?codigoParada=' + cod).then(
                function(response) {
                    response.json().then(
                        function(data) {
                            vue.$data.horario = data.hr

                            var mapOptions = {
                                zoom: 12,
                                center: { lat: data.p.py, lng: data.p.px }
                            }
                            var map = new google.maps.Map(document.getElementById("map"), mapOptions)

                            var marker = new google.maps.Marker({
                                position: { lat: data.p.py, lng: data.p.px }
                            })
                            var infowindow = new google.maps.InfoWindow({
                                content: "Ponto de ônibus"
                            })
                            marker.addListener("click", function() {
                                infowindow.open(map, marker)
                            })
                            marker.setMap(map)

                            var divcards = document.getElementById("card")
                            divcards.parentNode.removeChild(divcards)
                            divcards = document.createElement("div")
                            divcards.setAttribute("id", "card")
                            divcards.setAttribute("class", "row row-cols-3")
                            document.getElementById("hcontainer").appendChild(divcards)

                            vue.$data.linhas = data.p.l
                            var i = 0
                            data.p.l.forEach(function(cardContent) {
                                var card = document.createElement("div")
                                card.setAttribute("class", "col card")
                                card.setAttribute("onclick", `vue.exibirVeiculos(${i}, ${data.p.py}, ${data.p.px})`)
                                var info = document.createElement("p")
                                var infoText = document.createTextNode(cardContent.c)
                                info.appendChild(infoText)
                                card.appendChild(info)
                                info = document.createElement("p")
                                infoText = document.createTextNode(`${cardContent.lt0} - ${cardContent.lt1}`)
                                info.appendChild(infoText)
                                card.appendChild(info)
                                info = document.createElement("p")
                                infoText = document.createTextNode(`Quantidade de Veículos: ${cardContent.qv}`)
                                info.appendChild(infoText)
                                card.appendChild(info)
                                document.getElementById("card").appendChild(card)
                                i++
                            })
                        }
                    )
                }
            )
        },
        exibirVeiculos(i, lat, lng) {
            var mapOptions = {
                zoom: 12,
                center: { lat: lat, lng: lng }
            }
            var map = new google.maps.Map(document.getElementById("map"), mapOptions)

            var marker = new google.maps.Marker({
                position: { lat: lat, lng: lng }
            })
            var infowindow = new google.maps.InfoWindow({
                content: "Ponto de ônibus"
            })
            marker.addListener("click", function() {
                infowindow.open(map, marker)
            })
            marker.setMap(map)

            this.linhas[i].vs.forEach(function(veiculo) {
                var marker = new google.maps.Marker({
                    position: { lat: veiculo.py, lng: veiculo.px },
                    icon: "/img/bus.png"
                })
                var infowindow = new google.maps.InfoWindow({
                    content: veiculo.t
                })
                marker.addListener("click", function() {
                    infowindow.open(map, marker)
                })
                marker.setMap(map)
            })
        }
    }
})