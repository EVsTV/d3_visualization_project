var ctx = document.getElementById("myAreaChart");
var TV;
var EV;
var activeData;
var scaler;
var state;
var transitionDuration = 2000;
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
            var tank = loadComponentIntoCar("svg/tank.svg", "tank", scaler(activeData[1]["Data"]["Values"][0]["Values"][1]), scaler(activeData[1]["Data"]["Values"][0]["Values"][1]), car, dim.width - 40, 30);
            var engine = loadComponentIntoCar("svg/thermEngine.svg", "engine", scaler(activeData[1]["Data"]["Values"][0]["Values"][0]), scaler(activeData[1]["Data"]["Values"][0]["Values"][0]), car, 30, 30);
            var nozzle = loadComponentIntoCar("svg/nozzle.svg", "nozzle", scaler(activeData[1]["Data"]["Values"][0]["Values"][3]), scaler(activeData[1]["Data"]["Values"][0]["Values"][3]), car, dim.width - 20, 20);
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
            .attr("height", heightString);
    });
}

var buttonEnergy = document.getElementById("energy")
var buttonPhoto = document.getElementById("pollution")
var buttonCO2 = document.getElementById("climate-change")

function transformToCombustion() {
    if (state != "TV") {
        state = "TV";
        var bat = d3.select("svg.engine")
        var pEngineTherm = bat.select("path")
        pEngineTherm.transition().duration(transitionDuration)
            .on("start", function repeat() {
                d3.active(this)
                    .attrTween("d", pathTween(dEngineTherm, 1, scaler(activeData[1]["Data"]["Values"][0]["Values"][0]) / scaler(activeData[0]["Data"]["Values"][0]["Values"][0])))
                    .attr("transform", "translate(0,0)")
                    .style("fill", "brown")
                    .transition()
            });

        var bat = d3.select("svg.nozzle");
        var pNozzle = bat.select("path");
        pNozzle.transition().duration(transitionDuration)
            .on("start", function repeat() {
                d3.active(this)
                    .attrTween("d", pathTween(dNozzle, 1, scaler(activeData[1]["Data"]["Values"][0]["Values"][3]) / scaler(activeData[0]["Data"]["Values"][0]["Values"][3])))
                    .attr("transform", "translate(0,0)")
                    .style("fill", "brown")
                    .transition()
            });
        var bat = d3.select("svg.tank")
        var pTank = bat.select("path")
        pTank.transition().duration(transitionDuration)
            .on("start", function repeat() {
                d3.active(this)
                    .attrTween("d", pathTween(dTank, 1, scaler(activeData[1]["Data"]["Values"][0]["Values"][1]) / scaler(activeData[0]["Data"]["Values"][0]["Values"][1])))
                    .attr("transform", "translate(0,0)")
                    .style("fill", "brown")
                    .transition()
            });
    }
}

function transformToElectric() {
    if (state != "EV") {
        state = "EV";

        var bat = d3.select("svg.engine")

        var pEngineTherm = bat.select("path")
        pEngineTherm.transition().duration(transitionDuration)
            .on("start", function repeat() {
                d3.active(this)
                    .attrTween("d", pathTween(dEngineElectric, 1, scaler(activeData[0]["Data"]["Values"][0]["Values"][0]) / scaler(activeData[1]["Data"]["Values"][0]["Values"][0])))
                    .attr("transform", "translate(0,0)")
                    .style("fill", "yellow")
                    .transition()
            });

        var bat = d3.select("svg.nozzle")

        var pNozzle = bat.select("path")

        pNozzle.transition().duration(transitionDuration)
            .on("start", function repeat() {
                d3.active(this)
                    .attrTween("d", pathTween(dPlug, 1, scaler(activeData[0]["Data"]["Values"][0]["Values"][3]) / scaler(activeData[1]["Data"]["Values"][0]["Values"][3])))
                    .attr("transform", "translate(0,0)")
                    .style("fill", "yellow")
                    .transition()
            });
        var bat = d3.select("svg.tank")

        var pTank = bat.select("path")

        pTank.transition().duration(transitionDuration)
            .on("start", function repeat() {
                d3.active(this)
                    .attrTween("d", pathTween(dBattery, 1, scaler(activeData[0]["Data"]["Values"][0]["Values"][1]) / scaler(activeData[1]["Data"]["Values"][0]["Values"][1])))
                    .attr("transform", "translate(0,0)")
                    .style("fill", "yellow")
                    .transition()
            });
    }
}

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


function loopTransition() {
    var bat = d3.select("svg.engine")
    var pEngineTherm = bat.select("path")

    pEngineTherm.transition().duration(transitionDuration)
        .on("start", function repeat() {
            state = "EV";
            var tmp = d3.active(this)
                .attrTween("d", pathTween(dEngineElectric, 1, scaler(activeData[0]["Data"]["Values"][0]["Values"][0]) / scaler(activeData[1]["Data"]["Values"][0]["Values"][0])))
                .attr("transform", "translate(0,0)")
                .style("fill", "yellow")
                .transition()
            state = "TV";
            tmp.attrTween("d", pathTween(dEngineTherm, 1, scaler(activeData[1]["Data"]["Values"][0]["Values"][0]) / scaler(activeData[0]["Data"]["Values"][0]["Values"][0])))
                .style("fill", "brown")
                .transition()
                .on("start", repeat);
        });

    var bat = d3.select("svg.nozzle")
    var pNozzle = bat.select("path")
    pNozzle.transition().duration(transitionDuration)
        .on("start", function repeat() {
            d3.active(this)
                .attrTween("d", pathTween(dPlug, 1, scaler(activeData[0]["Data"]["Values"][0]["Values"][3]) / scaler(activeData[1]["Data"]["Values"][0]["Values"][3])))
                .attr("transform", "translate(0,0)")
                .style("fill", "yellow")
                .transition()
                .attrTween("d", pathTween(dNozzle, 1, scaler(activeData[1]["Data"]["Values"][0]["Values"][3]) / scaler(activeData[0]["Data"]["Values"][0]["Values"][3])))
                .style("fill", "brown")
                .transition()
                .on("start", repeat);
        });
    var bat = d3.select("svg.tank")
    var pTank = bat.select("path")

    pTank.transition().duration(transitionDuration)
        .on("start", function repeat() {
            d3.active(this)
                .attrTween("d", pathTween(dBattery, 1, scaler(activeData[0]["Data"]["Values"][0]["Values"][1]) / scaler(activeData[1]["Data"]["Values"][0]["Values"][1])))
                .attr("transform", "translate(0,0)")
                .style("fill", "yellow")
                .transition()
                .attrTween("d", pathTween(dTank, 1, scaler(activeData[1]["Data"]["Values"][0]["Values"][1]) / scaler(activeData[0]["Data"]["Values"][0]["Values"][1])))
                .style("fill", "brown")
                .transition()
                .on("start", repeat);
        });
}

function pathTween(d1, precision, scale) {
    // scale = Math.min(1.2, scale)
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
$(function () {
    $(document).on('change', 'input:radio[name="car-type"]', function (event) {
        carType = event.target["value"]
        if (carType == "combustion") {
            transformToCombustion()
        } else if (carType == "electric") {
            transformToElectric()
        } else if (carType == "loop") {
            loopTransition()
        }
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
            if (carType == "combustion") {
                transformToCombustion()
            } else if (carType == "electric") {
                transformToElectric()
            } else if (carType == "loop") {
                loopTransition()
            }
        }
    });
});

