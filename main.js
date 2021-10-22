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



  // NetherlandsCities GeoJSON
  const NetherlandsCitiesStyle = function (feature) {
    let cityID = feature.get('id');
    let cityIDString = cityID.toString();
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



  // Map Features Click Logic
  const navElements = document.querySelector('.column-navigation');
  const cityNameElement = document.getElementById('cityname');
  const cityImageElement = document.getElementById('cityimage');
  const mapView = map.getView(); // access to map view
  map.on('singleclick', function (evt) {
    map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
      let featureName = feature.get('City Name');
      let navElement = navElements.children.namedItem(featureName);
      mainLogic(feature, navElement);
    })
  })

  function mainLogic(feature, clickedAnchorElement) {
    //Re-assign active class to the click emenent
    let currentActiveStyleElement = document.querySelector('.active');
    currentActiveStyleElement.className = currentActiveStyleElement.className.replace('active', ' ');
    clickedAnchorElement.className = 'active';
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
  const anchorNavElements = document.querySelectorAll('.column-navigation > a');
  for (let anchorNavElement of anchorNavElements) {
    anchorNavElement.addEventListener('click', function (e) {
      let clickedAnchorElement = e.currentTarget;
      let clickedAnchorElementID = clickedAnchorElement.id;
      let NetherlandsCitiesFeatures = NetherlandsCitiesLayers.getSource().getFeatures();
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
const popoverTextElement = document.getElementById('popover-text');
const popoverTextLayer = new ol.Overlay({
  element: popoverTextElement,
  positioning: 'bottom-center',
  stopEvent: false
})
map.addOverlay(popoverTextLayer);
//when hover see whether there is feature or pixel
map.on('pointermove', function(evt){
  let isFeatureAtPixel = map.hasFeatureAtPixel(evt.pixel);
  if(isFeatureAtPixel){
    let featureAtPixel = map.getFeaturesAtPixel(evt.pixel);
    let featureName = featureAtPixel[0].get('City Name');
    popoverTextLayer.setPosition(evt.coordinate);
    popoverTextElement.innerHTML = featureName;
    map.getViewport().style.cursor= 'pointer';
  } else{
    popoverTextLayer.setPosition(undefined);
    map.getViewport().style.cursor= '';
  }
})
}


