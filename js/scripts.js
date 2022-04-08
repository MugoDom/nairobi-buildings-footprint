// Load required modules

require([
    "esri/Map",
    "esri/layers/FeatureLayer",
    "esri/views/MapView",
    "esri/core/promiseUtils",
    "esri/widgets/Legend",
    "esri/widgets/Home",
    "esri/widgets/Slider",
    "esri/widgets/Fullscreen"
], (
    Map,
    FeatureLayer,
    MapView,
    promiseUtils,
    Legend,
    Home,
    Slider,
    Fullscreen
) => {
    // Setting up the Map and the View
    //---------------------------------
    //

    const layer = new FeatureLayer({
        portalItem: {
            id: ""
        },
        definitionExpression: "Year_Built > 0",
        title: "Building Footprints",
        minScale: 72223.819286,
        effect: "bloom(2.5 0 0.5)"
    })
}
);