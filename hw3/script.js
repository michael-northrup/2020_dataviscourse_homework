window.onload = function() {
  changeData();
};

/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
  barchart = document.getElementById('aBarChart')
  for (let bar of barchart.children) {
    for (let bar2 of barchart.children) {
      let bar2Width = bar2.getAttribute('width')
      if (+bar2Width > +bar.getAttribute('width')) {
        let temp = bar.getAttribute('width')
        bar.setAttribute('width', bar2Width);
        bar2.setAttribute('width',temp);
      }
    }
  }
}

/**
 * Render the visualizations
 * @param data
 */
function update(data) {
  /**
   * D3 loads all CSV data as strings. While Javascript is pretty smart
   * about interpreting strings as numbers when you do things like
   * multiplication, it will still treat them as strings where it makes
   * sense (e.g. adding strings will concatenate them, not add the values
   * together, or comparing strings will do string comparison, not numeric
   * comparison).
   *
   * We need to explicitly convert values to numbers so that comparisons work
   * when we call d3.max()
   **/

  for (let d of data) {
    d.cases = +d.cases; //unary operator converts string to number
    d.deaths = +d.deaths; //unary operator converts string to number
  }

  // Set up the scales
  let barChart_width = 345;
  let areaChart_width = 295;
  let maxBar_width = 240;
  let data_length = 15;
  let aScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.cases)])
    .range([0, maxBar_width]);
  let bScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.deaths)])
    .range([0, maxBar_width]);
  let iScale_line = d3
    .scaleLinear()
    .domain([0, data.length])
    .range([10, 500]);
  let iScale_area = d3
    .scaleLinear()
    .domain([0, data_length])
    .range([0, 260]);
  
  // Draw axis for Bar Charts, Line Charts and Area Charts (You don't need to change this part.)
  d3.select("#aBarChart-axis").attr("transform", "translate(0,210)").call(d3.axisBottom(d3.scaleLinear().domain([0, d3.max(data, d => d.cases)]).range([barChart_width, barChart_width-maxBar_width])).ticks(5));
  d3.select("#aAreaChart-axis").attr("transform", "translate(0,245)").call(d3.axisBottom(d3.scaleLinear().domain([0, d3.max(data, d => d.cases)]).range([areaChart_width, areaChart_width-maxBar_width])).ticks(5));
  d3.select("#bBarChart-axis").attr("transform", "translate(5,210)").call(d3.axisBottom(bScale).ticks(5));
  d3.select("#bAreaChart-axis").attr("transform", "translate(5,245)").call(d3.axisBottom(bScale).ticks(5));
  let aAxis_line = d3.axisLeft(aScale).ticks(5);
  d3.select("#aLineChart-axis").attr("transform", "translate(50,15)").call(aAxis_line);
  d3.select("#aLineChart-axis").append("text").text("New Cases").attr("transform", "translate(50, -3)")
  let bAxis_line = d3.axisRight(bScale).ticks(5);
  d3.select("#bLineChart-axis").attr("transform", "translate(550,15)").call(bAxis_line);
  d3.select("#bLineChart-axis").append("text").text("New Deaths").attr("transform", "translate(-50, -3)")

  let aBarChart = d3.select('#aBarChart')
      .selectAll('rect')
      .data(data);

  function setHovered() {
    d3.select(this)
        .classed("hovered", true);
  }

  function unsetHovered() {
    d3.select(this)
        .classed("hovered", false);
  }

  aBarChart
      .join('rect')
      .attr("y", (d, i) => i * 14)
      .attr("width", d=>aScale(d.cases))
      .attr('height', 12)
      .attr("transform", "scale(-1,1)")
      .on("mouseover", setHovered)
      .on("mouseout", unsetHovered)

  aBarChart.exit().remove();

  let bBarChart = d3.select('#bBarChart')
      .selectAll('rect')
      .data(data);

  bBarChart
      .join('rect')
      .attr("y", (d, i) => i * 14)
      .attr("width", d=>bScale(d.deaths))
      .attr('height', 12)
      .on("mouseover", setHovered)
      .on("mouseout", unsetHovered);

  bBarChart.exit().remove();

  let aLineGenerator = d3
    .line()
    .x((d, i) => iScale_line(i))
    .y(d => aScale(d.cases));

  let aLineChart = d3.select('#aLineChart')
      .data(data);
  aLineChart
      .join("path")
      .attr("d", aLineGenerator(data));
  aLineChart.exit().remove();

  let bLineGenerator = d3
      .line()
      .x((d, i) => iScale_line(i))
      .y(d => bScale(d.deaths));

  let bLineChart = d3.select('#bLineChart')
      .data(data);

  bLineChart
      .join("path")
      .attr("d", bLineGenerator(data));
  bLineChart.exit().remove();

  let aAreaGenerator = d3
    .area()
    .x((d, i) => iScale_area(i))
    .y0(0)
    .y1(d => aScale(d.cases));

  let aAreaChart = d3.select('#aAreaChart')
      .data(data);

  aAreaChart
      .join("path")
      .attr("d", aAreaGenerator(data));
  aAreaChart.exit().remove();

  let bAreaGenerator = d3
      .area()
      .x((d, i) => iScale_area(i))
      .y0(0)
      .y1(d => bScale(d.deaths));

  let bAreaChart = d3.select('#bAreaChart')
      .data(data);

  bAreaChart
      .join("path")
      .attr("d", bAreaGenerator(data));
  bAreaChart.exit().remove();

  let scatterXAxis_line = d3.axisBottom(aScale).ticks(5);
  d3.select("#x-axis").attr("transform", "translate(0,240)").call(scatterXAxis_line)

  let scatterYAxis_line = d3.axisLeft(bScale).ticks(5);
  d3.select("#y-axis").attr("transform", "translate(0,0)").call(scatterYAxis_line);
  let scatterplot = d3.select('#scatterplot')
      .selectAll(".dot")
      .data(data);
  function logValues() {
    console.log("x: " + this.getAttribute("cx") + "\n"
        + "y: " + this.getAttribute("cy"))
  }
  scatterplot
      .join("circle")
      .classed("dot", true)
      .attr("cx", data=>aScale(data.cases))
      .attr("cy", data=>bScale(data.deaths))
      .attr("r", 3.5)
      .on("click",logValues)
      .on("mouseover", setHovered)
      .on("mouseout", unsetHovered)
}

/**
 * Update the data according to document settings
 */
async function changeData() {
  //  Load the file indicated by the select menu
  let dataFile = document.getElementById("dataset").value;
  try {
    const data = await d3.csv("data/" + dataFile + ".csv");
    if (document.getElementById("random").checked) {
      // if random
      update(randomSubset(data)); // update w/ random subset of data
    } else {
      // else
      update(data); // update w/ full data
    }
  } catch (error) {
    console.log(error)
    alert("Could not load the dataset!");
  }
}

/**
 *  Slice out a random chunk of the provided in data
 *  @param data
 */
function randomSubset(data) {
  return data.filter(d => Math.random() > 0.5);
}
