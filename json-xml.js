const readline = require('readline-sync');
const fs = require('fs')
var XMLWriter = require('xml-writer')
var DOMParser = require('xmldom').DOMParser
var format = require('xml-formatter')

function Persona (name, lname, age, dir) {
    this.Nombre = name,
    this.Apellido = lname,
    this.Edad = age,
    this.Direccion = dir,
    this.getName = function () {
        return this.Nombre
    },
    this.getLName = function () {
        return this.Apellido
    },
    this.getAge = function () {
        return this.Edad
    },
    this.getAddress = function () {
        return this.Direccion
    }
}

var x = true
while(x) {
    var accion = readline.question('opcion: ')
    var p

    switch (accion) {

        case 'a�adir':
            var name = readline.question('Nombre: '); var lname = readline.question('Apellido: ')
            var age = readline.question('Edad: '); var dir = readline.question('Direccion: ')

            var p = new Persona(name, lname, age, dir)

            var tipo = readline.question('Tipo de archivo a acceder: ')

            switch(tipo){
                case 'json':
                    var personajson = JSON.parse(fs.readFileSync('persona.json','utf8'))
                    personajson.index++
                    personajson['persona' + personajson['index']] = p
                    fs.writeFileSync('persona.json', JSON.stringify(personajson, null, 2), null)

                    console.log(`Añadida persona ${name} ${lname} en json`)
                    break
                case 'xml':
                    // leer xml
                    var personaxml = new XMLWriter(fs.readFileSync('persona.xml', 'utf-8'))
                    var parser = new DOMParser()            
                    var xmlS = personaxml.indentString
                    //console.log(`xmlS: ${xmlS}`)
                    var xmlDoc = parser.parseFromString(xmlS,'text/xml')
                    xmlDoc.getElementsByTagName("index")[0].textContent++
                    var ind = xmlDoc.getElementsByTagName("index")[0].textContent

                    // var tagg = ['nombre', 'apellido', 'edad', 'direccion']
                    // var vall = [p.getName(), p.getLName(), p.getAge(), p.getAddress()]

                    // crear tag persona
                    // var newXML = xmlDoc.createElement('persona')
                    //**xmlDoc.getElementsByTagName('personas')[0].appendChild(xmlDoc.createElement('persona'))
                    //

                    /*
                    for (var i = 0; i < 4; i++) {
                        // crear nuevo tag
                        var newElem = xmlDoc.createElement(tagg[i])
                        var newText = xmlDoc.createTextNode(vall[i])
                        newElem.appendChild(newText)
                        //
                        
                        // añadir objetos
                        newXML.appendChild(newElem)
                        //**xmlDoc.getElementsByTagName('persona')[ind].appendChild(newElem)
                        //
                    }
                    */
                    
                    // incrementar index
                    
                    //

                    //xmlDoc.getElementsByTagName('personas')[0].appendChild(parser.parseFromString())
                    var newxmls = `<personas><index>${ind}</index>`
                    var xx = `<persona><Nombre>${name}</Nombre><Apellido>${lname}</Apellido>`
                    xx += `<Edad>${age}</Edad><Direccion>${dir}</Direccion></persona>`

                    xx = format(xx)
                    console.log(ind)

                    for (var i = newxmls.length; i < xmlS.length - 11; i++) {
                        newxmls += xmlS[i]                        
                    }
                    newxmls += xx
                    newxmls += '</personas>'
                    // guardar xml
                    fs.writeFileSync('persona.xml', newxmls, null)
                    //
                    console.log(`Añadida persona ${name} ${lname} en xml`)
                    break
                default:
                    console.log('Acción cancelada.')
            }
            break
        case 'salir':
            x = false
            break
        case 'mostrar':
            var tipo = readline.question('Tipo de archivo a acceder: ')

            switch(tipo) {
                case 'json':
                    var personajson = JSON.parse(fs.readFileSync('persona.json','utf8'))
                    for(var i in personajson) {
                        //console.log(`i: ${i}`)
                        //console.log(`persona[i]: ${personajson[i].nombre}`)
                        if (i !== 'index') {
                            for (var j in personajson[i]) {
                                console.log(`${j}: ${personajson[i][j]}`)
                            }
                            console.log()
                        }
                    }
                    break
                case 'xml':
                    var personaxml = new XMLWriter(fs.readFileSync('persona.xml', 'utf-8'))
                    var parser = new DOMParser()
                    
                    var xmlS = personaxml.indentString
                    var xmlDoc = parser.parseFromString(xmlS,'text/xml')

                    var ind = xmlDoc.getElementsByTagName("index")[0].textContent
        
                    for (j = 0; j < ind; j++) {
                        var x = xmlDoc.getElementsByTagName("persona")[j]
                        var xlen = x.childNodes.length
                        var y = x.firstChild
                        var txt = ''
                        for (i = 0; i < xlen; i++) {
                            if (y.nodeType === 1) {
                                var newtc = ''
                                var value = true
                                for (var zz = 9; zz < y.textContent.length - 4; zz++) {
                                    newtc += y.textContent[zz]
                                }
                                txt += `${y.nodeName}: ${newtc}`;
                            }
                            y = y.nextSibling
                        }
                        console.log(txt)
                    }
                    break
                default:
                    console.log('Error.')
                    break
            }
            break
        default:
            console.log('Error.')
            break
    }
}
