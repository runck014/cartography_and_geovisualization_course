
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';


// Create a map from the webmap id in ArcGIS Online
const webmap = new WebMap({
  portalItem: {
    id: "a53530f1272f46ffb1d8f01e222828ac"
  }
});

const view = new MapView({
  container: "map",
  map: webmap,
  constraints: {
    rotationEnabled: false
  }
});