function _crumb(htl){return(
htl.html`<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="slide2.html">Explore sample data</a></li>
      <li class="breadcrumb-item active" aria-current="page">Who was affected</li>
    </ol>
  </nav>`
)}

function _place(Inputs,genderAgeDecades,htl,d3,Event)
{
  const elem = Inputs.select(genderAgeDecades)

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
    embedding.value = genderAgeDecades.get(chosenText);
    embedding.dispatchEvent(new Event("input", {bubbles: true}));
  })
  
  return Object.assign(htl.html`${embedding}`, { value: "1830" })
}


function _dataFrame(Plot,counts,width,d3,htl,place)
{
  const maxCount = 16;
  
  const p = Plot.plot({
    x: {
      axis: null,
      domain: counts.age,
    },
    y: {
      domain: [0, maxCount + 1],
      ticks: false
    },
    facet: {
      data: counts,
      x: "gender",
      label: "",
    },
    marks: [
      Plot.barY(counts, {
        x: "age",
        y: "count",
        fill: d => d.age === "adult" ?
          d.gender === "female" ?
            "#83c8b6" : // woman
            "#cc8abb" : // man
          d.gender === "female" ?
            "#71ad9c" : // girl
            "#662483", // boy
        rx: 12
      }),
      // Plot.ruleY([0]),
      Plot.text(counts, {
        x: "age",
        y: d => d.count + 0.75,
        text: d => d.label && d.label.includes("wom") ? "women" : d.label && d.label.includes("men") ? "men" : d.label && d.label.includes("boy") ? "boys" : d.label ? "girls" : ""
      })
    ],
    insetBottom: 10,
    width,
    marginLeft: 0,
    style: {
      fontFamily: "GT Walsheim, Zen Kaku Gothic New, sans-serif",
      size: "1.5rem"
    }
  })

  d3.select(p).selectAll("svg > g > g > text").style("font-size", "1.2rem");

  d3.select(p).selectAll("svg > g[aria-label='fx-axis']").style("display", "none");
  d3.select(p).selectAll("svg > g[aria-label='y-axis']").style("display", "none");

  return htl.html`
    <div id="data-content" class="d-flex flex-row align-items-start" style="">
      <div class="card shadow-sm col-12 me-3">
        <div class="card-header">
          Who was affected by accidents between ${place} and ${+place+10}?
        </div>
        <div class="card-body row m-2">
          <div class="col-8">
            ${p}
          </div>
          <div class="col-4">
            <h3>Who was affected by accidents?</h3>
            <p>Who was affected by accidents involving machinery?</p>
            <p>We asked online volunteers to note the age and gender of people mentioned in newspaper articles about accidents involving machines.</p>
            <p><em>Select a decade to see sample results.</em></p>
          </div>
        </div>
      </div>
    </div>`;
}


function _toStart(htl){return(
htl.html`<footer class="mt-auto">
    <p><a class="me-4 btn btn btn-warning rounded-4 shadow" href="slide2.html">Back to start</a></p>
  </footer>`
)}

function _counts(FileAttachment,place){return(
FileAttachment("genderAgeByDecade.json").json().then(d => d.find(o => o.decade === `${place}`).counts)
)}

function _genderAgeDecades(FileAttachment){return(
FileAttachment("genderAgeDecades.json")
  .json()
  .then(d => new Map(d.map(o => [`${o}s`, o])))
)}

function _htl(require){return(
require("htl@0.3.1")
)}

function _Plot(require){return(
require("@observablehq/plot@0.5.2")
)}

function _Inputs(require){return(
require("@observablehq/inputs@0.10.4")
)}

function _d3(require){return(
require("d3@7", "d3-selection@2")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["genderAgeByDecade.json", {url: new URL("./files/8111d1400c78dd08a3020c40bb37acf92a13c81a59915e5697713c80bfa575285c606bdf8206dcc5af473486fc78c4b34906f54d7b04e99e7f891d37fb8e9e92.json", import.meta.url), mimeType: "application/json", toString}],
    ["genderAgeDecades.json", {url: new URL("./files/75ca9106b7d79f723b02d445f807557ce565d4ef09150cc510f27c5ca35053bf657565d67eb3714586357a42687017e7e9b9ed874f3513661f11d4adc6e79d20.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("crumb")).define("crumb", ["htl"], _crumb);
  main.variable(observer("viewof place")).define("viewof place", ["Inputs","genderAgeDecades","htl","d3","Event"], _place);
  main.variable(observer("place")).define("place", ["Generators", "viewof place"], (G, _) => G.input(_));
  main.variable(observer("dataFrame")).define("dataFrame", ["Plot","counts","width","d3","htl","place"], _dataFrame);
  main.variable(observer("toStart")).define("toStart", ["htl"], _toStart);
  main.variable(observer("counts")).define("counts", ["FileAttachment","place"], _counts);
  main.variable(observer("genderAgeDecades")).define("genderAgeDecades", ["FileAttachment"], _genderAgeDecades);
  main.variable(observer("htl")).define("htl", ["require"], _htl);
  main.variable(observer("Plot")).define("Plot", ["require"], _Plot);
  main.variable(observer("Inputs")).define("Inputs", ["require"], _Inputs);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
