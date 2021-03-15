#!/usr/bin/env node

//iconvert-triplex

//Variables to reference the file(s)
const fs = require('fs')
const path = require('path')
const myArgs = process.argv.slice(2);
const arrayLength = myArgs.length

//Regular expression variables
const interstate = /^I |B[LS] I/
const threeDigits = /[0-9]{3}/
const twoDigits = / [0-9]{2}$| [0-9]{2};|[0-9]{2}[- ]/
const business = /[Bb][LSUu]/
const alt = /[Aa][Ll][Tt]/

//Do everything below for each file included
for (let i = 0; i < arrayLength; i++) {
  fs.readFile(myArgs[i], 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    
    //For each file...
    //data is a Buffer, convert to string before parsing
    data = JSON.parse(data.toString());
    
    const featureCount = data.features.length
    
    //Loop through each feature in the geojson file
    for (let j = 0; j < featureCount; j++) {
      
      //Make a clone of the feature's properties object
      let props = JSON.parse(JSON.stringify(data.features[j].properties))
      let iCount = 0
      props.routes = []

      //Loop through each property in the feature
      for(let key in data.features[j].properties){

        if (key == "ref" | key == "fut_ref" | key == "unsigned_ref"){

          let refArray = props[key].split(';') //refs is an array of each semicolon-separated designation in the string
          let refCount = refArray.length

          //Loop through each individual ref value
          for (let k = 0; k < refCount; k++) {
            
            //ref is the semicolon-separated substring (e.g. "I 240")
            let ref = refArray[k]

            //Check to make sure the substring is a mainline interstate with three digits
            if (ref.match(interstate) && !ref.match(alt)){
              
              let route = {}
              route["name"] = ref

              //Set refn.status for each
              if (key == "ref") {
                route["status"] = "signed"
              }
              else if (key == "unsigned_ref") {
                route["status"] = "unsigned"
              }
              else if (key == "fut_ref") {
                route["status"] = "future"
              }

              //Set refs[n].role for each
              if (ref.match(business)){
                route["role"] = "business"
              }
              else {
                route["role"] = "mainline"
              }

              if (ref.match(threeDigits)) {
                
                let numIndex = ref.indexOf("I ") + 2
                let refNum = ref.slice(numIndex,numIndex + 3)
                let tensDigit = Number(refNum.charAt(1))
                let onesDigit = Number(refNum.charAt(2))
                
                route["tensDigit"] = tensDigit
                route["tier"] = "auxiliary"

                if (onesDigit % 2 == 0) {
                  route.onesDigit = "even"
                }
                else {
                  route.onesDigit = "odd"
                }
              }

              else if (ref.match(twoDigits)) {
                
                let numIndex = ref.indexOf("I ") + 2
                let refNum = ref.slice(numIndex,numIndex + 2)
                let tensDigit = Number(refNum.charAt(0))
                let onesDigit = Number(refNum.charAt(1))

                route["tensDigit"] = tensDigit

                if (onesDigit == 0 | onesDigit == 5) {
                  route["tier"] = "major"
                }

                else {
                  route["tier"] = "primary"
                }

                if (onesDigit % 2 == 0) {
                  route.onesDigit = "even"
                }
                else {
                  route.onesDigit = "odd"
                }
              }

              else {

                let numIndex = ref.indexOf("I ") + 2
                let refNum = ref.slice(numIndex,numIndex + 1)
                let onesDigit = Number(refNum.charAt(0))
                route["tensDigit"] = 0

                if (onesDigit == 5) {
                  route["tier"] = "major"
                }

                else {
                  route["tier"] = "primary"
                }

                if (onesDigit % 2 == 0) {
                  route.onesDigit = "even"
                }
                else {
                  route.onesDigit = "odd"
                }
              }
              props.routes[iCount] = route
              iCount++
            }
          }
        }

        else if (key != "name" && key != "@id"){
          delete data.features[j].properties[key]
        }
      }
      //console.log(props.routes)
      
      //Sort array of route objects so that every features in a duplex/triplex will have its routes in the same order
      props.routes.sort((a,b)=> (a.tier > b.tier ? 1 : -1))
      props.routes.sort((a,b)=> (a.tensDigit > b.tensDigit ? 1 : -1))
      props.routes.sort((a,b)=> (a.role > b.role ? 1 : -1))
      props.routes.sort((a,b)=> (a.status > b.status ? 1 : -1))
      
      const routeCount = props.routes.length

      if (props.routes.length == 3){
        for (let k = 0; k < 3; k++) {
          data.features[j].properties["route" + k + "_ref"] = props.routes[k].name
          data.features[j].properties["route" + k + "_status"] = props.routes[k].status
          data.features[j].properties["route" + k + "_role"] = props.routes[k].role
          data.features[j].properties["route" + k + "_tensDigit"] = props.routes[k].tensDigit
          data.features[j].properties["route" + k + "_onesDigit"] = props.routes[k].onesDigit
          data.features[j].properties["route" + k + "_tier"] = props.routes[k].tier
        }

      }
      else if (props.routes.length == 2) {
        delete data.features[j]        
      }
      else if (props.routes.length > 3){
        console.log("More than three refs")
      }
      else if (props.routes.length < 2){
        delete data.features[j]
      }
    }

    // Will remove all falsy values: undefined, null, 0, false, NaN and "" (empty string)
    let result = {}
    result.type = data.type
    result.generator = data.generator
    result.copyright = data.copyright
    result.timestamp = data.timestamp
    result.features = []
    
    for (let j = 0; j < data.features.length; j++) {
      if (data.features[j]) {
        result.features.push(data.features[j]);
      }
    }
        
    //Create new directory if it doesn't exist yet
    const newPath = path.dirname(myArgs[i]) + "/transformed"
    try {
      if (!fs.existsSync(newPath)) {
        fs.mkdirSync(newPath)
      }
    } catch (err) {
      console.error(err)
    }
    
    // Serialize result and write to file
    fs.writeFile(newPath + '/' + path.basename(myArgs[i], path.extname(myArgs[i])) + '-transformed.geojson', JSON.stringify(result), err => {
      if (err) {
        console.error(err)
        return
      }
    })
  })
}