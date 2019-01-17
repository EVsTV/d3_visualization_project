var w = 800;
var h = 600;
var x = d3.scaleLinear().domain([0, 100]).range([0, w]);
var y = d3.scaleLinear().domain([0, 2000]).range([h, 0]);
var pad = 50;
var svg = d3.select("#lineChart")
    .append("svg:svg")
    .attr("height", h + pad)
    .attr("width", w + pad)
var vis = svg.append("svg:g")
    .attr("transform", "translate(42,20)")
var legend = d3.select("body").append("div")
    .classed("legend", true)
var continuous_ev = calculate_polution(1500, 1.2);
var continuous_tv = calculate_polution(1200, 5.6);
make_rules();
var ev = chart_line(continuous_ev);
ev.attr("stroke", "yellow")
var tv = chart_line(continuous_tv);
tv.attr("stroke", "brown")

function calculate_polution(initial_polution, consumption) {
    return (function (xi) {
        value = initial_polution + xi * consumption
        console.log(value, xi)
        return value;
    });
}

function chart_line(continuous) {
    var g = vis.append("svg:g")
        .classed("series", true)
    g.append("svg:path")
        .attr("d", function (d) {
            return d3.line()(
                x.ticks(50).map(function (xi) {
                    return [x(xi), y(continuous(xi))]
                })
            )
        })
    return g;
}

function make_rules() {
    var rules = vis.append("svg:g").classed("rules", true)

    function make_x_axis() {
        return d3.axisBottom()
            .scale(x)
            .ticks(10)
    }

    function make_y_axis() {
        return d3.axisLeft()
            .scale(y)
            .ticks(10)
    }

    rules.append("svg:g").classed("grid x_grid", true)
        .attr("transform", "translate(0," + h + ")")
        .call(make_x_axis()
            .tickSize(-h, 0, 0)
            .tickFormat("")
        )
    rules.append("svg:g").classed("grid y_grid", true)
        .call(make_y_axis()
            .tickSize(-w, 0, 0)
            .tickFormat("")
        )
    rules.append("svg:g").classed("labels x_labels", true)
        .attr("transform", "translate(0," + h + ")")
        .call(make_x_axis()
                .tickSize(5)
            // .tickFormat(d3.time.format("%Y/%m"))
        )
    rules.append("svg:g").classed("labels y_labels", true)
        .call(make_y_axis()
            // .tickSubdivide(1)
                .tickSize(10, 5, 0)
        )
    rules.append('text')
        .attr('x', 0)
        .attr('y', -5)
        .attr('class', 'label')
        .text("emission of CO2 in gramm");

    rules.append('text')
        .attr('x', w + 125)
        .attr('y', h - 5)
        .attr('text-anchor', 'end')
        .attr('class', 'label')
        .text("x1000 km driven");
}
