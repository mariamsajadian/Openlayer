window.onload = init;

function init(){
  const map = new ol.Map({
    view: new ol.View({
      center: [15091875.539375868, -2890099.0297847847],
      zoom: 1,
      extent: [11644482.371265175, -5927677.981920381, 17897308.66780227, 423055.8371644793],   
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    target: 'openlayers-map'
  })
}