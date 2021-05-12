var cascada;
var tabla;
var diccionario = [];
var palabras = [];
var pistas = 3;
var id = 0;
var localS = false;

$(document).ready(function () {
    if (window.localStorage.length != 0) localS = true;
    if (!localS) localS = confirm("Permites el almacenamianto");
    generatecascada();
    if (window.localStorage.length != 0) loadStorage();
    checkCascada();
    fetchDict();

    $("#restart").click(function (e) {
        localStorage.clear();
        location.reload();
    });

    $("#buscar").click(function (e) {
        if (pistas > 0 && $("#letras").val() != "") {
            pistas--;
            if (localS) window.localStorage.setItem("pistas", pistas);
            $("#pistasNum").text("Pistas: " + pistas);

            let letras = $("#letras").val().split("");
            let res = "";

            diccionario.forEach((element) => {
                if (letras.every((letra) => element.includes(letra))) {
                    res += element + "\n";
                }
            });
            $("#pistas").val(res);
        } else if ($("#letras").val() == "");
        else $("#pistas").val("NO QUEDAN PISTAS");
    });

    $(".letra").on("keyup", function (e) {
        readPalabras();
        if (localS) window.localStorage.setItem("palabras", palabras);
        checkCascada();
        //Moverse hacia delante al escribir
        var index = $(this).index("input");
        $(".letra:eq(" + (index + 1) + ")").focus();

        //Moverse hacia detrás al borrar
        if ((e.which == 8 || e.which == 46) && $(this).val() == "") {
            $(".letra:eq(" + (index - 1) + ")").focus();
        }
    });
});

//Descargar dict
async function fetchDict() {
    try {
        await fetch("https://ordenalfabetix.unileon.es/aw/diccionario.txt")
            .then((response) => response.text())
            .then((response) => {
                saveDict(response);
            });
    } catch (err) {
        alert("Error al cargar el diccionario. Intente de nuevo");
    }
}

//Generar tablero
function generatecascada() {
    // Obtener la referencia del elemento body
    var body = document.getElementsByTagName("body")[0];

    cascada = document.getElementById("cascada");

    // Crea un elemento <table> y un elemento <tbody>
    tabla = document.createElement("table");
    var tblBody = document.createElement("tbody");

    // Crea las celdas
    for (var i = 0; i <= 11; i++) {
        // Crea las hileras de la tabla
        var hilera = document.createElement("tr");
        var len = 4;

        if (i > 5) len = 6;

        for (var j = 0; j <= len; j++) {
            var celda = document.createElement("td");
            var input;

            if (j == 0) {
                switch (i) {
                    case 0:
                        input = document.createTextNode("1️ ➡");
                        break;

                    case 5:
                        input = document.createTextNode("2 ➡");
                        break;

                    case 6:
                        input = document.createTextNode("3 ➡");
                        break;

                    case 11:
                        input = document.createTextNode("4 ➡");
                        break;

                    default:
                        input = document.createTextNode("");
                        break;
                }
            } else {
                input = document.createElement("input");
                input.setAttribute("type", "text");
                input.setAttribute("maxLength", "1");
                input.setAttribute("class", "letra palabra" + i);
                input.setC;
            }

            celda.appendChild(input);
            hilera.appendChild(celda);
        }
        tblBody.appendChild(hilera);
    }
    tabla.appendChild(tblBody);
    cascada.appendChild(tabla);
}

//Guardar dict
function saveDict(text) {
    let dict = [];
    text = text.split("\n");
    text.forEach((element) => {
        if (element.length == 4 || element.length == 6) {
            dict.push(element);
        }
    });
    //Anyado palabras necesarias para sol
    dict.push("naci", "nací", "nace", "tolero");

    diccionario = dict;
}

function readPalabras() {
    palabras = [];
    for (let i = 0; i < 12; i++) {
        let palabra = "";
        $(".palabra" + i).each(function (i) {
            palabra += $(this).val();
            if ($(this).val() === "") palabra += " ";
        });

        palabras.push(palabra);
    }
}

function checkCascada() {
    //primero checkeo las definidas
    checkPalabaraDefinida(0, "clan");
    checkPalabaraDefinida(5, "pena");
    checkPalabaraDefinida(6, "remato");
    checkPalabaraDefinida(11, "torero");

    let posPalabras = [1, 2, 3, 4, 7, 8, 9, 10];

    posPalabras.forEach((p) => {
        if (p % 2 == 0) checkPar(p);
        else checkImpar(p);
    });

    function checkPalabaraDefinida(num, sol) {
        let palabra = "";
        $(".palabra" + num).each(function (i) {
            palabra += $(this).val();
        });

        if (palabra === sol) {
            $(".palabra" + num).each(function (i) {
                $(this).addClass("bien");
                $(this).prop("readonly", true);
            });
        }
    }

    function checkPar(num) {
        let palabra = palabras[num];
        let palabraAnt = palabras[num - 1];

        if (diccionario.includes(palabra) && parvalida(palabra, palabraAnt)) {
            $(".palabra" + num).each(function (i) {
                $(this).addClass("bien");
            });
        } else {
            $(".palabra" + num).each(function (i) {
                $(this).removeClass("bien");
            });
        }
    }

    function checkImpar(num) {
        let palabra = palabras[num];
        let palabraAnt = palabras[num - 1];

        if (diccionario.includes(palabra) && inparValida(palabra, palabraAnt)) {
            $(".palabra" + num).each(function (i) {
                $(this).addClass("bien");
            });
        } else {
            $(".palabra" + num).each(function (i) {
                $(this).removeClass("bien");
            });
        }
    }

    function inparValida(str1, str2) {
        if (str1.length != str2.length) return false;
        let differences = 0;
        for (let i = 0; i < str1.length; i++) {
            if (str1.charAt(i) != str2.charAt(i))
                if (++differences > 1) {
                    return false;
                }
        }
        return true;
    }

    function parvalida(str1, str2) {
        return new Set(str1).size === new Set(str1 + str2).size;
    }
}

function loadStorage() {
    localS = window.localStorage.getItem("localS");
    palabras = window.localStorage.getItem("palabras").split(",");
    pistas = window.localStorage.getItem("pistas");
    $("#pistasNum").text("Pistas: " + pistas);
    let casilla = [];

    palabras.forEach((element) => {
        let chars = element.split("");
        chars.forEach((e) => {
            casilla.push(e);
        });
    });

    $(".letra").each(function (i) {
        $(this).val(casilla.shift(0));
    });
}