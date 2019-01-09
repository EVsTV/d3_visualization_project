var ctx = document.getElementById("myAreaChart");
d3.json("./TV.json", function (data) {
    var TV = data

    d3.json("./EV.json", function (dataEV) {
        var EV = dataEV
        console.log(EV)
        var scaler = getScaler(EV)

        d3.xml("svg/car-frame-svg.svg").mimeType("image/svg+xml").get(function (error, xml) {
            if (error) throw error;
            var child = xml.documentElement;
            child.classList.add("car");
            ctx.appendChild(child);
            var car = d3.select(".car")
            // Set the svg viewport height dimension.
                .attr("height", "100")

            var dim = car.node().getBBox();
            var tank = loadComponentIntoCar("svg/tank.svg", "tank", scaler(EV["Data"]["Values"][0]["Values"][0]), scaler(EV["Data"]["Values"][0]["Values"][0]), car, dim.width - 40, 30);
            var engine = loadComponentIntoCar("svg/thermEngine.svg", "engine", scaler(EV["Data"]["Values"][0]["Values"][1]), scaler(EV["Data"]["Values"][0]["Values"][1]), car, 30, 30);
            var nozzle = loadComponentIntoCar("svg/nozzle.svg", "nozzle", scaler(EV["Data"]["Values"][0]["Values"][3]), scaler(EV["Data"]["Values"][0]["Values"][3]), car, dim.width - 15, 25);

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

var buttonEngine = document.getElementById("buttonEngine")
var buttonTank = document.getElementById("buttonTank")
var buttonNozzle = document.getElementById("buttonNozzle")

var loopButton = document.getElementById("loop")
var electricButton = document.getElementById("electric")
var combustionButton = document.getElementById("combustion")

combustionButton.onclick = function () {
    var bat = d3.select("svg.engine")
    var pEngineTherm = bat.select("path")
    pEngineTherm.transition().duration(2000)
        .on("start", function repeat() {
            d3.active(this)
                .attrTween("d", pathTween(dEngineTherm, 1, 0.8))
                .attr("transform", "translate(0,0)")
                .style("fill", "brown")
                .transition()
        });

    var bat = d3.select("svg.nozzle")
    var pNozzle = bat.select("path")
    pNozzle.transition().duration(2000)
        .on("start", function repeat() {
            d3.active(this)
                .attrTween("d", pathTween(dNozzle, 1, 0.8))
                .attr("transform", "translate(0,0)")
                .style("fill", "brown")
                .transition()
        });
    var bat = d3.select("svg.tank")
    var pTank = bat.select("path")

    pTank.transition().duration(2000)
        .on("start", function repeat() {
            d3.active(this)
                .attrTween("d", pathTween(dTank, 1, 0.8))
                .attr("transform", "translate(0,0)")
                .style("fill", "brown")
                .transition()
        });
}
electricButton.onclick = function () {
    var bat = d3.select("svg.engine")
    var pEngineTherm = bat.select("path")
    pEngineTherm.transition().duration(2000)
        .on("start", function repeat() {
            d3.active(this)
                .attrTween("d", pathTween(dEngineElectric, 1, 0.8))
                .attr("transform", "translate(0,0)")
                .style("fill", "yellow")
                .transition()
        });

    var bat = d3.select("svg.nozzle")
    var pNozzle = bat.select("path")
    pNozzle.transition().duration(2000)
        .on("start", function repeat() {
            d3.active(this)
                .attrTween("d", pathTween(dPlug, 1, 0.8))
                .attr("transform", "translate(0,0)")
                .style("fill", "yellow")
                .transition()
        });
    var bat = d3.select("svg.tank")
    var pTank = bat.select("path")

    pTank.transition().duration(2000)
        .on("start", function repeat() {
            d3.active(this)
                .attrTween("d", pathTween(dBattery, 1, 0.8))
                .attr("transform", "translate(0,0)")
                .style("fill", "yellow")
                .transition()
        });
}

d3.xml("svg/elecEngine.svg").mimeType("image/svg+xml").get(function (error, xml) {
    var child = xml.documentElement;

    pEngineElectric = d3.select(child).select("path");
    dEngineElectric = pEngineElectric.attr("d")
});
d3.xml("svg/plug.svg").mimeType("image/svg+xml").get(function (error, xml) {
    var child = xml.documentElement;

    pPlug = d3.select(child).select("path");
    dPlug = pPlug.attr("d")
});
d3.xml("svg/battery.svg").mimeType("image/svg+xml").get(function (error, xml) {
    var child = xml.documentElement;

    pBattery = d3.select(child).select("path");
    dBattery = pBattery.attr("d")
});


loopButton.onclick = function () {
    console.log("loop clicked")
    var bat = d3.select("svg.engine")
    var pEngineTherm = bat.select("path")
    dEngineTherm = pEngineTherm.attr("d");


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

    var bat = d3.select("svg.nozzle")
    var pNozzle = bat.select("path")
    dNozzle = pNozzle.attr("d");


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
    var bat = d3.select("svg.tank")
    var pTank = bat.select("path")
    dTank = pTank.attr("d");

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


function getScaler(data, selected) {
    var selected = "Energy (MJ)"
    var scaler = d3.scaleLinear().domain([d3.min(data["Data"]["Values"], function (data) {
        if (data["Title"] == selected)
            return d3.min(data["Values"])

    }), d3.max(data    ["Data"]["Values"], function (data) {
        if (data["Title"] == selected)
            return d3.max(data["Values"])

    })])
        .range([10, 60]);
    return scaler;
}	