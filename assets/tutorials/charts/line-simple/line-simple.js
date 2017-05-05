(function(w,d){
  var LineChart = w.KotoChartLibrary.LineChart,
      d3 = w.d3,
      container = d3.select("#chart"),
      line = new LineChart(container);

  line.config("width", container.node().getBoundingClientRect().width);
  line.config("theme", "google-colors");
  d3.csv("/docs/data/line-simple.csv", function(xhr, data) {
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
