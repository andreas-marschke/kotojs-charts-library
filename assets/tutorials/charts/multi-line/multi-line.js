(function(w,d){
  var LineChart = w.KotoChartLibrary.LineChart,
      d3 = w.d3,
      container = d3.select("#chart"),
      line = new LineChart(container);

  line.config("width", container.node().getBoundingClientRect().width);

  line.config("theme", "google-colors");

  d3.tsv("/docs/data/multi-line.tsv", function(xhr, data) {
    if (!data) {
      console.error("Data not found!");
      return;
    }

    var format = d3.time.format("%Y%m%d");
    data.forEach(function(d) {
      d.date = format.parse(d.date);

      var keys = Object.keys(d).filter(function(v) { return v !== "date"; });
      keys.forEach(function (k) {
        d[k] = +d[k];
      });
    });

    line.draw(data);
  });
}(this,this.document));
