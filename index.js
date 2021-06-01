const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const fetch = require("node-fetch");
const application = express();

application.use(bodyParser.urlencoded({ extended: true }));
application.use(bodyParser.json());

var soluciones = JSON.parse(fs.readFileSync('soluciones.json'));

application.post("/palabras", function (req, res) {
  console.log("Option: " + req.body.option);
  console.log(req.body.palabras);
  palabras = req.body.palabras.split(",");
  option = req.body.option;
  res.end(JSON.stringify(checkCascada(palabras,option)));
});

application.use(express.static("public"));

application.listen(8080, () => {
  console.log("Servidor funcionando!");
  fetchDict();
});

var diccionario = [];
//Descargar dict
async function fetchDict() {
  try {
    await fetch("https://ordenalfabetix.unileon.es/aw/diccionario.txt")
      .then((response) => response.text())
      .then((response) => {
        saveDict(response);
      });
  } catch (err) {
    console.error("Error al cargar el diccionario. Intente de nuevo" + err);
  }
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

function checkCascada(palabras, option) {
  var res = new Array(12);

  switch (option) {
    case '1':
      checkPalabaraDefinida(0, soluciones.pasatiempos1.palabra1);
      checkPalabaraDefinida(5, soluciones.pasatiempos1.palabra2);
      checkPalabaraDefinida(6, soluciones.pasatiempos1.palabra3);
      checkPalabaraDefinida(11,soluciones.pasatiempos1.palabra4);
      break;

    case '2':
      console.log("TEST");
      checkPalabaraDefinida(0, soluciones.pasatiempos2.palabra1);
      checkPalabaraDefinida(5, soluciones.pasatiempos2.palabra2);
      checkPalabaraDefinida(6, soluciones.pasatiempos2.palabra3);
      checkPalabaraDefinida(11,soluciones.pasatiempos2.palabra4);
      break;

    case '3':
      checkPalabaraDefinida(0, soluciones.pasatiempos3.palabra1);
      checkPalabaraDefinida(5, soluciones.pasatiempos3.palabra2);
      checkPalabaraDefinida(6, soluciones.pasatiempos3.palabra3);
      checkPalabaraDefinida(11,soluciones.pasatiempos3.palabra4);
      break;
  }

  let posPalabras = [1, 2, 3, 4, 7, 8, 9, 10];

  posPalabras.forEach((p) => {
    if (p % 2 == 0) checkPar(p);
    else checkImpar(p);
  });

  function checkPalabaraDefinida(num, sol) {
    if (palabras[num] === sol) {
      res[num] = true;
    } else {
      res[num] = false;
    }
  }

  function checkPar(num) {
    let palabra = palabras[num];
    let palabraAnt = palabras[num - 1];

    if (diccionario.includes(palabra) && parvalida(palabra, palabraAnt)) {
      res[num] = true;
    } else {
      res[num] = false;
    }
  }

  function checkImpar(num) {
    let palabra = palabras[num];
    let palabraAnt = palabras[num - 1];

    if (diccionario.includes(palabra) && inparValida(palabra, palabraAnt)) {
      res[num] = true;
    } else {
      res[num] = false;
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
    if (differences == 0) return false;
    return true;
  }

  function parvalida(str1, str2) {
    return new Set(str1).size === new Set(str1 + str2).size && str1 != str2;
  }
  console.log(res);
  return res;
}