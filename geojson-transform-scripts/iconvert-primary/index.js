#!/usr/bin/env node

//iconvert-primary

//Variables to reference the file(s)
const fs = require('fs')
const path = require('path')
const myArgs = process.argv.slice(2);
const arrayLength = myArgs.length
let globalTensDigit = null
let globalTier = null

//Regular expression variables
const interstate = /^I /
const threeDigits = /[0-9]{3}/
const twoDigits = / [0-9]{2}$| [0-9]{2} ?[A-Z]/
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
    
    //Loop through each feature in the geojson file the first time to find the 10s digit and tier
    for (let j = 0; j < featureCount; j++) {
      
      let props = data.features[j].properties
      
      //Loop through each property in the feature looking for "ref"
      for(let key in props){

        if (key == "ref"){

          //Identify the first ref with a single route, and take its 10s digit and tier

          let refArray = props[key].split(';') //refArray is an array of each semicolon-separated designation in the string
          
          //If there is more than one ref, ignore it and move on to the next feature
          if (refArray.length == 1) {

            let ref = refArray[0]
            
            if (ref.match(interstate) && !ref.match(threeDigits) && !ref.match(business) && !ref.match(alt)){
              
              if (ref.match(twoDigits)) {
                //console.log("First single-value, two-digit, non-business interstate ref found was " + ref)
                let numIndex = ref.indexOf("I ") + 2
                let refNum = ref.slice(numIndex,numIndex + 2)
                globalTensDigit = Number(refNum.charAt(0))
                let onesDigit = Number(refNum.charAt(1))

                if (onesDigit == 0 | onesDigit == 5) {
                  globalTier = "major"
                }
                else {
                  globalTier = "primary"
                }
                console.log("File is " + globalTier + " " + globalTensDigit + "0s")
                break
              }
              else {
                let numIndex = ref.indexOf("I ") + 2
                let refNum = ref.slice(numIndex,numIndex + 1)
                globalTensDigit = 0
                let onesDigit = Number(refNum.charAt(0))

                if (onesDigit == 5) {
                  globalTier = "major"
                }
                else {
                  globalTier = "primary"
                }
                console.log("File is " + globalTier + " " + globalTensDigit + "0s")
                break
              }
            }
          }            
        }
      }
      if (globalTier != null){
        break
      }
    }
    if (globalTier == null){
      console.log("Could not identify the file's tens-digit and tier")
    }

    //Starting from the beginning, loop through each feature a second time
    for (let j = 0; j < featureCount; j++) {
      
      let props = JSON.parse(JSON.stringify(data.features[j].properties))
      let iCount = 0
      props.routes = []

      //Loop through each property in the feature
      for(let key in props){

        if (key == "ref"){
          //Identify the first ref with a single route, and take its 10s digit and tier

          let refArray = props[key].split(';') //refArray is an array of each semicolon-separated designation in the string
          let refCount = refArray.length

          //Loop through each individual ref value
          for (let k = 0; k < refCount; k++) {
            
            //ref is the semicolon-separated substring (e.g. "I 240")
            let ref = refArray[k]
            
            //Check to make sure the substring is a mainline interstate with three digits
            if (ref.match(interstate) && !ref.match(threeDigits) && !ref.match(business) && !ref.match(alt)){

              let route = {}
              route.ref = ref

              if (ref.match(twoDigits)) {

                let numIndex = ref.indexOf("I ") + 2
                let refNum = ref.slice(numIndex,numIndex + 2)
                let tensDigit = Number(refNum.charAt(0))
                let onesDigit = Number(refNum.charAt(1))

                route.tensDigit = tensDigit

                if (onesDigit == 0 | onesDigit == 5) {
                  route.tier = "major"
                }
                else {
                  route.tier = "primary"
                }
                if (onesDigit % 2 == 0) {
                  route.onesDigit = "even"
                }
                else {
                  route.onesDigit = "odd"
                }
                props.routes[iCount] = route
                iCount++
              }
              else {

                let numIndex = ref.indexOf("I ") + 2
                let refNum = ref.slice(numIndex,numIndex + 1)
                let tensDigit = 0
                let onesDigit = Number(refNum.charAt(0))

                route.tensDigit = tensDigit

                if (onesDigit == 5) {
                  route.tier = "major"
                }
                else {
                  route.tier = "primary"
                }
                if (onesDigit % 2 == 0) {
                  route.onesDigit = "even"
                }
                else {
                  route.onesDigit = "odd"
                }
                props.routes[iCount] = route
                iCount++
              }
            }
          }
        }

        //When a property called "ref" is found
        else if (key != "ref" && key != "name" && key != "@id" && key != "fut_ref" && key != "unsigned_ref"){
          delete data.features[j].properties[key]
        }
      }

      //Sort array of route objects so that every features in a duplex/triplex will have its routes in the same order
      props.routes.sort((a,b)=> (a.tier > b.tier ? 1 : -1))
      props.routes.sort((a,b)=> (a.tensDigit > b.tensDigit ? 1 : -1))
      
      const routeCount = props.routes.length
      let newFeatures = 0

      //console.log(props.routes)
      for (let k = 0; k < routeCount; k++){

        if (props.routes[k].tier == globalTier && props.routes[k].tensDigit == globalTensDigit) {
          
          if (newFeatures == 0) {
            data.features[j].properties.routeRef = props.routes[k].ref
            data.features[j].properties.routeTier = props.routes[k].tier
            data.features[j].properties.routeTensDigit = props.routes[k].tensDigit
            data.features[j].properties.routeOnesDigit = props.routes[k].onesDigit
          }
          else if (newFeatures > 0) {
            console.log("Creating new feature for " + data.features[j].properties.ref)
            let newFeature = JSON.parse(JSON.stringify(data.features[j]))
            newFeature.properties.routeRef = props.routes[k].ref
            newFeature.properties.routeTier = props.routes[k].tier
            newFeature.properties.routeTensDigit = props.routes[k].tensDigit
            newFeature.properties.routeOnesDigit = props.routes[k].onesDigit
            data.features.push(newFeature)
          }
          newFeatures++
        }
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