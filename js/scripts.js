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

    // When user drags the slider:
    //  - stops the animation
    //  - set the visualized year to the slider one.
    function inputHandler(event) {
        stopAnimation();
        setYear(event.value);
    }
    slider.on("thumb-drag", inputHandler);

    // Toggle animation on/off when user
    // clicks on the play button
    playButton.addEventListener("click", () => {
        if (playButton.classList.contains("toggled")) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });

    view.ui.empty("top-left");
    view.ui.add(titleDiv, "top-left");
    view.ui.add(
        new Home({
            view: view
        }),
        "top-left"
    );
    view.ui.add(
        new Legend({
            view: view
        }),
        "bottom-left"
    );
    view.ui.add(
        new Fullscreen({
            view: view,
            element: applicationDiv
        }),
        "top-right"
    );

    // When the layerview is available, setup hovering interactivity
    view.whenLayerView(layer).then(setupHoverTooltip);

    // Starts the application by visualizing year 1984
    setYear(1990);

    //--------------------------------------------------------------------------
    //
    //  Methods
    //
    //--------------------------------------------------------------------------

    /**
     * Sets the current visualized construction year.
     */
    function setYear(value) {
        sliderValue.innerHTML = Math.floor(value);
        slider.viewModel.setValue(0, value);
        layer.renderer = createRenderer(value);
    }

    /**
     * Returns a renderer with a color visual variable driven by the input
     * year. The selected year will always render buildings built in that year
     * with a light blue color. Buildings built 20+ years before the indicated
     * year are visualized with a pink color. Buildings built within that
     * 20-year time frame are assigned a color interpolated between blue and pink.
     */
     function createRenderer(year) {
        const opacityStops = [
            {
                opacity: 1,
                value: year
            },
            {
                opacity: 0,
                value: year + 1
            }
        ];

        return {
            type: "simple",
            symbol: {
                type: "simple-fill",
                color: "rgb(0, 0, 0)",
                outline: null
            },
            visualVariables: [
                {
                    type: "opacity",
                    field: "CNSTRCT_YR",
                    stops: opacityStops,
                    legendOptions: {
                        showLegend: false
                    }
                },
                {
                    type: "color",
                    field: "CNSTRCT_YR",
                    legendOptions: {
                        title: "Built:"
                    },
                    stops: [
                        {
                            value: year,
                            color: "#0ff",
                            label: "in " + Math.floor(year)
                        },
                        {
                            value: year - 10,
                            color: "#f0f",
                            label: "in " + (Math.floor(year) - 20)
                        },
                        {
                            value: year - 50,
                            color: "#404",
                            label: "before " + (Math.floor(year) - 50)
                        }
                    ]
                }
            ]
        };
    }

    /**
     * Sets up a moving tooltip that displays
     * the construction year of the hovered building.
     */
    function setupHoverTooltip(layerview) {
        let highlight;

        const tooltip = createTooltip();

        const hitTest = promiseUtils.debounce((event) => {
            return view.hitTest(event).then((hit) => {
                const results = hit.results.filter((result) => {
                    return result.graphic.layer === layer;
                });

                if (!results.length) {
                    return null;
                }

                return {
                    graphic: results[0].graphic,
                    screenPoint: hit.screenPoint
                };
            });
        });

        view.on("pointer-move", (event) => {
            return hitTest(event).then(
                (hit) => {
                    // remove current highlighted feature
                    if (highlight) {
                        highlight.remove();
                        highlight = null;
                    }

                    // highlight the hovered feature
                    // or hide the tooltip
                    if (hit) {
                        const graphic = hit.graphic;
                        const screenPoint = hit.screenPoint;

                        highlight = layerview.highlight(graphic);
                        tooltip.show(
                            screenPoint,
                            "Built in " + graphic.getAttribute("CNSTRCT_YR")
                        );
                    } else {
                        tooltip.hide();
                    }
                },
                () => { }
            );
        });
    }

    /**
     * Starts the animation that cycle
     * through the construction years.
     */
     function startAnimation() {
        stopAnimation();
        animation = animate(slider.values[0]);
        playButton.classList.add("toggled");
    }

    /**
     * Stops the animations
     */
    function stopAnimation() {
        if (!animation) {
            return;
        }

        animation.remove();
        animation = null;
        playButton.classList.remove("toggled");
    }


}
);