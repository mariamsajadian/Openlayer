window.onload = init;
const netherlandsCenterCoordinate = [-1220615.4781307788, 4136186.521297304, 1846992.2597501045, 8858553.812835738]

function init() {
  const map = new ol.Map({
    view: new ol.View({
      center: ol.proj.fromLonLat([4.897070, 52.377956]),
      extent: netherlandsCenterCoordinate,
      zoom: 8,
    }),
    layers: [new ol.layer.Tile({
      source: new ol.source.OSM(),
    })
    ],
    target: 'openlayer-map'
  })



  // Australian Cities GeoJSON
  const NetherlandsCitiesStyle = function (feature) {
    //  console.log(feature);//feature.getKeys or feature.coordinate
    let cityID = feature.get('id');
    let cityIDString = cityID.toString();
    // console.log(cityID.toString());
    const styles = [
      new ol.style.Style({
        image: new ol.style.Circle({
          fill: new ol.style.Fill({
            color: [77, 219, 105, 0.6]
          }),
          stroke: new ol.style.Stroke({
            color: [6, 125, 34, 1],
            width: 2
          }),
          radius: 8
        }),
        text: new ol.style.Text({
          text: cityIDString,
          scale: 1.5,
          fill: new ol.style.Fill({
            color: [232, 26, 26, 1]
          }),
          stroke: new ol.style.Stroke({
            color: [232, 26, 26, 1],
            width: 0.3
          })
        })
      })
    ]
    return styles
  }

  const styleForSelect = function (feature) {
    let cityID = feature.get('id');
    let cityIDString = cityID.toString();
    const styles = [
      new ol.style.Style({
        image: new ol.style.Circle({
          fill: new ol.style.Fill({
            color: [247, 26, 10, 0.5]
          }),
          stroke: new ol.style.Stroke({
            color: [6, 125, 34, 1],
            width: 2
          }),
          radius: 12
        }),
        text: new ol.style.Text({
          text: cityIDString,
          scale: 1.5,
          fill: new ol.style.Fill({
            color: [87, 9, 9, 1]
          }),
          stroke: new ol.style.Stroke({
            color: [87, 9, 9, 1],
            width: 0.5
          })
        })
      })
    ]
    return styles
  }

  // GeoJson add to layer
  const NetherlandsCitiesLayers = new ol.layer.Vector({
    source: new ol.source.Vector({
      format: new ol.format.GeoJSON(),
      url: './data/city-json.geojson'
    }),
    style: NetherlandsCitiesStyle

  })
  map.addLayer(NetherlandsCitiesLayers);
  // console.log ( NetherlandsCitiesLayers);


  // Map Features Click Logic

  // cityname and cityimage and column-navigation
  const navElements = document.querySelector('.column-navigation');
  // console.log(document.querySelector('.column-navigation'));
  const cityNameElement = document.getElementById('cityname');
  // console.log(document.getElementById('cityname'));
  const cityImageElement = document.getElementById('cityimage');
  // console.log(document.getElementById('cityimage'));
  const mapView = map.getView(); // access to map view
  // detect base onn their pixel
  map.on('singleclick', function (evt) {
    map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
      // console.log(feature);
      let featureName = feature.get('City Name');
      // console.log(featureName);
      let navElement = navElements.children.namedItem(featureName);
      // console.log(navElement);
      mainLogic(feature, navElement);
    })
  })

  function mainLogic(feature, clickedAnchorElement) {
    //*******Re-assign active class to the click emenent
    let currentActiveStyleElement = document.querySelector('.active');
    // console.log(currentActiveStyleElement);
    currentActiveStyleElement.className = currentActiveStyleElement.className.replace('active', ' ');
    clickedAnchorElement.className = 'active';
    // console.log (clickedAnchorElement.className)

    let currentActiveStyledElement = document.querySelector('.active');
    currentActiveStyledElement.className = currentActiveStyledElement.className.replace('active', '');
    clickedAnchorElement.className = 'active';



    // Default style for all features
    let NetherlandsCitiesFeatures = NetherlandsCitiesLayers.getSource().getFeatures();
    NetherlandsCitiesFeatures.forEach(function (feature) {
      feature.setStyle(NetherlandsCitiesStyle);// deselecting them becuase we have for each 
    })
    // Home Element : Change content in the menu to HOME
    if (clickedAnchorElement.id === 'Home') {
      mapView.animate({ center: ol.proj.fromLonLat([4.897070, 52.377956]) }, {extent: netherlandsCenterCoordinate}, { zoom: 8 })
      cityNameElement.innerHTML = 'Welcome to the Netherlands Tour Map';
      cityImageElement.setAttribute('src', './data/City_images/flag.jpg');
    } 
    // change view and content in the menue based on feature
    else {
      feature.setStyle(styleForSelect) // this is for selecting feature and highlight them
      // change the view based on click from geometry and coordinate
      let featureCoordinates = feature.get('geometry').getCoordinates();
      mapView.animate({ center: featureCoordinates }, { zoom: 10 })
      let featureName = feature.get('City Name');
      let featureImage = feature.get('image');
      cityNameElement.innerHTML = 'Name of the city: ' + featureName;
      cityImageElement.setAttribute('src', './data/City_images/' + featureImage + '.jpg')

    }

  }
  // Navigation Button Logic
  // console.log(navElements);
  // first get anchor elements
  const anchorNavElements = document.querySelectorAll('.column-navigation > a');
  // console.log(anchorNavElements);
  for (let anchorNavElement of anchorNavElements) {
    // console.log(anchorNavElement);
    //attach the anchors to listerners
    anchorNavElement.addEventListener('click', function (e) {

      // console.log(e.currentTarget);
      let clickedAnchorElement = e.currentTarget;// get each anchor sperately
      let clickedAnchorElementID = clickedAnchorElement.id;//name of cities
      // console.log(clickedAnchorElementID);
      let NetherlandsCitiesFeatures = NetherlandsCitiesLayers.getSource().getFeatures();// go to json file and get data and features
      // console.log(NetherlandsCitiesFeatures);
      NetherlandsCitiesFeatures.forEach(function (feature) {
                let featureCityName = feature.get('City Name');
                console.log(featureCityName);
                if(clickedAnchorElementID === featureCityName){
                  mainLogic(feature, clickedAnchorElement);
                }
        })

        if(clickedAnchorElementID === 'Home'){
              mainLogic(undefined, clickedAnchorElement)
        }



      })


    }
// features hover logic 
// with hover on the features(not pixels) show the name of city and change cursor to pointer
const popoverTextElement = document.getElementById('popover-text');
// console.log(popoverTextElement);
// use  overlay to distinguish between pixels and features
const popoverTextLayer = new ol.Overlay({
  element: popoverTextElement,
  positioning: 'bottom-center',
  stopEvent: false
})
map.addOverlay(popoverTextLayer);
//when hover see whether there is feature or pixel
//hasFeatureAtPixel:Detect if features intersect a pixel on the viewport. Layers included in the detection can be configured through 
//https://gis.stackexchange.com/questions/252946/what-are-the-possible-listeners-and-event-types-for-an-openlayers-map-ol-map

map.on('pointermove', function(evt){
  let isFeatureAtPixel = map.hasFeatureAtPixel(evt.pixel);
  // console.log(isFeatureAtPixel);
  // console.log(evt);
  // if feature is true do this
  if(isFeatureAtPixel){
    // console.log('there is a feature');
    let featureAtPixel = map.getFeaturesAtPixel(evt.pixel);
    // console.log(featureAtPixel[0].get('City Name'));// it considers value only
    let featureName = featureAtPixel[0].get('City Name');// get value
    popoverTextLayer.setPosition(evt.coordinate);//  give a position in container 
    popoverTextElement.innerHTML = featureName;// connect to container
    //change pointer using ol-viewport in default html
    // console.log(map.getViewport().style);// not Style SSS no sssss and get cursor.
    map.getViewport().style.cursor= 'pointer';// if hover on the feature change the default style to pointer 


  } else{
    // console.log(' pixel');
    popoverTextLayer.setPosition(undefined);// if point on pixel remove the name of the city
    map.getViewport().style.cursor= '';// if hover on the pixel stay the default
  }
})
}


