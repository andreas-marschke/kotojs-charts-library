(function(w,d){
  var AreaChart = w.KotoChartLibrary.AreaChart,
      d3 = w.d3,
      container = d3.select("#chart"),
      area = new AreaChart(container);

  area.config("width", container.node().getBoundingClientRect().width);
  area.config("theme", "google-colors");

  d3.csv("/docs/data/simple-area.csv", function(xhr, data) {
    if (!data) {
      console.error("Data not found!");
    }

    var parse = d3.time.format("%d-%b-%y").parse;
    data.forEach(function(d) {
      d.date = parse(d.date);
      d.value = +d.value;
    });

    area.draw(data);
  });
}(this,this.document));
