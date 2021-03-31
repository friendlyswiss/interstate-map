#!/usr/bin/env node

//iconvert-unsigned

//Variables to reference the file(s)
const fs = require('fs')
const path = require('path')
const myArgs = process.argv.slice(2);
const arrayLength = myArgs.length

//Regular expression variables
const interstate = /^I |B[LS] I/
const threeDigits = /[0-9]{3}/
const twoDigits = /I [0-9]{2}[A-Z]*| [0-9]{2}$/
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
      
      let props = data.features[j].properties
      
      //Loop through each property in the feature
      for(let key in props){

        if (key == "unsigned_ref"){

          let refArray = props[key].split(';') //refs is an array of each semicolon-separated designation in the string
          let refCount = refArray.length

          //Loop through each individual ref value
          for (let k = 0; k < refCount; k++) {
            
            //ref is the semicolon-separated substring (e.g. "I 240")
            let ref = refArray[k]
            
            //Check to make sure the substring is a mainline interstate with three digits
            if (ref.match(interstate)){

              if (!ref.match(business)){

                if (ref.match(threeDigits)) {
              
                  let refNum = ref.slice(2)
                  props.refLen = refNum.length
                  props.refNum = refNum
                  props.routeTensDigit = Number(refNum.charAt(1))
                  props.routeTier = "auxiliary"

                  let onesDigit = Number(refNum.charAt(2))

                  if (onesDigit % 2 == 0) {
                    props.routeOnesDigit = "even"
                  }
                  else {
                    props.routeOnesDigit = "odd"
                  }
                }

                else if (ref.match(twoDigits)) {
                  
                  let refNum = ref.slice(2)
                  props.refLen = refNum.length
                  props.refNum = refNum
                  props.routeTensDigit = Number(refNum.charAt(0))
                  let onesDigit = Number(refNum.charAt(1))

                  if (onesDigit == 0 | onesDigit == 5) {
                    props.routeTier = "major"
                  }

                  else {
                    props.routeTier = "primary"
                  }

                  if (onesDigit % 2 == 0) {
                    props.routeOnesDigit = "even"
                  }
                  else {
                    props.routeOnesDigit = "odd"
                  }
                }

                else {
                  let refNum = ref.slice(2)
                  props.refLen = refNum.length
                  props.routeTensDigit = 0

                  props.refNum = refNum
                  let onesDigit = Number(refNum.charAt(0))
                
                  if (refNum == 5) {
                    props.routeTier = "major"
                  }

                  else {
                    props.routeTier = "primary"
                  }

                  if (onesDigit % 2 == 0) {
                    props.routeOnesDigit = "even"
                  }
                  else {
                    props.routeOnesDigit = "odd"
                  }
                }
              }
              
              else {
                console.log("This is a business interstate: " + ref)
              }
            }

            else {
              console.log("Not an interstate: " + ref)
            }
          }
        }

        //When a property called "ref" is found
        else if (key != "ref" && key != "name" && key != "@id" && key != "fut_ref"){
          delete props[key]
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