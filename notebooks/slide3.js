function _1(breadCrumb) {
  return (
    breadCrumb({ active: "When and where" })
  )
}

function _place(Inputs, m, html, d3, Event) {
  const elem = Inputs.select(m)

  const embedding = html`<div id="data-selector" class="d-flex flex-row">
    <div class="col-8" style="font-size: 1.75vw">
      <div class="input-group input-group-sm mb-3" id="data-selector-group">
      <p>The timeline shows the total number of accidents reported in our sample over time. Select a place to see how local reports contributed to the total.</p>
        <span class="input-group-text">Tap to choose a place</span>
        ${elem}
      </div>
    </div>
  </div>`

  d3.select(embedding).select("select")
    .on("change", function (evt) {
      const chosenText = this.options[this.options.selectedIndex].text;
      embedding.value = chosenText === "Choose..." ? "all" : chosenText;
      embedding.dispatchEvent(new Event("input", { bubbles: true }));
    })

  d3.select(embedding).select("select").attr("style", "min-height: 100% !important;")

  return Object.assign(html`${embedding}`, { value: "all" })
}


function _accumulativeAccidentArticles(d3, Plot, place, accumulativeByDate, width, html, map) {
  const plot = d3.select(Plot.plot({
    y: {
      type: "log",
    },
    x: {
      type: "time",
      domain: [new Date("1835-01-01"), new Date("1900-01-01")]
    },
    marks: place === "all" ?
      [Plot.areaX(accumulativeByDate[place], { x: "date", y: "totalArticles", fill: "#83c8b6" })] :
      [
        Plot.areaX(accumulativeByDate.all, { x: "date", y: "totalArticles", fill: "#83c8b6" }),
        Plot.line(accumulativeByDate[place], { x: "date", y: "totalArticles", stroke: "#662483" }),
        Plot.text(accumulativeByDate[place], Plot.selectLast({
          x: "date",
          y: "totalArticles",
          text: d => place, textAnchor: "end", dx: 0, dy: -10
        }))
      ],
    grid: true,
    marginLeft: 50,
    marginTop: 50,
    width,
  }))

  return html`
  <div id="data-content" class="d-flex flex-row align-items-start" style="">
    <div class="card shadow-sm col-6 me-3">
      <div class="card-header">
        When did newspapers report accidents?
      </div>
      <div class="card-body p-2">
        ${plot.node()}
      </div>
    </div>

    <div class="card shadow-sm col-6">
      <div class="card-header">
        In which parts of the country did newspapers report accidents?
      </div>
      <div class="card-body p-0">
        ${map.node()}
      </div>
    </div>
  </div>
  `
}


function _4(backToStart) {
  return (
    backToStart()
  )
}

function _m(_, accumulativeByDate) {
  return (
    new Map([
      ["Choose...", "all"],
      ..._.zip(Object.keys(accumulativeByDate).filter(o => o !== "all"), Object.keys(accumulativeByDate).filter(o => o !== "all"))
    ])
  )
}

function _dataSelector(html) {
  return (
    () => {
      const select = html`<select class="form-select" aria-label="Example select with button addon">
          <option>Choose...</option>
          <option value="Liverpool, Merseyside, England">Liverpool, Merseyside, England</option>
          <option value="Blackburn, Lancashire, England">Blackburn, Lancashire, England</option>
          <option value="Warrington, Cheshire, England">Warrington, Cheshire, England</option>
          <option value="Heywood, Lancashire, England">Heywood, Lancashire, England</option>
          <option value="Blakeney, Gloucestershire, England">Blakeney, Gloucestershire, England</option>
        </select>`

      select.onselect = (evt) => {
        //evt && evt.preventDefault(); // avoid dispatching 'click' event outside
        select.value = select.value;
        select.dispatchEvent(new CustomEvent('select'));
      }

      const control = html`<div id="data-selector" class="d-flex flex-row">
    <div class="col-8" style="font-size: 1.75vw">
      <div class="input-group input-group-sm mb-3" id="data-selector-group">
        <span class="input-group-text">Select a particular place to view details</span>
        ${select}
      </div>
    </div>
  </div>`

      if (control.value === "Choose...")
        control.value = "all"

      return Object.assign(control, {
        value: "all"
      });
    }
  )
}

function _map(width, d3, svg, shireCounts, o, turf) {
  const height = width / 1.8,
    caption = "",
    projector = d3.geoMercator,
    margin = { top: 0, left: 0, right: 0, bottom: 0 },
    fill = "#71ad9c",
    stroke = ["white", 0.5],
    projection = projector();

  const SVG = d3
    .select(svg`<svg
      width=${width}
      height=${height}
      viewBox="0,0,${width},${height}"
      style="max-width:100%;height:auto;"
      >`)

  const scale = d3.scaleLinear()
    .domain(d3.extent(shireCounts, o => o.count))
    .range([15, 30])

  const scaleOpacity = d3.scaleLinear()
    .domain(d3.extent(shireCounts, o => o.count))
    .range([0.5, 1])

  const shireCentroids = o.features
    .filter(d => shireCounts.map(o => o.shire).includes(d.properties.name))
    .map(({ geometry, ...d }) => Object.assign(turf.centroid(geometry), {
      properties: {
        count: shireCounts.find(o => o.shire === d.properties.name).count,
        name: d.properties.name.replace("Cheshire West and Chester", "Cheshire")
      }
    }))

  projection
    .fitExtent(
      [
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom]],
      o);

  var path = d3.geoPath().projection(projection);

  // Draw each province as a path
  const p = SVG.append('g').selectAll('path')
    .data(o.features)
    .join("path")
    .attr("d", path)
    .attr("fill", d => shireCounts.map(o => o.shire).includes(d.properties.name) ? "#463b76" : fill)
    .attr("fill-opacity", d => {
      const opacity = shireCounts.find(o => o.shire === d.properties.name) ?
        scaleOpacity(shireCounts.find(o => o.shire === d.properties.name).count) :
        1
      return opacity;
    })
    .attr("stroke", "white")
    .attr("stroke-width", 0.25);

  const text = SVG.selectAll("text")
    .data(shireCentroids)
    .join("text")
    .attr("x", d => projection(d.geometry.coordinates)[0])
    .attr("y", d => projection(d.geometry.coordinates)[1])
    .text(d => `${d.properties.name}`)
    .attr("style", "cursor: default; pointer-events: none;")
    .attr("font-size", d => scale(d.properties.count) + "px")
    .attr("font-family", "GT Walsheim, Zen Kaku Gothic New, sans-serif")
    .attr("fill", "white")
    .attr("text-anchor", "middle")

  return SVG
}


async function _accumulativeByDate(FileAttachment) {
  const accumulativeByDate = await FileAttachment("accumulativeByDate@1.json").json()

  const obj = Object.fromEntries(
    Object.entries(accumulativeByDate)
      .map(([place, o]) => [place, o.map(d => Object.assign(d, { date: new Date(d.date) }))]))

  return obj
}


function _breadCrumb(html) {
  return (
    ({
      active = ""
    } = {}) => html`<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="slide2.html">Explore sample data</a></li>
      <li class="breadcrumb-item active" aria-current="page">${active}</li>
    </ol>
  </nav>`
  )
}

function _turf(require) {
  return (
    require("@turf/turf")
  )
}

function _shireCounts(FileAttachment) {
  return (
    FileAttachment("shireCounts.json").json()
  )
}

function _o(ukIreland, turf, longitude, latitude) {
  return (
    {
      type: "FeatureCollection",
      features: ukIreland.features.map(feature => turf.bboxClip(feature, [longitude[0], latitude[0], longitude[1], latitude[1]]))
    }
  )
}

function _latitude() {
  return (
    [51.2, 54.2]
  )
}

function _longitude() {
  return (
    [-7, 2]
  )
}

function _ukIreland(FileAttachment) {
  return (
    FileAttachment("uk-ireland.geojson").json()
  )
}

function _backToStart(html) {
  return (
    () => html`<footer class="mt-auto">
    <p><a class="me-4 btn btn btn-warning rounded-4 shadow" href="slide2.html">Back to start</a></p>
  </footer>`
  )
}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["shireCounts.json", { url: new URL("./files/40fcd89891ef377e72eed2952fcdaa5108a47adda27fdf8fb92377eb7a4e3dd3b1e6a113c93403aeb214abf41ad3c550df275a77949ad27dab951124ed8f3f5a.json", import.meta.url), mimeType: "application/json", toString }],
    ["uk-ireland.geojson", { url: new URL("./files/04f392513c5eca238bc889367557b196c3cf6f9a758e53f4cf57854a0d9bd659d93c912a9202df32bcdbce7caf89befbb29dd86105047dc5df3692d8209b8fca.geojson", import.meta.url), mimeType: "application/geo+json", toString }],
    ["accumulativeByDate@1.json", { url: new URL("./files/40e591aeb3b2f0075a899f5cb827e43346589691979de06e86eab50ce11936b2642248aabf11ddca0540d0818f03b3542d2635460171799c767f9fc3afac0742.json", import.meta.url), mimeType: "application/json", toString }]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["breadCrumb"], _1);
  main.variable(observer("viewof place")).define("viewof place", ["Inputs", "m", "html", "d3", "Event"], _place);
  main.variable(observer("place")).define("place", ["Generators", "viewof place"], (G, _) => G.input(_));
  main.variable(observer("accumulativeAccidentArticles")).define("accumulativeAccidentArticles", ["d3", "Plot", "place", "accumulativeByDate", "width", "html", "map"], _accumulativeAccidentArticles);
  main.variable(observer()).define(["backToStart"], _4);
  main.variable(observer("m")).define("m", ["_", "accumulativeByDate"], _m);
  main.variable(observer("dataSelector")).define("dataSelector", ["html"], _dataSelector);
  main.variable(observer("map")).define("map", ["width", "d3", "svg", "shireCounts", "o", "turf"], _map);
  main.variable(observer("accumulativeByDate")).define("accumulativeByDate", ["FileAttachment"], _accumulativeByDate);
  main.variable(observer("breadCrumb")).define("breadCrumb", ["html"], _breadCrumb);
  main.variable(observer("turf")).define("turf", ["require"], _turf);
  main.variable(observer("shireCounts")).define("shireCounts", ["FileAttachment"], _shireCounts);
  main.variable(observer("o")).define("o", ["ukIreland", "turf", "longitude", "latitude"], _o);
  main.variable(observer("latitude")).define("latitude", _latitude);
  main.variable(observer("longitude")).define("longitude", _longitude);
  main.variable(observer("ukIreland")).define("ukIreland", ["FileAttachment"], _ukIreland);
  main.variable(observer("backToStart")).define("backToStart", ["html"], _backToStart);
  return main;
}
