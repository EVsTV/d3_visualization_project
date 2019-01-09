var ctx = document.getElementById("myAreaChart");

d3.xml("svg/car-frame-svg.svg").mimeType("image/svg+xml").get(function (error, xml) {
    if (error) throw error;
    var child = xml.documentElement;
    child.classList.add("car");
    ctx.appendChild(child);
    var car = d3.select(".car")
    // Set the svg viewport height dimension.
        .attr("height", "100")

    var dim = car.node().getBBox();
    var tank = loadComponentIntoCar("svg/tank.svg", "tank", "45", "40", car, dim.width - 40, 30);
    var engine = loadComponentIntoCar("svg/thermEngine.svg", "engine", "40", "40", car, 30, 30);
    var nozzle = loadComponentIntoCar("svg/nozzle.svg", "nozzle", "20", "10", car, dim.width - 15, 25);

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

var buttonEngine = document.getElementById("buttonEngine")
var buttonTank = document.getElementById("buttonTank")
var buttonNozzle = document.getElementById("buttonNozzle")

var loopButton = document.getElementById("loop")

loopButton.onclick = function () {
    console.log("loop clicked")
    var bat = d3.select("svg.engine")
    var pEngineTherm = bat.select("path")
    var dEngineTherm = pEngineTherm.attr("d");

    d3.xml("svg/elecEngine.svg").mimeType("image/svg+xml").get(function (error, xml) {
        var child = xml.documentElement;

        var pEngineElectric = d3.select(child).select("path");
        var dEngineElectric = pEngineElectric.attr("d")

        pEngineTherm.transition().duration(2000)
            .on("start", function repeat() {
                d3.active(this)
                    .attrTween("d", pathTween(dEngineElectric, 1, 0.8))
                    .attr("transform", "translate(0,0)")
                    .style("fill", "yellow")
                    .transition()
                    .attrTween("d", pathTween(dEngineTherm, 1, 1))
                    .style("fill", "brown")
                    .transition()
                    .on("start", repeat);
            });
    });

    var bat = d3.select("svg.nozzle")
    var pNozzle = bat.select("path")
    var dNozzle = pNozzle.attr("d");

    d3.xml("svg/plug.svg").mimeType("image/svg+xml").get(function (error, xml) {
        var child = xml.documentElement;

        var pPlug = d3.select(child).select("path");
        var dPlug = pPlug.attr("d")

        pNozzle.transition().duration(2000)
            .on("start", function repeat() {
                d3.active(this)
                    .attrTween("d", pathTween(dPlug, 1, 0.8))
                    .attr("transform", "translate(0,0)")
                    .style("fill", "yellow")
                    .transition()
                    .attrTween("d", pathTween(dNozzle, 1, 1))
                    .style("fill", "brown")
                    .transition()
                    .on("start", repeat);
            });
    });
    var bat = d3.select("svg.tank")
    var pTank = bat.select("path")
    var dTank = pTank.attr("d");

    d3.xml("svg/battery.svg").mimeType("image/svg+xml").get(function (error, xml) {
        var child = xml.documentElement;

        var pBattery = d3.select(child).select("path");
        var dBattery = pBattery.attr("d")

        pTank.transition().duration(2000)
            .on("start", function repeat() {
                d3.active(this)
                    .attrTween("d", pathTween(dBattery, 1, 0.8))
                    .attr("transform", "translate(0,0)")
                    .style("fill", "yellow")
                    .transition()
                    .attrTween("d", pathTween(dTank, 1, 1))
                    .style("fill", "brown")
                    .transition()
                    .on("start", repeat);
            });
    });
}

function pathTween(d1, precision, scale) {
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
