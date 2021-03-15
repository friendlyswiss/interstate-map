#!/usr/bin/env node

//iconvert-major

//Variables to reference the file(s)
const fs = require('fs')
const path = require('path')
const myArgs = process.argv.slice(2);
console.log(process.argv)
const arrayLength = myArgs.length

// //Do everything below for each file included
// for (let i = 0; i < arrayLength; i++) {
//   fs.readFile(myArgs[i], 'utf8' , (err, data) => {
//     if (err) {
//       console.error(err)
//       return
//     }
    
//     //For each file...
//     //data is a Buffer, convert to string before parsing
//     data = JSON.parse(data.toString());
    
//     const featureCount = data.features.length
    
//     //Loop through each feature in the geojson file
//     for (let j = 0; j < featureCount; j++) {
      
//       let props = data.features[j].properties
      
//       //Loop through each property in the feature
//       for(let key in props){

//         //When a property called "ref" is found
//         if (key != "ref" && key != "name" && key != "@id" && key != "fut_ref" && key != "unsigned_ref"){
//           delete props[key]
//         }
//       }
//     }
    
//     const result = data
        
//     //Create new directory if it doesn't exist yet
//     const newPath = path.dirname(myArgs[i]) + "/transformed"
//     try {
//       if (!fs.existsSync(newPath)) {
//         fs.mkdirSync(newPath)
//       }
//     } catch (err) {
//       console.error(err)
//     }
    
//     // Serialize result and write to file
//     fs.writeFile(newPath + '/' + path.basename(myArgs[i], path.extname(myArgs[i])) + '-transformed.geojson', JSON.stringify(result), err => {
//       if (err) {
//         console.error(err)
//         return
//       }
//     })
//   })
// }