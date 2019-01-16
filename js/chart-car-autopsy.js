var ctx = document.getElementById("myAreaChart");
var TV;
var EV;
var activeData;
var scaler;
var state;
var transitionDuration = 1000;
var carType = "combustion";

d3.json("./TV.json", function (data) {
    TV = data

    d3.json("./EV.json", function (dataEV) {
        EV = dataEV
        activeData = getActiveData()
        scaler = getScaler(activeData, "Energy (MJ)")

        d3.xml("svg/car-frame-svg.svg").mimeType("image/svg+xml").get(function (error, xml) {
            if (error) throw error;
            var child = xml.documentElement;
            child.classList.add("car");
            ctx.appendChild(child);
            var car = d3.select(".car")
            // Set the svg viewport height dimension.
                .attr("height", "100")

            //Set default visualisation with : TV and Energy (MJ)
            var dim = car.node().getBBox();
            loadComponentIntoCar("svg/tank.svg", "tank", scaler(activeData[1]["Data"]["Values"][0]["Values"][1]), scaler(activeData[1]["Data"]["Values"][0]["Values"][1]), car, dim.width - 40, 30);
            loadComponentIntoCar("svg/thermEngine.svg", "engine", scaler(activeData[1]["Data"]["Values"][0]["Values"][0]), scaler(activeData[1]["Data"]["Values"][0]["Values"][0]), car, 30, 30);
            loadComponentIntoCar("svg/nozzle.svg", "nozzle", scaler(activeData[1]["Data"]["Values"][0]["Values"][3]), scaler(activeData[1]["Data"]["Values"][0]["Values"][3]), car, dim.width - 20, 20);
            state = "TV";
        });
    });
});

function loadComponentIntoCar(filePath, cssClassString, widthString, heightString, car, posX = 0, posY = 0) {
    d3.xml(filePath).mimeType("image/svg+xml").get(function (error, xml) {
        if (error) throw error;
        var child = xml.documentElement;
        child.classList.add(cssClassString);
        var componentGroup = car.append("g")
            .attr("class", cssClassString)
            .attr("transform", "translate(" + posX + ", " + posY + ")")
        componentGroup.node().appendChild(child)
        componentGroup.select("path")
            .style("fill", "brown");
        d3.select("svg." + cssClassString)
        // Set the svg viewport dimensions.
            .attr("width", widthString)
            .attr("height", heightString)
            .on("mouseover", function(){
                var i = (state == "TV") ? 1 : 0
                var j = 0
                var data = getActiveData()
                switch(cssClassString){
                    case "engine":
                        j=0
                        break
                    case "tank":
                        j=2
                        break
                    case "nozzle":
                        j=3
                        break
                }
                var tip = document.createElement("div")
                tip.id="temporaryTip"
                tip.style.height = "25px"
                tip.style.width = "100%"
                tip.innerHTML = "Ce composant rejète " + data[i]["Data"]["Values"][0].Values[j] + " dans l'atmosphère"
                var chart = document.getElementById("myAreaChart")
                chart.parentNode.insertBefore(tip, chart.nextSibling);
            })
            .on("mouseleave", function() {
                var el = document.getElementById("temporaryTip")
                el.parentNode.removeChild(el);
            })
    });
}

var buttonEnergy = document.getElementById("energy")
var buttonPhoto = document.getElementById("pollution")
var buttonCO2 = document.getElementById("climate-change")


d3.xml("svg/thermEngine.svg").mimeType("image/svg+xml").get(function (error, xml) {
    var child = xml.documentElement;

    pEngineTherm = d3.select(child).select("path");
    dEngineTherm = pEngineTherm.attr("d")
});
d3.xml("svg/elecEngine.svg").mimeType("image/svg+xml").get(function (error, xml) {
    var child = xml.documentElement;

    pEngineElectric = d3.select(child).select("path");
    dEngineElectric = pEngineElectric.attr("d")
});
d3.xml("svg/nozzle.svg").mimeType("image/svg+xml").get(function (error, xml) {
    var child = xml.documentElement;

    pNozzle = d3.select(child).select("path");
    dNozzle = pNozzle.attr("d")
});
d3.xml("svg/plug.svg").mimeType("image/svg+xml").get(function (error, xml) {
    var child = xml.documentElement;

    pPlug = d3.select(child).select("path");
    dPlug = pPlug.attr("d")
});
d3.xml("svg/tank.svg").mimeType("image/svg+xml").get(function (error, xml) {
    var child = xml.documentElement;

    pTank = d3.select(child).select("path");
    dTank = pTank.attr("d")
});
d3.xml("svg/battery.svg").mimeType("image/svg+xml").get(function (error, xml) {
    var child = xml.documentElement;

    pBattery = d3.select(child).select("path");
    dBattery = pBattery.attr("d")
});
var dataMap = function () {
    return {
        "engine": {
            "css": "svg.engine",
            "TV": {
                "d": dEngineTherm,
                "scale": function () {
                    return 1 / dataMap()["engine"]["EV"]["scale"]();
                }
            },
            "EV": {
                "d": dEngineElectric,
                "scale": function () {
                    return scaler(activeData[1]["Data"]["Values"][0]["Values"][0]) /
                        scaler(activeData[0]["Data"]["Values"][0]["Values"][0]);
                }
            }
        },
        "nozzle": {
            "css": "svg.nozzle",
            "TV": {
                "d": dNozzle,
                "scale": function () {
                    return scaler(activeData[1]["Data"]["Values"][0]["Values"][0]) /
                        scaler(activeData[0]["Data"]["Values"][0]["Values"][0]);
                }
            },
            "EV": {
                "d": dPlug,
                "scale": function () {
                    return 1 / dataMap()["nozzle"]["TV"]["scale"]();
                }
            },
        },
        "tank": {
            "css": "svg.tank",
            "TV": {
                "d": dTank,
                "scale": function () {
                    return scaler(activeData[1]["Data"]["Values"][0]["Values"][1]) /
                        scaler(activeData[0]["Data"]["Values"][0]["Values"][1]);
                }
            },
            "EV": {
                "d": dBattery,
                "scale": function () {
                    return 1 / dataMap()["tank"]["TV"]["scale"]();
                }
            },
        },

    }
};

function transformToCombustion() {
    if (state != "TV") {
        state = "TV";
        doTransitionFor("engine", state)
        doTransitionFor("nozzle", state);
        doTransitionFor("tank", state);
    }
}

function transformToElectric() {
    if (state != "EV") {
        state = "EV";
        doTransitionFor("engine", state);
        doTransitionFor("nozzle", state);
        doTransitionFor("tank", state)
    }
}

function doTransitionFor(object, carType) {

    var bat = d3.select(dataMap()[object]["css"]);

    var pTank = bat.select("path");

    console.log(dataMap())

    var d = dataMap()[object][carType]["d"];
    var scale = dataMap()[object][carType]["scale"]();
    var color = carType == "TV" ? "brown" : "yellow";

    pTank.transition().duration(transitionDuration)
        .on("start", function repeat() {
            d3.active(this)
                .attrTween("d", pathTween(d, 1, scale))
                .attr("transform", "translate(0,0)")
                .style("fill", color)
                .transition()
        });
}

function loopTransition(delay = 0) {
    if (state != "EV") {
        var timeOutElectric = setTimeout(transformToElectric, delay += duration);
        if (carType != "loop") {
            clearTimeout(timeOutElectric);
            triggerTransform();
            return;
        }
    }
    var timeOutCombustion = setTimeout(transformToCombustion, delay += 2 * duration);
    if (carType != "loop") {
        clearTimeout(timeOutCombustion);
        triggerTransform();
        return;
    }
    // Repeat
    setTimeout(loopTransition, delay += duration);
}

function pathTween(d1, precision, scale) {
    console.log("scale surface: " + scale)
    scale = Math.sqrt(scale)
    console.log("scale: " + scale)
    return function () {
        var path0 = this,
            path1 = path0.cloneNode(),
            n0 = path0.getTotalLength(),
            n1 = (path1.setAttribute("d", d1), path1).getTotalLength();

        // Uniform sampling of distance based on specified precision.
        var distances = [0], i = 0, dt = precision / Math.max(n0, n1);
        while ((i += dt) < 1) distances.push(i);
        distances.push(1);

        // Compute point-interpolators at each distance.
        var points = distances.map(function (t) {
            var p0 = path0.getPointAtLength(t * n0),
                p1 = path1.getPointAtLength(t * n1);
            return d3.interpolate([p0.x, p0.y], [p1.x * scale, p1.y * scale]);
        });

        return function (t) {
            return "M" + points.map(function (p) {
                return p(t);
            }).join("L");
        };
    };
}

//Keep only the useful part of data (EV and TV) depending on the selected value type
//EV index 0
//TV index 1
function getActiveData() {
    if (buttonEnergy.checked == true) {
        var data = [JSON.parse(JSON.stringify(EV)), JSON.parse(JSON.stringify(TV))]
        data[0]["Data"]["Values"] = [data[0]["Data"]["Values"][0]]
        data[1]["Data"]["Values"] = [data[1]["Data"]["Values"][0]]
    }
    if (buttonPhoto.checked == true) {
        var data = [JSON.parse(JSON.stringify(EV)), JSON.parse(JSON.stringify(TV))]
        data[0]["Data"]["Values"] = [data[0]["Data"]["Values"][1]]
        data[1]["Data"]["Values"] = [data[1]["Data"]["Values"][1]]
    }
    if (buttonCO2.checked == true) {
        var data = [JSON.parse(JSON.stringify(EV)), JSON.parse(JSON.stringify(TV))]
        data[0]["Data"]["Values"] = [data[0]["Data"]["Values"][2]]
        data[1]["Data"]["Values"] = [data[1]["Data"]["Values"][2]]
    }
    return data
}

//Return a scaler for given data
function getScaler(data, selected) {
    var scaler = d3.scaleLinear().domain([d3.min(data, function (data) {
        return d3.min(data["Data"]["Values"], function (data) {
            if (data["Title"] == selected)
                return d3.min(data["Values"])
        })
    }), d3.max(data, function (data) {
        return d3.max(data["Data"]["Values"], function (data) {
            if (data["Title"] == selected)
                return d3.max(data["Values"])
        })
    })])
        .range([10, 60]);
    return scaler;
}

let duration = 1000;

function triggerTransform() {
    if (carType == "combustion") {
        transformToCombustion()
    } else if (carType == "electric") {
        transformToElectric()
    } else if (carType == "loop") {
        loopTransition()
    }
}

$(function () {
    $(document).on('change', 'input:radio[name="car-type"]', function (event) {
        carType = event.target["value"]
        console.log("event:")
        console.log(event)
        triggerTransform();
    });
});


$(function () {
    $(document).on('change', 'input:radio[name="category"]', function (event) {
        if ($(this).is(':checked')) {
            if (state == "EV") {
                var tmpE = scaler(activeData[0]["Data"]["Values"][0]["Values"][0])
                var tmpN = scaler(activeData[0]["Data"]["Values"][0]["Values"][3])
                var tmpT = scaler(activeData[0]["Data"]["Values"][0]["Values"][1])
                activeData = getActiveData()
                scaler = getScaler(activeData, event.target["value"])

                var bat = d3.select("svg.engine")

                var pEngineTherm = bat.select("path")

                pEngineTherm.transition().duration(duration)
                    .on("start", function repeat() {
                        d3.active(this)
                            .attrTween("d", pathTween(dEngineElectric, 1, tmpE / scaler(activeData[1]["Data"]["Values"][0]["Values"][0])))
                            .attr("transform", "translate(0,0)")
                            .transition()
                    });

                var bat = d3.select("svg.nozzle")

                var pNozzle = bat.select("path")
                pNozzle.transition().duration(duration)
                    .on("start", function repeat() {
                        d3.active(this)
                            .attrTween("d", pathTween(dPlug, 1, tmpN / scaler(activeData[1]["Data"]["Values"][0]["Values"][3])))
                            .attr("transform", "translate(0,0)")
                            .transition()
                    });
                var bat = d3.select("svg.tank")

                var pTank = bat.select("path")

                pTank.transition().duration(duration)
                    .on("start", function repeat() {
                        d3.active(this)
                            .attrTween("d", pathTween(dBattery, 1, tmpT / scaler(activeData[1]["Data"]["Values"][0]["Values"][1])))
                            .attr("transform", "translate(0,0)")
                            .transition()
                    });

            }
            else {
                var tmpE = scaler(activeData[1]["Data"]["Values"][0]["Values"][0])
                var tmpN = scaler(activeData[1]["Data"]["Values"][0]["Values"][3])
                var tmpT = scaler(activeData[1]["Data"]["Values"][0]["Values"][1])
                activeData = getActiveData()
                scaler = getScaler(activeData, event.target["value"])

                var bat = d3.select("svg.engine")

                var pEngineTherm = bat.select("path")
                dEngineTherm = pEngineTherm.attr("d");
                pEngineTherm.transition().duration(duration)
                    .on("start", function repeat() {
                        d3.active(this)
                            .attrTween("d", pathTween(dEngineTherm, 1, tmpE / scaler(activeData[1]["Data"]["Values"][0]["Values"][0])))
                            .attr("transform", "translate(0,0)")
                            .transition()
                    });

                var bat = d3.select("svg.nozzle")

                var pNozzle = bat.select("path")
                dNozzle = pNozzle.attr("d");
                pNozzle.transition().duration(duration)
                    .on("start", function repeat() {
                        d3.active(this)
                            .attrTween("d", pathTween(dNozzle, 1, tmpN / scaler(activeData[1]["Data"]["Values"][0]["Values"][3])))
                            .attr("transform", "translate(0,0)")
                            .transition()
                    });
                var bat = d3.select("svg.tank")

                var pTank = bat.select("path")
                dTank = pTank.attr("d");
                pTank.transition().duration(duration)
                    .on("start", function repeat() {
                        d3.active(this)
                            .attrTween("d", pathTween(dTank, 1, tmpT / scaler(activeData[1]["Data"]["Values"][0]["Values"][1])))
                            .attr("transform", "translate(0,0)")
                            .transition()
                    });

            }
        }
    });
});

