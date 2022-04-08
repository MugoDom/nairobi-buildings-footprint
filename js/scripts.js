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
            id: "4134667d27d24e0cb7aef00cebda5bf2"
        },
        definitionExpression: "Year_Built > 0",
        title: "Building Footprints",
        minScale: 72223.819286,
        effect: "bloom(2.5 0 0.5)"
    });

    const map = new Map({
        basemap: {
            portalItem: {
                id: "4f2e99ba65e34bb8af49733d9778fb8e"
            }
        },
        layers: [layer]
    });

    const view = new MapView({
        map: map,
        container: "viewDiv",
        center: [-1.3064915,36.7939919],
        zoom: 12,
        constraints: {
            snapToZoom: false,
            minScale: 72223.819286
        },
        // This ensures that when going fullscreen
        // The top left corner of the view extent
        // stays aligned with the top left corner
        // of the view's container
        resizeAlign: "top-left"
    });

    //Set up User Interface........

    const applicationDiv = document.getElementById("applicationDiv");
    const sliderValue = document.getElementById("sliderValue");
    const playButton = document.getElementById("playButton");
    const titleDiv = document.getElementById("titleDiv");
    let animation = null;

    const slider = new Slider({
        container: "slider",
        min: 1901,
        max: 2022,
        values: [1984],
        step: 1,
        visibleElements: {
            rangeLabels: true
        }
    });

}
);