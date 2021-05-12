const  express = require('express');
const application = express();
const bodyParser = require('body-parser');
application.use(bodyParser.json()); 

application.post('/palabras', (req, res) => {
    console.log('Got body:', req.body.palabras);
   // res.end(checkCascada(JSON.parse(req.body)));
});

application.use(express.static('public'));


application.listen(8080, ()  => console.log('Servidor funcionando!'));






function checkCascada(palabras) {
    var res = []

    //primero checkeo las definidas
    checkPalabaraDefinida(palabras[0], "clan");
    checkPalabaraDefinida(palabras[5], "pena");
    checkPalabaraDefinida(palabras[6], "remato");
    checkPalabaraDefinida(palabras[11], "torero");

    let posPalabras = [1, 2, 3, 4, 7, 8, 9, 10];

    posPalabras.forEach((p) => {
        if (p % 2 == 0) checkPar(p);
        else checkImpar(p);
    });

    function checkPalabaraDefinida(palabra, sol) {
        if (palabra === sol) {
            $(".palabra" + num).each(function (i) {
                res.push(true)
            });
        }else{
            res.push(false)
        }
    }

    function checkPar(num) {
        let palabra = palabras[num];
        let palabraAnt = palabras[num - 1];

        if (diccionario.includes(palabra) && parvalida(palabra, palabraAnt)) {
            res.push(true)
        } else {
            res.push(false)
        }
    }

    function checkImpar(num) {
        let palabra = palabras[num];
        let palabraAnt = palabras[num - 1];

        if (diccionario.includes(palabra) && inparValida(palabra, palabraAnt)) {
            res.push(true)
        } else {
            res.push(false)
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
        if(differences == 0) return false;
        return true;
    }

    function parvalida(str1, str2) {
        return new Set(str1).size === new Set(str1 + str2).size && str1 != str2;
    }
    console.log(res)
    return res
}

