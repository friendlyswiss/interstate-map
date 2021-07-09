/////////////////////////PUBLIC MAPBOX TOKEN////////////////////////

mapboxgl.accessToken =
  "pk.eyJ1IjoiY2FybGVkZ2UiLCJhIjoiY2tsd2kxa245MmlwazJ1bHdhendncGYzNSJ9.ejONKNoTMvl1kNIdS9SRyQ";

/////////////////////////GLOBAL VARIABLES////////////////////////

const defaultLineWidth = 2

const layerList = ['triplex-interstates-0','triplex-interstates-1','triplex-interstates-2','duplex-interstates-0','duplex-interstates-1','i-90s-major','i-80s-major','i-70s-major','i-60s-major','i-50s-major','i-40s-major','i-30s-major','i-20s-major','i-10s-major','i-00s-major','i-90s-primary','i-80s-primary','i-70s-primary','i-60s-primary','i-50s-primary','i-40s-primary','i-30s-primary','i-20s-primary','i-10s-primary','i-00s-primary','auxiliary-interstates','unsigned-interstates','business-interstates','unsigned-business-interstates','future-interstates']

////////////////////////DEFINING COLOR PALETTE//////////////////////////

//Base colors, slightly modified from perceptually uniform colors
const rawBaseColors = [
  "#FFFFFF","#F05E84","#D57B00","#BDAA00","#47D600","#00D688","#00B1BF","#009CF1","#AF73F8","#EB51CF"
]

const baseColors = []
for (i = 0; i < 10; i++) {
 tinyColor = tinycolor(rawBaseColors[i]) 
 baseColors.push(eval(tinyColor))
}

const majorColors = []
for (i = 0; i < 10; i++) {
  const color = baseColors[i].toString()
  majorColors.push(color)
}

const primaryColors = []
for (i = 0; i < 10; i++) {
  const color = baseColors[i].clone().desaturate(40).toString()
  primaryColors.push(color)
}

const auxiliaryColors = []
for (i = 0; i < 10; i++) {
  const color = baseColors[i].clone().desaturate(60).lighten(5).toString()
  auxiliaryColors.push(color)
}

const businessColors = []
for (i = 0; i < 10; i++) {
  const color = baseColors[i].clone().desaturate(70).lighten(5).toString()
  businessColors.push(color)
}

const futureColors = []
for (i = 0; i < 10; i++) {
  const color = baseColors[i].clone().desaturate(70).lighten(10).toString()
  futureColors.push(color)
}

////////////////////////MANUAL COLOR TWEAKS FOR CONTRAST////////////////////////////

//Set shades of grey for 00s
primaryColors[0] = "#cccccc"
auxiliaryColors[0] = "#adadad"
businessColors[0] = "#e6e6e6"

//Nudge down saturation on teals
let routesToDesaturate = [6]
for (i = 0; i < routesToDesaturate.length; i++){
  primaryColors[routesToDesaturate[i]] = baseColors[routesToDesaturate[i]].clone().desaturate(50).toString()
  auxiliaryColors[routesToDesaturate[i]] = baseColors[routesToDesaturate[i]].clone().desaturate(70).lighten(10).toString()
  businessColors[routesToDesaturate[i]] = baseColors[routesToDesaturate[i]].clone().desaturate(80).lighten(7).toString()
  futureColors[routesToDesaturate[i]] = baseColors[routesToDesaturate[i]].clone().desaturate(80).lighten(12).toString()
}

//Nudge up saturation on reds, pinks, and purples
let routesToSaturate = [1,8,9]
for (i = 0; i < routesToSaturate.length; i++){
  primaryColors[routesToSaturate[i]] = baseColors[routesToSaturate[i]].clone().desaturate(30).toString()
  auxiliaryColors[routesToSaturate[i]] = baseColors[routesToSaturate[i]].clone().desaturate(40).lighten(5).toString()
  businessColors[routesToSaturate[i]] = baseColors[routesToSaturate[i]].clone().desaturate(50).lighten(5).toString()
  futureColors[routesToSaturate[i]] = baseColors[routesToSaturate[i]].clone().desaturate(50).lighten(10).toString()
}

//Dump all color values into a single object
const colors = {
  'signed': {
    'major': {
      'mainline': majorColors,
      'business': businessColors
    },
    'primary': {
      'mainline': primaryColors,
      'business': businessColors
    },
    'auxiliary': {
      'mainline': auxiliaryColors,
      'business': businessColors
    }
  },
  'future': {
    'major': {
      'mainline': futureColors,
      'business': futureColors
    },
    'primary': {
      'mainline': futureColors,
      'business': futureColors
    },
    'auxiliary': {
      'mainline': futureColors,
      'business': futureColors
    }
  },
  'unsigned': {
    'major': {
      'mainline': majorColors,
      'business': businessColors
    },
    'primary': {
      'mainline': primaryColors,
      'business': businessColors
    },
    'auxiliary': {
      'mainline': auxiliaryColors,
      'business': businessColors
    }
  }
}

//////////////////////////COLOR KEY//////////////////////////////////

let colorKey = document.getElementById("color-key")

let cells = colorKey.querySelectorAll("td.major")
for (i = 0; i < 10; i++) {
  cells[i].style.setProperty('background', colors.signed.major.mainline[i])
}

cells = colorKey.querySelectorAll("td.primary")
for (i = 0; i < 10; i++) {
  cells[i].style.setProperty('background', colors.signed.primary.mainline[i])
}

cells = colorKey.querySelectorAll("td.auxiliary")
for (i = 0; i < 10; i++) {
  cells[i].style.setProperty('background', colors.signed.auxiliary.mainline[i])
}

cells = colorKey.querySelectorAll("td.business")
for (i = 0; i < 10; i++) {
  cells[i].style.setProperty('background', businessColors[i])
}

cells = colorKey.querySelectorAll("td.future")
for (i = 0; i < 10; i++) {
  cells[i].style.setProperty('background', futureColors[i])
}

//////////////////////////////MAP///////////////////////////

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/carledge/ckkvvjic73m7s18pl38y4n7jb',
  center: [-98.583333, 39.833333],
  zoom: 3,
  maxZoom: 15,
  maxBounds: [[-142, 18],[-54, 55]],
  dragRotate: false,
  touchZoomRotate: false,
  pitchWithRotate: false,
  touchPitch: false,
  logoPosition: 'bottom-right',
  attributionControl: false,
  renderWorldCopies: false
});

map.touchZoomRotate.enable();
map.touchZoomRotate.disableRotation();

map.on('load', function () {
  
  map.addSource("interstatesPrimary", {
    type: "vector",
    url: "mapbox://carledge.interstates-primary"
  });
  
  map.addSource("interstatesSecondary", {
    type: "vector",
    url: "mapbox://carledge.interstates-secondary"
  });

////////////////MAP LAYERS/////////////////////////////////////////////////////////  

////////////////TRIPLEX INTERSTATES//////////////////////////////////////////////// 
  
  map.addLayer({
    id: "triplex-interstates-0",
    type: "line",
    source: "interstatesSecondary",
    'source-layer': "triplex-interstates",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": ["string", ["at", ["get", "route0_tensDigit"], ["get", ["get", "route0_role"], ["get", ["get", "route0_tier"], ["get", ["get", "route0_status"], ["literal", colors]]]]]],
      "line-offset": 0,
      "line-width": ["*", 1, defaultLineWidth]
    },
    filter: ['all', ["==", ["get", "route0_status"], "signed"], ["==", ["get", "route1_status"], "signed"], ["==", ["get", "route2_status"], "signed"], ["==", ["get", "route0_role"], "mainline"], ["==", ["get", "route1_role"], "mainline"], ["==", ["get", "route2_role"], "mainline"]]
    },"road-label");
  
  map.addLayer({
    id: "triplex-interstates-1",
    type: "line",
    source: "interstatesSecondary",
    'source-layer': "triplex-interstates",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": ["string", ["at", ["get", "route1_tensDigit"], ["get", ["get", "route1_role"], ["get", ["get", "route1_tier"], ["get", ["get", "route1_status"], ["literal", colors]]]]]],
      "line-offset": ["*", 1, defaultLineWidth],
      "line-width": ["*", 1, defaultLineWidth]
    },
    filter: ['all', ["==", ["get", "route0_status"], "signed"], ["==", ["get", "route1_status"], "signed"], ["==", ["get", "route2_status"], "signed"], ["==", ["get", "route0_role"], "mainline"], ["==", ["get", "route1_role"], "mainline"], ["==", ["get", "route2_role"], "mainline"]]
    },"triplex-interstates-0");
  
  map.addLayer({
    id: "triplex-interstates-2",
    type: "line",
    source: "interstatesSecondary",
    'source-layer': "triplex-interstates",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": ["string", ["at", ["get", "route2_tensDigit"], ["get", ["get", "route2_role"], ["get", ["get", "route2_tier"], ["get", ["get", "route2_status"], ["literal", colors]]]]]],
      "line-offset": ["*", 2, defaultLineWidth],
      "line-width": ["*", 1, defaultLineWidth]
    },
    filter: ['all', ["==", ["get", "route0_status"], "signed"], ["==", ["get", "route1_status"], "signed"], ["==", ["get", "route2_status"], "signed"], ["==", ["get", "route0_role"], "mainline"], ["==", ["get", "route1_role"], "mainline"], ["==", ["get", "route2_role"], "mainline"]]
    },"triplex-interstates-1");
  
  ////////////////DUPLEX INTERSTATES//////////////////////////////////////////////// 
  
  map.addLayer({
    id: "duplex-interstates-0",
    type: "line",
    source: "interstatesSecondary",
    'source-layer': "duplex-interstates",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
     "line-color": ["string", ["at", ["get", "route0_tensDigit"], ["get", ["get", "route0_role"], ["get", ["get", "route0_tier"], ["get", ["get", "route0_status"], ["literal", colors]]]]]],
      "line-offset": 0,
      "line-width": ["*", 1, defaultLineWidth]
    },
    filter: ['all', ["==", ["get", "route0_status"], "signed"], ["==", ["get", "route1_status"], "signed"], ["==", ["get", "route0_role"], "mainline"], ["==", ["get", "route1_role"], "mainline"]]
    },"triplex-interstates-2");
  
    map.addLayer({
    id: "duplex-interstates-1",
    type: "line",
    source: "interstatesSecondary",
    'source-layer': "duplex-interstates",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": ["string", ["at", ["get", "route1_tensDigit"], ["get", ["get", "route1_role"], ["get", ["get", "route1_tier"], ["get", ["get", "route1_status"], ["literal", colors]]]]]],
      "line-offset": ["*", 1, defaultLineWidth],
      "line-width": ["*", 1, defaultLineWidth]
    },
    filter: ['all', ["==", ["get", "route0_status"], "signed"], ["==", ["get", "route1_status"], "signed"], ["==", ["get", "route0_role"], "mainline"], ["==", ["get", "route1_role"], "mainline"]]
    },"duplex-interstates-0");

  ////////////////MAJOR INTERSTATES////////////////////////////////////////////////
      
  map.addLayer({
    id: 'i-90s-major',
    type: "line",
    source: "interstatesPrimary",
    'source-layer': "i-90s-major",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": colors.signed.major.mainline[9],
      "line-width": defaultLineWidth
    }
  },"duplex-interstates-1");  
  
  map.addLayer({
    id: "i-80s-major",
    type: "line",
    source: "interstatesPrimary",
    'source-layer': "i-80s-major",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": colors.signed.major.mainline[8],
      "line-width": defaultLineWidth
    }
  },"i-90s-major");
  
  map.addLayer({
    id: "i-70s-major",
    type: "line",
    source: "interstatesPrimary",
    'source-layer': "i-70s-major",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": colors.signed.major.mainline[7],
      "line-width": defaultLineWidth
    }
  },"i-80s-major");
  
   map.addLayer({
    id: "i-60s-major",
    type: "line",
    source: "interstatesPrimary",
    'source-layer': "i-60s-major",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": colors.signed.major.mainline[6],
      "line-width": defaultLineWidth
    }
  },"i-70s-major");
  
   map.addLayer({
    id: "i-50s-major",
    type: "line",
    source: "interstatesPrimary",
    'source-layer': "i-50s-major",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": colors.signed.major.mainline[5],
      "line-width": defaultLineWidth
    }
  },"i-60s-major");
  
  map.addLayer({
    id: "i-40s-major",
    type: "line",
    source: "interstatesPrimary",
    'source-layer': "i-40s-major",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": colors.signed.major.mainline[4],
      "line-width": defaultLineWidth
    }
  },"i-50s-major");
 
  map.addLayer({
    id: "i-30s-major",
    type: "line",
    source: "interstatesPrimary",
    'source-layer': "i-30s-major",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": colors.signed.major.mainline[3],
      "line-width": defaultLineWidth
    }
  },"i-40s-major");

  map.addLayer({
    id: "i-20s-major",
    type: "line",
    source: "interstatesPrimary",
    'source-layer': "i-20s-major",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": colors.signed.major.mainline[2],
      "line-width": defaultLineWidth
    }
  },"i-30s-major");

  map.addLayer({
    id: "i-10s-major",
    type: "line",
    source: "interstatesPrimary",
    'source-layer': "i-10s-major",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": colors.signed.major.mainline[1],
      "line-width": defaultLineWidth
    }
  },"i-20s-major");

  map.addLayer({
    id: "i-00s-major",
    type: "line",
    source: "interstatesPrimary",
    'source-layer': "i-00s-major",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": colors.signed.major.mainline[0],
      "line-width": defaultLineWidth
    }
  },"i-10s-major");

  ////////////////OTHER PRIMARY INTERSTATES////////////////////////////////////////////////
  
  map.addLayer({
    id: "i-90s-primary",
    type: "line",
    source: "interstatesPrimary",
    'source-layer': "i-90s-primary",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": colors.signed.primary.mainline[9],
      "line-width": defaultLineWidth
    }
  },"i-00s-major"); 

  map.addLayer({
    id: "i-80s-primary",
    type: "line",
    source: "interstatesPrimary",
    'source-layer': "i-80s-primary",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": colors.signed.primary.mainline[8],
      "line-width": defaultLineWidth
    }
  },"i-90s-primary");
  
  map.addLayer({
    id: "i-70s-primary",
    type: "line",
    source: "interstatesPrimary",
    'source-layer': "i-70s-primary",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": colors.signed.primary.mainline[7],
      "line-width": defaultLineWidth
    }
  },"i-80s-primary");

  map.addLayer({
    id: "i-60s-primary",
    type: "line",
    source: "interstatesPrimary",
    'source-layer': "i-60s-primary",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": colors.signed.primary.mainline[6],
      "line-width": defaultLineWidth
    }
  },"i-70s-primary");
  
  map.addLayer({
    id: "i-50s-primary",
    type: "line",
    source: "interstatesPrimary",
    'source-layer': "i-50s-primary",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": colors.signed.primary.mainline[5],
      "line-width": defaultLineWidth
    }
  },"i-60s-primary");
  
  map.addLayer({
    id: "i-40s-primary",
    type: "line",
    source: "interstatesPrimary",
    'source-layer': "i-40s-primary",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": colors.signed.primary.mainline[4],
      "line-width": defaultLineWidth
    }
  },"i-50s-primary");
  
  map.addLayer({
    id: "i-30s-primary",
    type: "line",
    source: "interstatesPrimary",
    'source-layer': "i-30s-primary",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": colors.signed.primary.mainline[3],
      "line-width": defaultLineWidth
    }
  },"i-40s-primary");
  
  map.addLayer({
    id: "i-20s-primary",
    type: "line",
    source: "interstatesPrimary",
    'source-layer': "i-20s-primary",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": colors.signed.primary.mainline[2],
      "line-width": defaultLineWidth
    }
  },"i-30s-primary");

  map.addLayer({
    id: "i-10s-primary",
    type: "line",
    source: "interstatesPrimary",
    'source-layer': "i-10s-primary",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": colors.signed.primary.mainline[1],
      "line-width": defaultLineWidth
    }
  },"i-20s-primary");

  map.addLayer({
    id: "i-00s-primary",
    type: "line",
    source: "interstatesPrimary",
    'source-layer': "i-00s-primary",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": colors.signed.primary.mainline[0],
      "line-width": defaultLineWidth
    }
  },"i-10s-primary");
  
  ////////////////AUXILIARY INTERSTATES////////////////////////////////////////////////
  
  map.addLayer({
    id: "auxiliary-interstates",
    type: "line",
    source: "interstatesSecondary",
    'source-layer': "auxiliary-interstates",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": ["string", ["at", ["get", "routeTensDigit"], ["get", "mainline", ["get", "auxiliary", ["get", "signed", ["literal", colors]]]]]],
      "line-width": defaultLineWidth
    }
  },"i-00s-primary");
  
  ////////////////UNSIGNED MAINLINE INTERSTATES////////////////////////////////////////////////
  
  map.addLayer({
    id: "unsigned-interstates",
    type: "line",
    source: "interstatesSecondary",
    'source-layer': "unsigned-interstates",
    layout: {
      "visibility": "none",
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": ["string", ["at", ["get", "routeTensDigit"], ["get", "mainline", ["get", ["get", "routeTier"], ["get", "signed", ["literal", colors]]]]]],
      "line-width": defaultLineWidth
    }
  },"auxiliary-interstates");

  ////////////////BUSINESS INTERSTATES//////////////////////////////////////////////// 
  
  map.addLayer({
    id: "business-interstates",
    type: "line",
    source: "interstatesSecondary",
    'source-layer': "business-interstates",
    layout: {
      "visibility": "none",
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": ["string", ["at", ["get", "routeTensDigit"], ["literal", businessColors]]],
      "line-width": defaultLineWidth
    }
  },"unsigned-interstates");

  map.addLayer({
    id: "unsigned-business-interstates",
    type: "line",
    source: "interstatesSecondary",
    'source-layer': "unsigned-business-interstates",
    layout: {
      "visibility": "none",
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": ["string", ["at", ["get", "routeTensDigit"], ["literal", businessColors]]],
      "line-width": defaultLineWidth
    }
  },"business-interstates");  
  
  ////////////////FUTURE INTERSTATES//////////////////////////////////////////////// 
  
  map.addLayer({
    id: "future-interstates",
    type: "line",
    source: "interstatesSecondary",
    'source-layer': "future-interstates",
    layout: {
      "visibility": "none",
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": ["string", ["at", ["get", "routeTensDigit"], ["literal", futureColors]]],
      "line-width": ["*", 1, defaultLineWidth]
    }
  },"unsigned-business-interstates");
   
});

///////////////////FILTERS///////////////////////////

///////////////////Add checkboxes to the DOM//////////////////////////////////////////

let filterList = [
  {'id': 'major-layers', 'name': "Major Primary Routes",'group': '#filter-group-type .col1', 'checked': true},
  {'id': 'primary-layers', 'name': "Other Primary Routes",'group': '#filter-group-type .col1', 'checked': true},
  {'id': 'auxiliary-layers', 'name': "Auxiliary Routes",'group': '#filter-group-type .col1', 'checked': true},
  {'id': 'business-layers', 'name': "Business Routes",'group': '#filter-group-type .col2', 'checked': false},
  {'id': 'unsigned-layers', 'name': "Unsigned Routes",'group': '#filter-group-type .col2', 'checked': false},
  {'id': 'future-layers', 'name': "Future Routes",'group': '#filter-group-type .col2', 'checked': false},
  {'id': 'even-routes', 'name': "Even Route Numbers",'group': '#filter-group-number .row1', 'checked': true},
  {'id': 'odd-routes', 'name': "Odd Route Numbers",'group': '#filter-group-number .row1', 'checked': true}
]
let filterGroup
let formGroup
let input
let label

for (i = 0; i < filterList.length; i++){
  filterGroup = document.querySelector(filterList[i].group);
  formGroup = document.createElement('div');
  input = document.createElement('input');
  label = document.createElement('label');
  formGroup.classList.add("form-group");
  input.type = 'checkbox';
  input.checked = filterList[i].checked;  
  input.id = filterList[i].id;
  label.setAttribute('for', filterList[i].id);
  label.textContent = filterList[i].name;
  filterGroup.appendChild(formGroup);
  formGroup.appendChild(input);
  formGroup.appendChild(label);
}

for (j = 0; j < 10; j++) {
  formGroup = document.createElement('div');
  formGroup.classList.add("form-group");
  input = document.createElement('input');
  label = document.createElement('label');
  input.type = 'checkbox';
  input.checked = true;  
  input.id = "routes-" + j + "0";
  label.setAttribute('for', "routes-" + j + "0");
  label.textContent = j + "0s";
  document.querySelector('#filter-group-number .row2').appendChild(formGroup);
  formGroup.appendChild(input);
  formGroup.appendChild(label);
}

/////////////////////Filter functions//////////////////////////////////////////
let evenFilter = ['==', 'routeOnesDigit', "even"]
let oddFilter = ['==', 'routeOnesDigit', "odd"]
let tensFilters = []
for (let i = 0; i < 10; i++) {
  tensFilters.push(eval("[\'==\', \'routeTensDigit\', " + i +"]"))
}
  
function setMajorFilter() {
  
  let filters = ['all', ['any']]
  
  //If the Major Routes checkbox is unchecked, don't bother with filtering by numbers
  if (!document.getElementById("major-layers").checked) { 
    
    for (let i = 0; i < 10; i++) {
      map.setLayoutProperty( "i-" + i + "0s-major", 'visibility', 'none' );
    }
  }
  
  else {   
    for (let i = 0; i < 10; i++) {
      if (!document.getElementById("routes-" + i + "0").checked) {
        map.setLayoutProperty( "i-" + i + "0s-major", 'visibility', 'none' );
      }
      else {
        map.setLayoutProperty( "i-" + i + "0s-major", 'visibility', 'visible' );
   
        if (document.getElementById("even-routes").checked) {   
          filters[1].push(evenFilter)
        }
        if (document.getElementById("odd-routes").checked) {   
          filters[1].push(oddFilter)
        }
        map.setFilter("i-" + i + "0s-major", filters);
      }
    }
  }
}

function setPrimaryFilter() {
  let filters = ['all', ['any']]
  
  //If the Major Routes checkbox is unchecked, don't bother with filtering by numbers
  if (!document.getElementById("primary-layers").checked) { 
    
    for (let i = 0; i < 10; i++) {
      map.setLayoutProperty( "i-" + i + "0s-primary", 'visibility', 'none' );
    }
  }
  
  else {
    
    for (let i = 0; i < 10; i++) {
      if (!document.getElementById("routes-" + i + "0").checked) {
        map.setLayoutProperty( "i-" + i + "0s-primary", 'visibility', 'none' );
      }
      else {
        map.setLayoutProperty( "i-" + i + "0s-primary", 'visibility', 'visible' );
   
        if (document.getElementById("even-routes").checked) {   
          filters[1].push(evenFilter)
        }
        if (document.getElementById("odd-routes").checked) {   
          filters[1].push(oddFilter)
        }
        map.setFilter("i-" + i + "0s-primary", filters);
      }
    }
  }
}

function setAuxiliaryFilter() {
  
  let filters = ['all',['any'],['any']]
  
  if (!document.getElementById("auxiliary-layers").checked) { 
    map.setLayoutProperty( "auxiliary-interstates", 'visibility', 'none' )
  }
  
  else {
  
    map.setLayoutProperty( "auxiliary-interstates", 'visibility', 'visible' )
    
    if (document.getElementById("even-routes").checked) {   
      filters[1].push(evenFilter)
    }
    if (document.getElementById("odd-routes").checked) {   
      filters[1].push(oddFilter)
    }
    for (let j = 0; j < 10; j++) {
      if (document.getElementById("routes-" + j + "0").checked) {   
        filters[2].push(tensFilters[j])
      }
    }
  }
  map.setFilter("auxiliary-interstates", filters);
}

function setBusinessFilter() {
  
  let filters = ['all',['any'],['any']]
  
  if (!document.getElementById('business-layers').checked) { 
    
    //Remove Business Routes from Color Key if the layer is inactive
    let busKeyCol = document.querySelectorAll('th.business, td.business')
    for (i = 0; i < busKeyCol.length; i++) {   
      busKeyCol[i].classList.add('hidden')
    }
    
    map.setLayoutProperty( "business-interstates", 'visibility', 'none' )
  }
  
  else {
    
    //Add Business Routes to Color Key if the layer is active
    let busKeyCol = document.querySelectorAll('th.business, td.business')
      for (i = 0; i < busKeyCol.length; i++) {   
        busKeyCol[i].classList.remove('hidden')
      }
    
    map.setLayoutProperty( "business-interstates", 'visibility', 'visible' )
    
    if (document.getElementById("even-routes").checked) {   
      filters[1].push(evenFilter)
    }
    if (document.getElementById("odd-routes").checked) {   
      filters[1].push(oddFilter)
    }
    for (let j = 0; j < 10; j++) {
      if (document.getElementById("routes-" + j + "0").checked) {   
        filters[2].push(tensFilters[j])
      }
    }
  }
  map.setFilter("business-interstates", filters);
}
 
function setUnsignedFilter() {
  
  let filters = ['all',['any'],['any']]
  
  if (!document.getElementById("unsigned-layers").checked) { 
    map.setLayoutProperty( "unsigned-interstates", 'visibility', 'none' )
    map.setLayoutProperty( "shields-unsigned", 'visibility', 'none' )
  }
  
  else {
  
    map.setLayoutProperty( "unsigned-interstates", 'visibility', 'visible' )
    map.setLayoutProperty( "shields-unsigned", 'visibility', 'visible' )
    
    if (document.getElementById("even-routes").checked) {   
      filters[1].push(evenFilter)
    }
    if (document.getElementById("odd-routes").checked) {   
      filters[1].push(oddFilter)
    }
    for (let j = 0; j < 10; j++) {
      if (document.getElementById("routes-" + j + "0").checked) {   
        filters[2].push(tensFilters[j])
      }
    }
  }
  map.setFilter("unsigned-interstates", filters);
}

function setUnsignedBusinessFilter() {
  
  let filters = ['all',['any'],['any']]
  
  if (!document.getElementById('business-layers').checked || !document.getElementById("unsigned-layers").checked) { 
    map.setLayoutProperty( "unsigned-business-interstates", 'visibility', 'none' )
    map.setLayoutProperty( "shields-business-unsigned", 'visibility', 'none' )
  }
  
  else {
  
    map.setLayoutProperty( "unsigned-business-interstates", 'visibility', 'visible' )
    map.setLayoutProperty( "shields-business-unsigned", 'visibility', 'visible' )
    
    if (document.getElementById("even-routes").checked) {   
      filters[1].push(evenFilter)
    }
    if (document.getElementById("odd-routes").checked) {   
      filters[1].push(oddFilter)
    }
    for (let j = 0; j < 10; j++) {
      if (document.getElementById("routes-" + j + "0").checked) {   
        filters[2].push(tensFilters[j])
      }
    }
  }
  map.setFilter("unsigned-business-interstates", filters);
}

function setFutureFilter() {
  let filters = ['all',['any'],['any']]
  
  if (!document.getElementById("future-layers").checked) { 
    
    //Remove Future Routes from Color Key if the layer is inactive
    let futKeyCol = document.querySelectorAll('th.future, td.future')
    for (i = 0; i < futKeyCol.length; i++) {   
      futKeyCol[i].classList.add('hidden')
    }
    
    map.setLayoutProperty( "future-interstates", 'visibility', 'none' )
    map.setLayoutProperty( "shields-future", 'visibility', 'none' )
  }
  
  else {

    //Add Future Routes to Color Key if the layer is active
    let futKeyCol = document.querySelectorAll('th.future, td.future')
      for (i = 0; i < futKeyCol.length; i++) {   
        futKeyCol[i].classList.remove('hidden')
      }
    map.setLayoutProperty( "future-interstates", 'visibility', 'visible' )
    map.setLayoutProperty( "shields-future", 'visibility', 'visible' )
    
    if (document.getElementById("even-routes").checked) {   
      filters[1].push(evenFilter)
    }
    if (document.getElementById("odd-routes").checked) {   
      filters[1].push(oddFilter)
    }
    for (let j = 0; j < 10; j++) {
      if (document.getElementById("routes-" + j + "0").checked) {   
        filters[2].push(tensFilters[j])
      }
    }
  }
  map.setFilter("future-interstates", filters);
}

function setTriplexFilter() {
  let signFilter = [['==', 'route0_status', "unsigned"], ['==', 'route1_status', "unsigned"], ['==', 'route2_status', "unsigned"]]
  let futureFilter = [['==', 'route0_status', "future"], ['==', 'route1_status', "future"], ['==', 'route2_status', "future"]]
  let businessFilter = [['==', 'route0_role', "business"], ['==', 'route1_role', "business"], ['==', 'route2_role', "business"]]
  let majorFilter = [['==', 'route0_tier', "major"], ['==', 'route1_tier', "major"], ['==', 'route2_tier', "major"]]
  let primaryFilter = [['==', 'route0_tier', "primary"], ['==', 'route1_tier', "primary"], ['==', 'route2_tier', "primary"]]
  let auxiliaryFilter = [['==', 'route0_tier', "auxiliary"], ['==', 'route1_tier', "auxiliary"], ['==', 'route2_tier', "auxiliary"]]
  let evenFilter = [['==', 'route0_onesDigit', "even"], ['==', 'route1_onesDigit', "even"], ['==', 'route2_onesDigit', "even"]]
  let oddFilter = [['==', 'route0_onesDigit', "odd"], ['==', 'route1_onesDigit', "odd"], ['==', 'route2_onesDigit', "odd"]]
  let tensFilters = [
    [['==', 'route0_tensDigit', 0], ['==', 'route1_tensDigit', 0], ['==', 'route2_tensDigit', 0]],
    [['==', 'route0_tensDigit', 1], ['==', 'route1_tensDigit', 1], ['==', 'route2_tensDigit', 1]],
    [['==', 'route0_tensDigit', 2], ['==', 'route1_tensDigit', 2], ['==', 'route2_tensDigit', 2]],
    [['==', 'route0_tensDigit', 3], ['==', 'route1_tensDigit', 3], ['==', 'route2_tensDigit', 3]],
    [['==', 'route0_tensDigit', 4], ['==', 'route1_tensDigit', 4], ['==', 'route2_tensDigit', 4]],
    [['==', 'route0_tensDigit', 5], ['==', 'route1_tensDigit', 5], ['==', 'route2_tensDigit', 5]],
    [['==', 'route0_tensDigit', 6], ['==', 'route1_tensDigit', 6], ['==', 'route2_tensDigit', 6]],
    [['==', 'route0_tensDigit', 7], ['==', 'route1_tensDigit', 7], ['==', 'route2_tensDigit', 7]],
    [['==', 'route0_tensDigit', 8], ['==', 'route1_tensDigit', 8], ['==', 'route2_tensDigit', 8]],
    [['==', 'route0_tensDigit', 9], ['==', 'route1_tensDigit', 9], ['==', 'route2_tensDigit', 9]]
  ]
  let filters = ['all', ['any']]
  
  if (document.getElementById("unsigned-layers").checked) {
    signFilter.splice(0, 0, 'any')
    filters[filters.length - 1].push(signFilter)
  }
  else {
    signFilter.splice(0, 0, 'none')
    filters.splice(filters.length - 1, 0, signFilter)
  }
  
  if (document.getElementById("future-layers").checked) {
    futureFilter.splice(0, 0, 'any')
    filters[filters.length - 1].push(futureFilter)
  }
  else {
    futureFilter.splice(0, 0, 'none')
    filters.splice(filters.length - 1, 0, futureFilter)
  }  
  
  if (document.getElementById("business-layers").checked) {
    businessFilter.splice(0, 0, 'any')
    filters[filters.length - 1].push(businessFilter)
  }
  else {
    businessFilter.splice(0, 0, 'none')
    filters.splice(filters.length - 1, 0, businessFilter)
  }

  if (document.getElementById("major-layers").checked) {
    majorFilter.splice(0, 0, 'any')
    filters[filters.length - 1].push(majorFilter)
  }
  else {
    majorFilter.splice(0, 0, 'none')
    filters.splice(filters.length - 1, 0, majorFilter)
  }
  
  if (document.getElementById("primary-layers").checked) {
    primaryFilter.splice(0, 0, 'any')
    filters[filters.length - 1].push(primaryFilter)
  }
  else {
    primaryFilter.splice(0, 0, 'none')
    filters.splice(filters.length - 1, 0, primaryFilter)
  }

  if (document.getElementById("auxiliary-layers").checked) {
    auxiliaryFilter.splice(0, 0, 'any')
    filters[filters.length - 1].push(auxiliaryFilter)
  }
  else {
    auxiliaryFilter.splice(0, 0, 'none')
    filters.splice(filters.length - 1, 0, auxiliaryFilter)
  }
  
  if (document.getElementById("even-routes").checked) {
    evenFilter.splice(0, 0, 'any')
    filters[filters.length - 1].push(evenFilter)
  }
  else {
    evenFilter.splice(0, 0, 'none')
    filters.splice(filters.length - 1, 0, evenFilter)
  }
  
  if (document.getElementById("odd-routes").checked) {
    oddFilter.splice(0, 0, 'any')
    filters[filters.length - 1].push(oddFilter)
  }
  else {
    oddFilter.splice(0, 0, 'none')
    filters.splice(filters.length - 1, 0, oddFilter)
  }
  
  for (let i = 0; i < 10; i++) {
    if (document.getElementById("routes-" + i + "0").checked) {
      tensFilters[i].splice(0, 0, 'any')
      filters[filters.length - 1].push(tensFilters[i])
    }
    else {
      tensFilters[i].splice(0, 0, 'none')
      filters.splice(filters.length - 1, 0, tensFilters[i])
    }
  }
  
  map.setFilter("triplex-interstates-0", filters);
  map.setFilter("triplex-interstates-1", filters);
  map.setFilter("triplex-interstates-2", filters);
}

function setDuplexFilter() {
  let signFilter = [['==', 'route0_status', "unsigned"], ['==', 'route1_status', "unsigned"]]
  let futureFilter = [['==', 'route0_status', "future"], ['==', 'route1_status', "future"]]
  let businessFilter = [['==', 'route0_role', "business"], ['==', 'route1_role', "business"]]
  let majorFilter = [['==', 'route0_tier', "major"], ['==', 'route1_tier', "major"]]
  let primaryFilter = [['==', 'route0_tier', "primary"], ['==', 'route1_tier', "primary"]]
  let auxiliaryFilter = [['==', 'route0_tier', "auxiliary"], ['==', 'route1_tier', "auxiliary"]]
  let evenFilter = [['==', 'route0_onesDigit', "even"], ['==', 'route1_onesDigit', "even"]]
  let oddFilter = [['==', 'route0_onesDigit', "odd"], ['==', 'route1_onesDigit', "odd"]]
  let tensFilters = [
    [['==', 'route0_tensDigit', 0], ['==', 'route1_tensDigit', 0]],
    [['==', 'route0_tensDigit', 1], ['==', 'route1_tensDigit', 1]],
    [['==', 'route0_tensDigit', 2], ['==', 'route1_tensDigit', 2]],
    [['==', 'route0_tensDigit', 3], ['==', 'route1_tensDigit', 3]],
    [['==', 'route0_tensDigit', 4], ['==', 'route1_tensDigit', 4]],
    [['==', 'route0_tensDigit', 5], ['==', 'route1_tensDigit', 5]],
    [['==', 'route0_tensDigit', 6], ['==', 'route1_tensDigit', 6]],
    [['==', 'route0_tensDigit', 7], ['==', 'route1_tensDigit', 7]],
    [['==', 'route0_tensDigit', 8], ['==', 'route1_tensDigit', 8]],
    [['==', 'route0_tensDigit', 9], ['==', 'route1_tensDigit', 9]]
  ]
  let filters = ['all', ['any']]
  //If "unsigned" checkbox is checked, show every route with at least one
  //unsigned route unless it violates some other condition
  if (document.getElementById("unsigned-layers").checked) {
    signFilter.splice(0, 0, 'any')
    filters[filters.length - 1].push(signFilter)
  }
  //If "unsigned" checkbox is unchecked, add "has no unsigned routes"
  //to the list of criteria that all features MUST have to be shown
  else {
    signFilter.splice(0, 0, 'none')
    filters.splice(filters.length - 1, 0, signFilter)
  }
  
  if (document.getElementById("future-layers").checked) {
    futureFilter.splice(0, 0, 'any')
    filters[filters.length - 1].push(futureFilter)
  }
  else {
    futureFilter.splice(0, 0, 'none')
    filters.splice(filters.length - 1, 0, futureFilter)
  }  
  
  if (document.getElementById("business-layers").checked) {
    businessFilter.splice(0, 0, 'any')
    filters[filters.length - 1].push(businessFilter)
  }
  else {
    businessFilter.splice(0, 0, 'none')
    filters.splice(filters.length - 1, 0, businessFilter)
  }

  if (document.getElementById("major-layers").checked) {
    majorFilter.splice(0, 0, 'any')
    filters[filters.length - 1].push(majorFilter)
  }
  else {
    majorFilter.splice(0, 0, 'none')
    filters.splice(filters.length - 1, 0, majorFilter)
  }
  
  if (document.getElementById("primary-layers").checked) {
    primaryFilter.splice(0, 0, 'any')
    filters[filters.length - 1].push(primaryFilter)
  }
  else {
    primaryFilter.splice(0, 0, 'none')
    filters.splice(filters.length - 1, 0, primaryFilter)
  }

  if (document.getElementById("auxiliary-layers").checked) {
    auxiliaryFilter.splice(0, 0, 'any')
    filters[filters.length - 1].push(auxiliaryFilter)
  }
  else {
    auxiliaryFilter.splice(0, 0, 'none')
    filters.splice(filters.length - 1, 0, auxiliaryFilter)
  }
  
  if (document.getElementById("even-routes").checked) {
    evenFilter.splice(0, 0, 'any')
    filters[filters.length - 1].push(evenFilter)
  }
  else {
    evenFilter.splice(0, 0, 'none')
    filters.splice(filters.length - 1, 0, evenFilter)
  }
  
  if (document.getElementById("odd-routes").checked) {
    oddFilter.splice(0, 0, 'any')
    filters[filters.length - 1].push(oddFilter)
  }
  else {
    oddFilter.splice(0, 0, 'none')
    filters.splice(filters.length - 1, 0, oddFilter)
  }
  
  for (let i = 0; i < 10; i++) {
    if (document.getElementById("routes-" + i + "0").checked) {
      tensFilters[i].splice(0, 0, 'any')
      filters[filters.length - 1].push(tensFilters[i])
    }
    else {
      tensFilters[i].splice(0, 0, 'none')
      filters.splice(filters.length - 1, 0, tensFilters[i])
    }
  }
  
  map.setFilter("duplex-interstates-0", filters)
  map.setFilter("duplex-interstates-1", filters)
}

function setAllFilters() {
  setMajorFilter();
  setPrimaryFilter();
  setAuxiliaryFilter();
  setBusinessFilter();
  setUnsignedFilter();
  setUnsignedBusinessFilter();
  setFutureFilter();
  setDuplexFilter();
  setTriplexFilter();
}

////////////////Add event listeners to each checkbox to turn layers on and off when selected directly////////////

document.getElementById("major-layers").addEventListener('change', function (e) {
  setMajorFilter();
  setTriplexFilter();
  setDuplexFilter();
});

document.getElementById("primary-layers").addEventListener('change', function (e) {
  setPrimaryFilter();
  setTriplexFilter();
  setDuplexFilter();
});

document.getElementById("auxiliary-layers").addEventListener('change', function (e) {
  setAuxiliaryFilter();
  setTriplexFilter();
  setDuplexFilter();
});

document.getElementById("business-layers").addEventListener('change', function (e) {
  setBusinessFilter();
  setUnsignedBusinessFilter();
  setTriplexFilter();
  setDuplexFilter();
});

document.getElementById("future-layers").addEventListener('change', function (e) {
  setFutureFilter();
  setTriplexFilter();
  setDuplexFilter();
});

document.getElementById("unsigned-layers").addEventListener('change', function (e) {
  setUnsignedFilter();
  setUnsignedBusinessFilter();
  setTriplexFilter();
  setDuplexFilter();
});

document.getElementById("even-routes").addEventListener('change', function (e) {
  setAllFilters()
});

document.getElementById("odd-routes").addEventListener('change', function (e) {
  setAllFilters()
});

//Add event listeners for each tensDigit filter (00s, 10s, 20s, etc.)
for (let i = 0; i < 10; i++) {
  document.getElementById("routes-" + i + "0").addEventListener('change', function (e) {
    setAllFilters();
  });
}

///////////////Select or deselect all layers//////////////////////////////////////////

document.getElementById("select-types").addEventListener("click", function() { 
  var ele = document.querySelectorAll('#filter-group-type input');  
  for (var i = 0; i < ele.length; i++){  
    if (ele[i].type=='checkbox')  
      ele[i].checked=true;  
  }
  setAllFilters();
});

document.getElementById("deselect-types").addEventListener("click", function() { 
  var ele = document.querySelectorAll('#filter-group-type input');
  for (var i=0; i<ele.length; i++){  
    if (ele[i].type=='checkbox')  
      ele[i].checked=false;  
  }
  setAllFilters();
});

document.getElementById("select-numbers").addEventListener("click", function() { 
  var ele = document.querySelectorAll('#filter-group-number input');  
  for (var i = 0; i < ele.length; i++){  
    if (ele[i].type=='checkbox')  
      ele[i].checked=true;  
  }
  setAllFilters();
});

document.getElementById("deselect-numbers").addEventListener("click", function() { 
  var ele = document.querySelectorAll('#filter-group-number input');  
  for (var i=0; i<ele.length; i++){  
    if (ele[i].type=='checkbox')  
      ele[i].checked=false;  
  }
  setAllFilters();
});

////////////////////////////////INTERSTATE FACTS/////////////////////////////////

const zoomAreas = [
  {'target': 'i2', 'coordinates': [[-98.58, 26.04], [-97.62, 26.36]], 'type': ['primary-layers'], 'tensDigit': ['routes-00'], 'onesDigit': ['even-routes']},
  {'target': 'i4', 'coordinates': [[-82.8, 27.82], [-80.88, 29.41]], 'type': ['primary-layers'], 'tensDigit': ['routes-00'], 'onesDigit': ['even-routes']},
  {'target': 'i10', 'coordinates': [[-122, 26], [-78, 36]], 'type': ['major-layers'], 'tensDigit': ['routes-10'], 'onesDigit': ['even-routes']},
  {'target': 'i11', 'coordinates': [[-115.14, 35.88], [-114.65, 36.12]], 'type': ['major-layers'], 'tensDigit': ['routes-10'], 'onesDigit': ['even-routes']},
  {'target': 'i12', 'coordinates': [[-91.6, 30.15], [-89.46, 30.62]], 'type': ['primary-layers'], 'tensDigit': ['routes-10'], 'onesDigit': ['even-routes']},
  {'target': 'i14', 'coordinates': [[-98.04, 30.99], [-97.32, 31.19]], 'type': ['primary-layers'], 'tensDigit': ['routes-10'], 'onesDigit': ['even-routes']},
  {'target': 'i16', 'coordinates': [[-84.54, 31.65], [-80.63, 33.25]], 'type': ['primary-layers'], 'tensDigit': ['routes-10'], 'onesDigit': ['even-routes']},
  {'target': 'i17', 'coordinates': [[-113, 33.2], [-111.09, 35.53]], 'type': ['primary-layers'], 'tensDigit': ['routes-10'], 'onesDigit': ['odd-routes']},
  {'target': 'i19', 'coordinates': [[-111.39, 31.25], [-110.73, 32.34]], 'type': ['primary-layers'], 'tensDigit': ['routes-10'], 'onesDigit': ['odd-routes']},
  {'target': 'i27', 'coordinates': [[-102.78, 33.17], [-101.29, 35.64]], 'type': ['primary-layers'], 'tensDigit': ['routes-20'], 'onesDigit': ['odd-routes']},
  {'target': 'i37', 'coordinates': [[-99.4, 27.54], [-97.1, 29.94]], 'type': ['primary-layers'], 'tensDigit': ['routes-30'], 'onesDigit': ['odd-routes']},
  {'target': 'i40', 'coordinates': [[-120, 31], [-75, 38]], 'type': ['major-layers'], 'tensDigit': ['routes-40'], 'onesDigit': ['even-routes']},
  {'target': 'i43', 'coordinates': [[-89.92, 42.11], [-87.09, 44.96]], 'type': ['primary-layers'], 'tensDigit': ['routes-40'], 'onesDigit': ['odd-routes']},
  {'target': 'i45', 'coordinates': [[-98.36, 28.65], [-94.19, 33.61]], 'type': ['primary-layers'], 'tensDigit': ['routes-40'], 'onesDigit': ['odd-routes']},
  {'target': 'i66', 'coordinates': [[-78.8, 38.7], [-76.86, 39.12]], 'type': ['primary-layers'], 'tensDigit': ['routes-60'], 'onesDigit': ['even-routes']},
  {'target': 'i70', 'coordinates': [[-115, 35], [-73, 43]], 'type': ['major-layers'], 'tensDigit': ['routes-70'], 'onesDigit': ['even-routes']},
  {'target': 'i73', 'coordinates': [[-80.49, 34.68], [-79.49, 36.62]], 'type': ['primary-layers'], 'tensDigit': ['routes-70'], 'onesDigit': ['odd-routes']},
  {'target': 'i76w', 'coordinates': [[-105.68, 39.43], [-101.94, 41.51]], 'type': ['primary-layers'], 'tensDigit': ['routes-70'], 'onesDigit': ['even-routes']},
  {'target': 'i76e', 'coordinates': [[-82.5, 39.38], [-74.5, 41.92]], 'type': ['primary-layers'], 'tensDigit': ['routes-70'], 'onesDigit': ['even-routes']},
  {'target': 'i80', 'coordinates': [[-129, 35], [-69, 46]], 'type': ['major-layers'], 'tensDigit': ['routes-80'], 'onesDigit': ['even-routes']},
  {'target': 'i84w', 'coordinates': [[-124.42, 46.7], [-110.75, 40.26]], 'type': ['primary-layers'], 'tensDigit': ['routes-80'], 'onesDigit': ['even-routes']},
  {'target': 'i84e', 'coordinates': [[-76.01, 41.21], [-71.7, 42.39]], 'type': ['primary-layers'], 'tensDigit': ['routes-80'], 'onesDigit': ['even-routes']},
  {'target': 'i86w', 'coordinates': [[-113.73, 42.46], [-112.25, 43.05]], 'type': ['primary-layers'], 'tensDigit': ['routes-80'], 'onesDigit': ['even-routes']},
  {'target': 'i86e', 'coordinates': [[-81.5, 41], [-73.5, 43]], 'type': ['primary-layers'], 'tensDigit': ['routes-80'], 'onesDigit': ['even-routes']},
  {'target': 'i87n', 'coordinates': [[-75.81, 40.54], [-72.59, 45.45]], 'type': ['primary-layers'], 'tensDigit': ['routes-80'], 'onesDigit': ['odd-routes']},
  {'target': 'i87s', 'coordinates': [[-78.78, 35.67], [-78.29, 35.93]], 'type': ['primary-layers'], 'tensDigit': ['routes-80'], 'onesDigit': ['odd-routes']},
  {'target': 'i88w', 'coordinates': [[-91.23, 41.08], [-87.36, 42.4]], 'type': ['primary-layers'], 'tensDigit': ['routes-80'], 'onesDigit': ['even-routes']},
  {'target': 'i88e', 'coordinates': [[-76.73, 41.78], [-73.37, 43.28]], 'type': ['primary-layers'], 'tensDigit': ['routes-80'], 'onesDigit': ['even-routes']},
  {'target': 'i90', 'coordinates': [[-128, 40], [-67, 48]], 'type': ['major-layers'], 'tensDigit': ['routes-90'], 'onesDigit': ['even-routes']},
  {'target': 'i95', 'coordinates': [[-85, 25], [-68, 47]], 'type': ['major-layers'], 'tensDigit': ['routes-90'], 'onesDigit': ['odd-routes']},
  {'target': 'i96', 'coordinates': [[-87.12, 41.8], [-82.35, 43.63]], 'type': ['primary-layers'], 'tensDigit': ['routes-90'], 'onesDigit': ['even-routes']},
  {'target': 'i97', 'coordinates': [[-76.7, 38.95], [-76.5, 39.25]], 'type': ['primary-layers'], 'tensDigit': ['routes-90'], 'onesDigit': ['odd-routes']},
  {'target': 'i99', 'coordinates': [[-79.5, 40], [-76.9, 42.34]], 'type': ['primary-layers'], 'tensDigit': ['routes-90'], 'onesDigit': ['odd-routes']},
  {'target': 'i105ca', 'coordinates': [[-118.57, 33.84], [-118.04, 34.01]], 'type': ['auxiliary-layers'], 'tensDigit': ['routes-00'], 'onesDigit': ['odd-routes']},
  {'target': 'i105or', 'coordinates': [[-123.13, 44.04], [-123.03, 44.08]], 'type': ['auxiliary-layers'], 'tensDigit': ['routes-00'], 'onesDigit': ['odd-routes']},
  {'target': 'i110tx', 'coordinates': [[-106.46, 31.76], [-106.44, 31.78]], 'type': ['auxiliary-layers'], 'tensDigit': ['routes-10'], 'onesDigit': ['even-routes']},
  {'target': 'i124tn', 'coordinates': [[-85.34, 35.03], [-85.31, 35.06]], 'type': ['unsigned-layers'], 'tensDigit': ['routes-20'], 'onesDigit': ['even-routes']},
  {'target': 'i194nd', 'coordinates': [[-100.86, 46.8], [-100.81, 46.83]], 'type': ['auxiliary-layers'], 'tensDigit': ['routes-90'], 'onesDigit': ['even-routes']},
  {'target': 'i238ca', 'coordinates': [[-122.22, 37.65], [-122.04, 37.74]], 'type': ['auxiliary-layers'], 'tensDigit': ['routes-30'], 'onesDigit': ['even-routes']},
  {'target': 'i270oh', 'coordinates': [[-83.24, 39.86], [-82.84, 40.17]], 'type': ['auxiliary-layers'], 'tensDigit': ['routes-70'], 'onesDigit': ['even-routes']},
  {'target': 'i295fl', 'coordinates': [[-81.89, 30.14], [-81.48, 30.54]], 'type': ['auxiliary-layers'], 'tensDigit': ['routes-90'], 'onesDigit': ['odd-routes']},
  {'target': 'i296mi', 'coordinates': [[-85.71, 42.97], [-85.66, 43.02]], 'type': ['unsigned-layers'], 'tensDigit': ['routes-90'], 'onesDigit': ['even-routes']},
  {'target': 'i305ca', 'coordinates': [[-121.61, 38.55], [-121.45, 38.6]], 'type': ['unsigned-layers'], 'tensDigit': ['routes-00'], 'onesDigit': ['odd-routes']},
  {'target': 'i315mt', 'coordinates': [[-111.38, 47.475], [-111.3, 47.5]], 'type': ['unsigned-layers'], 'tensDigit': ['routes-10'], 'onesDigit': ['odd-routes']},
  {'target': 'i345tx', 'coordinates': [[-96.81, 32.77], [-96.77, 32.805]], 'type': ['unsigned-layers'], 'tensDigit': ['routes-40'], 'onesDigit': ['odd-routes']},
  {'target': 'i444ok', 'coordinates': [[-96.03, 36.135], [-95.96, 36.17]], 'type': ['unsigned-layers'], 'tensDigit': ['routes-40'], 'onesDigit': ['even-routes']},
  {'target': 'i478ny', 'coordinates': [[-74.04, 40.67], [-73.99, 40.72]], 'type': ['unsigned-layers'], 'tensDigit': ['routes-70'], 'onesDigit': ['even-routes']},
  {'target': 'i485nc', 'coordinates': [[-81.09, 35.05], [-80.61, 35.44]], 'type': ['auxiliary-layers'], 'tensDigit': ['routes-80'], 'onesDigit': ['odd-routes']},
  {'target': 'i495me', 'coordinates': [[-70.34, 43.71], [-70.21, 43.75]], 'type': ['unsigned-layers'], 'tensDigit': ['routes-90'], 'onesDigit': ['odd-routes']},
  {'target': 'i555ar', 'coordinates': [[-90.92, 35.36], [-90.18, 35.91]], 'type': ['auxiliary-layers'], 'tensDigit': ['routes-50'], 'onesDigit': ['odd-routes']},
  {'target': 'i595md', 'coordinates': [[-76.95, 38.89], [-76.46, 39.08]], 'type': ['unsigned-layers'], 'tensDigit': ['routes-90'], 'onesDigit': ['odd-routes']},
  {'target': 'i610tx', 'coordinates': [[-95.52, 29.67], [-95.26, 29.85]], 'type': ['auxiliary-layers'], 'tensDigit': ['routes-10'], 'onesDigit': ['even-routes']},
  {'target': 'i878ny', 'coordinates': [[-73.81, 40.66], [-73.78, 40.67]], 'type': ['unsigned-layers'], 'tensDigit': ['routes-70'], 'onesDigit': ['even-routes']},
  {'target': 'i910la', 'coordinates': [[-90.21, 29.87], [-89.98, 29.99]], 'type': ['unsigned-layers'], 'tensDigit': ['routes-10'], 'onesDigit': ['even-routes']},
  {'target': 'i990ny', 'coordinates': [[-78.85, 42.99], [-78.7, 43.07]], 'type': ['auxiliary-layers'], 'tensDigit': ['routes-90'], 'onesDigit': ['even-routes']},
  {'target': 'i39-i90-i94', 'coordinates': [[-90.24, 42.2], [-89.1, 43.85]], 'type': ['major-layers','primary-layers'], 'tensDigit': ['routes-30', 'routes-90'], 'onesDigit': ['even-routes', 'odd-routes']},
  {'target': 'dover', 'coordinates': [[-76.37, 38.85], [-74.91, 39.64]]},
  {'target': 'jefferson-city', 'coordinates': [[-92.86, 38.27], [-91.67, 39.05]]},
  {'target': 'pierre', 'coordinates': [[-101.32, 43.89], [-99.53, 44.89]]},
  {'target': 'california', 'coordinates': [[-128.16, 31.01], [-111.66, 43.59]]},
  {'target': 'illinois', 'coordinates': [[-92.45, 36.78], [-86.43, 43.17]]},
  {'target': 'new-york', 'coordinates': [[-80.91, 40.66], [-72.03, 45.61]]},
  {'target': 'ohio', 'coordinates': [[-85.82, 38.53], [-80.24, 42.63]]},
  {'target': 'pennsylvania', 'coordinates': [[-81.59, 39.57], [-74.5, 42.53]]},
  {'target': 'texas', 'coordinates': [[-109.23, 24.43], [-93.01, 38.46]]}
]

let targetClass

for (i = 0; i < zoomAreas.length; i++) {
  targetClass = document.getElementsByClassName(zoomAreas[i].target)  
  for (j = 0; j < targetClass.length; j++){
    let zoomArea = zoomAreas[i]
    targetClass[j].addEventListener("click", function() {      
      
      //Activate relevant layers if hidden
      if (zoomArea.type) {
        for (k = 0; k < zoomArea.type.length; k++) {
          let zoomLayer = zoomArea.type[k]
          document.querySelector('#' + zoomLayer).checked = true
          for (l = 0; l < filterList.length; l++) {
            if (filterList[l].id == zoomLayer) {
              console.log("Turning on layer " + filterList[l].name)
            }
          }
        }
      }
      if (zoomArea.tensDigit) {
        for (k = 0; k < zoomArea.tensDigit.length; k++) {
          let zoomLayer = zoomArea.tensDigit[k]
          document.querySelector('#' + zoomLayer).checked = true
          let tensDigit = zoomLayer.charAt(zoomLayer.length - 2)
          console.log("Turning on layer " + tensDigit + "0s")
        }
      }
      if (zoomArea.onesDigit) {
        for (k = 0; k < zoomArea.onesDigit.length; k++) {
          let zoomLayer = zoomArea.onesDigit[k]
          document.querySelector('#' + zoomLayer).checked = true
          for (l = 0; l < filterList.length; l++) {
            if (filterList[l].id == zoomLayer) {
              console.log("Turning on layer " + filterList[l].name)
            }
          }
        }
      }
      setAllFilters();
      map.fitBounds(zoomArea.coordinates);
    });
  }
}

////////////////////////////////HOVER AND CLICK/////////////////////////////////

// for (i = 0; i < layerList.length; i++) {
//   map.on('mouseenter', layerList[i], (e) => {map.getCanvas().style.cursor = 'pointer';});
// }

// for (i = 0; i < layerList.length; i++) {
//   map.on('mouseleave', layerList[i], (e) => {map.getCanvas().style.cursor = '';});
// }

// //Show a popup when clicked
// map.on('click', function(e) {
//   var features = map.queryRenderedFeatures(e.point, {
//     layers: layerList
//   });

//   if (!features.length) {
//     return;
//   }

//   var popup = new mapboxgl.Popup({ offset: [0, -15] })
//     .setLngLat(e.lngLat)
//     .setHTML('<h3>' + features[0].properties.ref + '</h3>')
//     .addTo(map);
// });

/////////////////////////////SIDEBAR////////////////////////////

$(".sidebar-dropdown > a").click(function() {
  $(".sidebar-submenu").slideUp(200); //slide up all of the submenus?
  
  if ($(this).parent().hasClass("active")) { //if the clicked item is open
    $(".sidebar-dropdown").removeClass("active"); //remove "active" class from all dropdowns
    $(this).parent().removeClass("active"); //remove "active" class from clicked item
  } 
  else { //if the clicked item is closed
    $(".sidebar-dropdown").removeClass("active"); //remove "active" class from all dropdowns
    $(this).next(".sidebar-submenu").slideDown(200); //slide down the next submenu
    $(this).parent().addClass("active"); //make the clicked item "active"
  }
});

$("#close-sidebar").click(function() {
  $(".page-wrapper").removeClass("toggled");
});
$("#show-sidebar").click(function() {
  $(".page-wrapper").addClass("toggled");
});

/////////////////////////DEFINE VIEWPORT WIDTH VARIABLE////////////////////////

let navWidth

// Set/update the viewportWidth value
let setViewportWidth = function () {
  let viewportWidth = window.innerWidth || document.documentElement.clientWidth
  if (viewportWidth < 768) {
    navWidth = 460
  }
  else {
    navWidth = 260
  }
}

// Set our initial width
setViewportWidth();

// On resize events, recalculate and log
window.addEventListener('resize', function () {
  setViewportWidth();
}, false);

/////////////////////////////CLOSE SIDEBAR ON SWIPE///////////////////////////

let speed = 200;

let swipeOptions = {
    triggerOnTouchEnd: true,
    swipeStatus: swipeStatus,
    allowPageScroll: "vertical",
    threshold: 180
};

$(function () {
    nav = $("nav");
    nav.swipe(swipeOptions);
});

/**
 * Catch each phase of the swipe.
 * move : we drag the div
 * cancel : we animate back to where we were
 * end : we animate to the next image
 */
function swipeStatus(event, phase, direction, distance) {
    
    if (phase == "move" && (direction == "left")) {
        var duration = 0;

       scrollNav(distance, duration);

    } else if (phase == "cancel") {
        scrollNav(0, speed);
    } else if (phase == "end") {
           hideNav();
            //added
            $(".page-wrapper").removeClass("toggled");
    }
}
function hideNav() {
    scrollNav(navWidth, speed);
}

/**
 * Manually update the position of the nav on drag
 */
function scrollNav(distance, duration) {
    nav.css("transition-duration", (duration / 1000).toFixed(1) + "s");
    //inverse the number we set in the css
    var value = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
    nav.css("transform", "translate(" + value + "px,0)");
}

/**
 * Open it again
 */
document.getElementById("show-sidebar").onclick = function fun() {
    scrollNav(0, speed);
}

/////////////////////////////COORDINATES ON CURSOR////////////////////////////

// map.on('mousemove', function (e) {
// document.getElementById('info').innerHTML =
// // e.point is the x, y coordinates of the mousemove event relative
// // to the top-left corner of the map
// JSON.stringify(e.point) +
// '<br />' +
// // e.lngLat is the longitude, latitude geographical position of the event
// JSON.stringify(e.lngLat.wrap());
// });