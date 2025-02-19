require([
  "esri/WebMap",
  "esri/views/MapView",
  "esri/widgets/Home",
  "esri/widgets/Editor",
  "esri/widgets/LayerList",
  "esri/widgets/Legend",
  "esri/widgets/Zoom"
], (
  WebMap, MapView, Home, Editor, LayerList, Legend, Zoom
) => {

  // Create a map from the webmap id for "20241031_Demo_map" in ArcGIS Online
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

  view.when(() => {

    // Log each layer with its index and title in the WebMap
    console.log("Available Layers:");
    webmap.layers.forEach((layer, index) => {
      console.log(`Layer Index: ${index}, Title: ${layer.title}, ID: ${layer.id}`);
    });

    // Find the layer we're editing by title
    const targetLayer = webmap.layers.find(layer => 
      layer.title === "Winter Workshop Activity 1"  // Change to appropriate layer if using for another webapp or project
    );

    // Create editor, change settings to remove the ability to add or edit attachments
    if (targetLayer) {
      const editor = new Editor({
        view: view,
        layerInfos: [{
          layer: targetLayer,
          attachmentsOnUpdateEnabled: false,
          attachmentsOnCreateEnabled: false
        }]
      });
      view.ui.add(editor, "top-right");
    } else {
      console.warn("Target layer not found!");
    }






  });
});