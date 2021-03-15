#!/usr/bin/env node

//iconvert-business

//Variables to reference the file(s)
const fs = require('fs')
const path = require('path')
const myArgs = process.argv.slice(2);
const arrayLength = myArgs.length

//Regular expression variables
const interstate = /^I |B[LS] I/
const threeDigits = /[0-9]{3}/
const twoDigits = /I [0-9]{2}[-]*[A-Z]* | [0-9]{2}$/
const business = /[Bb][LSUu]/

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
      
      let props = JSON.parse(JSON.stringify(data.features[j].properties))
      let iCount = 0
      props.routes = []
      
      //Loop through each property in the feature
      for(let key in props){

        if (key == "ref"){

          let refArray = props[key].split(';') //refs is an array of each semicolon-separated designation in the string
          let refCount = refArray.length

          //Loop through each individual ref value
          for (let k = 0; k < refCount; k++) {
            
            //ref is the semicolon-separated substring (e.g. "I 240")
            let ref = refArray[k]
            
            //Check to make sure the substring is a mainline interstate with three digits
            if (ref.match(interstate)){

              if (ref.match(business)){

                let route = {}
                route.ref = ref

                if (ref.match(threeDigits)) {
                  
                  let numIndex = ref.indexOf("I ") + 2
                  let refNum = ref.slice(numIndex,numIndex + 3)
                  route.tensDigit = Number(refNum.charAt(1))

                  let onesDigit = Number(refNum.charAt(2))

                  if (onesDigit % 2 == 0) {
                    props.routeOnesDigit = "even"
                  }
                  else {
                    props.routeOnesDigit = "odd"
                  }
                }

                else if (ref.match(twoDigits)) {
                  
                  let numIndex = ref.indexOf("I ") + 2
                  let refNum = ref.slice(numIndex,numIndex + 2)
                  route.tensDigit = Number(refNum.charAt(0))
                  let onesDigit = Number(refNum.charAt(1))

                  if (onesDigit % 2 == 0) {
                    route.onesDigit = "even"
                  }
                  else {
                    route.onesDigit = "odd"
                  }        
                }

                else {

                  route.tensDigit = 0
                  let numIndex = ref.indexOf("I ") + 2
                  let refNum = ref.slice(numIndex,numIndex + 1)
                  let onesDigit = Number(refNum.charAt(0))

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
        }

        //When a property called "ref" is found
        else if (key != "name" && key != "@id" && key != "fut_ref" && key != "unsigned_ref"){
          delete data.features[j].properties[key]
        }
      }

      props.routes.sort((a,b)=> (a.tensDigit > b.tensDigit ? 1 : -1))

      const routeCount = props.routes.length
      let newFeatures = 0

      for (let k = 0; k < routeCount; k++){
          
        if (newFeatures == 0) {
          data.features[j].properties.routeRef = props.routes[k].ref
          data.features[j].properties.routeTensDigit = props.routes[k].tensDigit
          data.features[j].properties.routeOnesDigit = props.routes[k].onesDigit
        }
        else if (newFeatures > 0) {
          console.log("Creating new feature for " + data.features[j].properties.ref)
          let newFeature = JSON.parse(JSON.stringify(data.features[j]))
          newFeature.properties.routeRef = props.routes[k].ref
          newFeature.properties.routeTensDigit = props.routes[k].tensDigit
          newFeature.properties.routeOnesDigit = props.routes[k].onesDigit
          data.features.push(newFeature)
        }
        newFeatures++
      }
    }

    const result = data
        
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