(function(w,d){
  var LineChart = w.KotoChartLibrary.LineChart,
      d3 = w.d3,
      container = d3.select("#chart"),
      line = new LineChart(container);

  line.config("width", container.node().getBoundingClientRect().width);
  line.config("theme", "google-colors");
  line.layers.graph.on("enter", function() {
    line.containers.axis.x.selectAll(".tick line").attr("y1", function() {
      return -(line.config("height") - line.config("margin-top") - line.config("margin-bottom"));
    }).attr("style", "stroke-dasharray: 2,2;");
  });
  d3.csv("/docs/data/custom-axis.csv", function(xhr, data) {
    if (!data) {
      console.error("Data not found!");
      return;
    }
    var parse = d3.time.format("%d-%b-%y").parse;
    data.forEach(function(d) {
      d.date = parse(d.date);
      d.value = +d.value;
    });

    line.draw(data);
  });
}(this,this.document));
