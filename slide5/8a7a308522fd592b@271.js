function _crumb(breadCrumb){return(
breadCrumb({active: "Accident sites"})
)}

function _place(Inputs,decades,htl,d3,Event)
{
  const elem = Inputs.select(decades)

  const embedding = htl.html`<div id="data-selector" class="d-flex flex-row">
    <div class="col-8" style="font-size: 1.75vw">
      <div class="input-group input-group-sm mb-3" id="data-selector-group">
        <span class="input-group-text">Select a decade</span>
        ${elem}
      </div>
    </div>
  </div>`

  d3.select(embedding).select("select").on("change", function(evt) {
    const chosenText = this.options[this.options.selectedIndex].text;
    embedding.value = chosenText === "Choose..." ? "1830" : decades.get(chosenText);
    embedding.dispatchEvent(new Event("input", {bubbles: true}));
  })
  
  return Object.assign(htl.html`${embedding}`, { value: "1830" })
}


function _dataFrame(htl,getChart,place){return(
htl.html`<div id="data-content" class="d-flex flex-row align-items-start" style="">
      <div class="card shadow-sm col-11">
        <div class="card-header">
          Where do you think more accidents happened?
        </div>
        <div class="card-body row">
          <div class="col-12 row" style="height: 370px;">
            <div class="col-4">
              <p><em>Where do you think more accidents involving machinery happened?</em> The circles to the right are sized by the number of accidents reported in different sites.</p>
              <p><strong>Select a decade</strong> <em>to how this changed over time. Can you guess what kind of site had the most or least accidents reported? Tap a circle to see if you were right.</em></p>
            </div>
            <div class="col-8">
              ${getChart({ place })}
            </div>
          </div>
          <div class="col-12 row">
            <p><strong>The options are:</strong></p>
            <div class="col-6">
              <ul class="list-group list-group-flush small">
                <li class="list-group-item list-group-item-light small" id="MANUFACTURING"><span class="category">MANUFACTURING:</strong> including factories, mills, workshops, works</li>
                <li class="list-group-item list-group-item-light small" id="MINES-AND-COLLIERIES"><span class="category">MINES AND COLLIERIES:</strong> including mines, quarries, pits, collieries</li>
                <li class="list-group-item list-group-item-light small" id="RAIL"><span class="category">RAIL:</strong> all railway-related locations including train stations, track, rail yards</li>
                <li class="list-group-item list-group-item-light small" id="ROAD"><span class="category">ROAD:</strong> all road-related locations and machines including trams, steamrollers, bicycles</li>
              </ul>
            </div>
            <div class="col-6">
              <ul class="list-group list-group-flush small">
                <li class="list-group-item list-group-item-light small" id="WATER-TRANSPORT"><span class="category">WATER TRANSPORT:</strong> all inland, coastal and marine locations including ports, docks, canals, rivers</li>
                <li class="list-group-item list-group-item-light small" id="DOMESTIC"><span class="category">DOMESTIC:</strong> including houses, yards</li>
                <li class="list-group-item list-group-item-light small" id="AGRICULTURAL"><span class="category">AGRICULTURAL:</strong> including farms</li>
                <li class="list-group-item list-group-item-light small" id="AIR"><span class="category">AIR:</strong> including balloons, aeroplanes</li>
                <li class="list-group-item list-group-item-light small" id="OTHER"><span class="category">OTHER</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>`
)}

function _toStart(backToStart){return(
backToStart()
)}

function _pack(d3,children){return(
(packing) => packing(d3.hierarchy(children).sum(d => d.value))
)}

function _getChart(d3,htl,pack){return(
({
    decade = 1830,
    width = 600,
    height = 400,
    padding = 5,
  }={}) => {
  console.log("ƒ: getChart")

  const SVG = d3.select(htl.svg`<svg
        width=${width}
        height=${height}
        viewBox="0,0,${width},${height}"
        style="max-width:100%;height:auto;"
        >`)
    
  const packing = d3.pack()
    .size([width, height]) // width, height
    .padding(padding)
  
  const root = pack(packing);
        
  // add gradients
  SVG.append("defs")
    .append("radialGradient")
    .attr("id", "gradient")
    .selectAll("stop")
    .data([
      { offset: "0%", stopColor: "#83c8b6" },
      { offset: "100%", stopColor: "#71ad9c" },
    ])
    .join("stop")
    .attr("offset", d => d.offset)
    .attr("stop-color", d => d.stopColor)
  
  const circleG = SVG.append("g")
  
  const circle = circleG
    .selectAll("circle")
    .data(root.leaves())
    .join("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => d.r)
    .attr("fill", "url('#gradient')")
    .attr("style", "cursor: pointer")
    .on("mouseover", function () {
      const selected = d3.select(this);
      circle.attr("opacity", 1)
      selected.attr("opacity", 0.7)
      text
        .attr("style", d => d === selected.datum() ?
              "display: block; cursor: pointer; pointer-events: none;" :
              "display: none")
        .attr("font-weight", d => d === selected.datum() ? "700" : "400")
  
      d3.selectAll(".list-group-item").classed("active", false);
      d3.select(`.list-group-item#${selected.datum().data.category.replace(/ /g, '-')}`).classed("active", true);
    })
    .on("mouseout", function () {
      circle.attr("opacity", 1)
      text.attr("font-weight", "400")
      d3.selectAll(".list-group-item").classed("active", false);
    })
  
  const text = SVG.append("g")
    .selectAll("text")
    .data(root.leaves().filter(d => d.data.value))
    .join("text")
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .attr("text-anchor", "middle")
    .attr("font-family", "GT Walsheim")
    .attr("font-size", "1.9rem")
    .attr("fill", "black")
    .attr("style", "display: none")
    .text(d => d.data.category)

  return SVG.node();
}
)}

function _children(FileAttachment,place){return(
FileAttachment("categoryDataByDecade@1.json").json().then(d => d[place])
)}

function _decades(FileAttachment){return(
FileAttachment("decades.json")
  .json()
  .then(d => new Map(d))
)}

function _breadCrumb(htl){return(
({
  active = ""
}={}) => htl.html`<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="slide2.html">Explore sample data</a></li>
      <li class="breadcrumb-item active" aria-current="page">${active}</li>
    </ol>
  </nav>`
)}

function _backToStart(htl){return(
() => htl.html`<footer class="mt-auto">
    <p><a class="me-4 btn btn btn-warning rounded-4 shadow" href="slide2.html">Back to start</a></p>
  </footer>`
)}

function _htl(require){return(
require("htl@0.3.1")
)}

function _d3(require){return(
require("d3@7", "d3-selection@2", "d3-hierarchy@3")
)}

function _Inputs(require){return(
require("@observablehq/inputs@0.10.4")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["categoryDataByDecade@1.json", {url: new URL("./files/0bb8792e14ecc01c652ca7b5dadba0c48f764a02fb72892c22488d108e79b340bf7f106a343ca2c49392f0a565087ef85e88741757729ed85e8935e6ebac59d0.json", import.meta.url), mimeType: "application/json", toString}],
    ["decades.json", {url: new URL("./files/4255377175e667038a06360d19bf5202aa667db84902e5220146c4d2fa07e2e4ad7385c3ae813c85f271ba64c7bb416357ba33aab101a7469efb7c628ef34636.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("crumb")).define("crumb", ["breadCrumb"], _crumb);
  main.variable(observer("viewof place")).define("viewof place", ["Inputs","decades","htl","d3","Event"], _place);
  main.variable(observer("place")).define("place", ["Generators", "viewof place"], (G, _) => G.input(_));
  main.variable(observer("dataFrame")).define("dataFrame", ["htl","getChart","place"], _dataFrame);
  main.variable(observer("toStart")).define("toStart", ["backToStart"], _toStart);
  main.variable(observer("pack")).define("pack", ["d3","children"], _pack);
  main.variable(observer("getChart")).define("getChart", ["d3","htl","pack"], _getChart);
  main.variable(observer("children")).define("children", ["FileAttachment","place"], _children);
  main.variable(observer("decades")).define("decades", ["FileAttachment"], _decades);
  main.variable(observer("breadCrumb")).define("breadCrumb", ["htl"], _breadCrumb);
  main.variable(observer("backToStart")).define("backToStart", ["htl"], _backToStart);
  main.variable(observer("htl")).define("htl", ["require"], _htl);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("Inputs")).define("Inputs", ["require"], _Inputs);
  return main;
}
