var cascada;
var tabla;
var diccionario = [];
var palabras1 = [];
var palabras2 = [];
var palabras3 = [];
var pistas = 3;
var id = 0;
var option = '1';
var localS;

$(document).ready(function () {
  localS = window.localStorage.getItem("localS");
  if (!localS) localS = confirm("Permites el almacenamianto");
  generatecascada();
  if (localS && window.localStorage.length > 0) loadStorage();
  else initLocalStorage();
  fetchDict();

  $("#pas1").click(clickOpt1);

  $("#pas2").click(clickOpt2);

  $("#pas3").click(clickOpt3);

  $("#restart").click(function (e) {
    localStorage.clear();
    location.reload();
  });

  $("#comprobar").click(function (e) {
    $.post(
      "/palabras",
      { palabras: readPalabras().toString(), option: option },
      function (data) {
        data = data.replace("[", "");
        data = data.replace("]", "");
        let resultados = data.split(",");
        for (let i = 0; i < resultados.length; i++) {
          if (resultados[i] == "true") {
            $(".palabra" + i).each(function (i) {
              $(this).addClass("bien");
            });
          } else {
            $(".palabra" + i).each(function (i) {
              $(this).removeClass("bien");
            });
          }
        }
      }
    );
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
    if (localS) {
      window.localStorage.setItem("palabras" + option, readPalabras(option));
    }

    //Moverse hacia delante al escribir
    var index = $(this).index("input");
    $(".letra:eq(" + (index + 1) + ")").focus();

    //Moverse hacia detrás al borrar
    if ((e.which == 8 || e.which == 46) && $(this).val() == "") {
      $(".letra:eq(" + (index - 1) + ")").focus();
    }
  });
});

function clickOpt3() {
  option = '3';
  loadPalabras(option);
  if (localS) window.localStorage.setItem("option", option);
}

function clickOpt2() {
  option = '2';
  loadPalabras(option);
  if (localS) window.localStorage.setItem("option", option);
}

function clickOpt1() {
  option = '1';
  loadPalabras(option);
  if (localS) window.localStorage.setItem("option", option);
}

//Limpiar tablero
function clearTablero() {
  $(".letra").each(function (i) {
    $(this).val('')
    $(this).removeClass("bien");
  });
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

//Carga las palabras 
function loadPalabras(option) {
  clearTablero();
  let palabras = [];
  switch (option) {
    case '1':
      palabras = palabras1;
      $("#pas1").html("Pasatiempos 1 ✅");
      $("#pas2").html("Pasatiempos 2");
      $("#pas3").html("Pasatiempos 3");
      $("#definiciones").html(
        "<strong>1.</strong>Familia en Escocia.<strong>2.</strong>Tristeza y dolor por algo.<strong>3.</strong>Termino algo definitivamente.<strong>4. </strong>El que torea."
      );
      break;

    case '2':
      palabras = palabras2;
      $("#pas1").html("Pasatiempos 1");
      $("#pas2").html("Pasatiempos 2 ✅");
      $("#pas3").html("Pasatiempos 3");
      $("#definiciones").html(
        "<strong>1.</strong>Variedad de manzano, cuyo fruto es más largo que grueso.<strong>2.</strong>Huelga.<strong>3.</strong>Suceso favorable o fortuito.<strong>4.</strong>Carente de rasgos distintivos."
      );
      break;

    case '3':
      palabras = palabras3;
      $("#pas1").html("Pasatiempos 1");
      $("#pas2").html("Pasatiempos 2");
      $("#pas3").html("Pasatiempos 3 ✅");
      $("#definiciones").html(
        "<strong>1.</strong>Familia en francia.<strong>2.</strong>Tristeza y dolor por algo.<strong>3.</strong>Termino algo definitivamente.<strong>4. </strong>El que torea."
      );
      break;
  }

  let casilla = [];
  palabras.forEach((element) => {
    let chars = element.split("");
    chars.forEach((e) => {
      casilla.push(e);
    });
  });

  $(".letra").each(function (i) {
    if (casilla[0] != " ") $(this).val(casilla.shift(0));
    else casilla.shift(0);
  });
}

function readPalabras(option) {
  let palabras = [];
  for (let i = 0; i < 12; i++) {
    let palabra = "";
    $(".palabra" + i).each(function (i) {
      palabra += $(this).val();
      if ($(this).val() === "") palabra += " ";
    });

    palabras.push(palabra);
  }
  return palabras;
}

function loadStorage() {
  localS = window.localStorage.getItem("localS");
  
  palabras1 = window.localStorage.getItem("palabras1").split(",");
  palabras2 = window.localStorage.getItem("palabras2").split(",");
  palabras3 = window.localStorage.getItem("palabras3").split(",");
  
  pistas = window.localStorage.getItem("pistas");
  $("#pistasNum").text("Pistas: " + pistas);
  
  option = window.localStorage.getItem("option");
  loadPalabras(option);
}

function initLocalStorage() {
  window.localStorage.setItem("option", option);
  window.localStorage.setItem("localS", true);
  window.localStorage.setItem("pistas", 3);
  window.localStorage.setItem("palabras1", palabras1);
  window.localStorage.setItem("palabras2", palabras1);
  window.localStorage.setItem("palabras3", palabras1);
}