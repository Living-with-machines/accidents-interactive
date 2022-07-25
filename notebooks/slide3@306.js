function _1(breadCrumb) {
  return (
    breadCrumb({ active: "When were accidents reported" })
  )
}

function _place(Inputs, m, html, d3, Event) {
  const elem = Inputs.select(m)

  const embedding = html`<div id="data-selector" class="d-flex flex-row">
    <div class="col-8" style="font-size: 1.75vw">
      <div class="input-group input-group-sm mb-3" id="data-selector-group">
        <span class="input-group-text">Select a particular place to view details</span>
        ${elem}
      </div>
    </div>
  </div>`

  d3.select(embedding).select("select").on("change", function (evt) {
    const chosenText = this.options[this.options.selectedIndex].text;
    embedding.value = chosenText === "Choose..." ? "all" : chosenText;
    embedding.dispatchEvent(new Event("input", { bubbles: true }));
  })

  return Object.assign(html`${embedding}`, { value: "all" })
}


function _accumulativeAccidentArticles(d3, Plot, place, accumulativeByDate, width, html, zooniverseComment) {
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
    height: 500
  }))

  plot.attr("style", "max-width:100%;height:auto;")

  return html`
  <div id="data-content" class="d-flex flex-row align-items-start">
    <div class="card shadow-sm">
      <div class="card-body row">
        <div class="col-6">
          <h3>When did newspapers report accidents?</h3>
          <p>The timeline shows the total number of accidents reported in our sample over time. Select a place above to see how local reports contributed to the total.</p>
          ${plot.node()}
        </div>
  
        <div class="col-6">
          ${zooniverseComment}
        </div>
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
      const select = html`<select class="form-select" aria-label="Example select with button addon" >
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

function _backToStart(html) {
  return (
    () => html`<footer class="mt-auto">
    <p><a class="me-4 btn btn btn-warning rounded-4 shadow" href="slide2.html">Back to start</a></p>
  </footer>`
  )
}

async function* _zooniverseComment(_, zooniverseComments, getHTML, Promises, getNewSample) {
  let current = _.sample(zooniverseComments)

  yield getHTML(current);

  while (true) {
    await Promises.delay(10000);
    const sample = getNewSample(current);
    current = sample;

    yield getHTML(current);
  }
}


function _getNewSample(_, zooniverseComments) {
  return (
    (current) => {
      const sample = _.sample(zooniverseComments);
      if (sample === current) {
        while (sample === current) {
          const sample = _.sample(zooniverseComments);
          current = sample
        }
      }
      current = sample
      return current;
    }
  )
}

function _zooniverseComments(FileAttachment) {
  return (
    FileAttachment("zooniverse-comments@1.csv").csv()
  )
}

function _getHTML(html, moment, d3) {
  return (
    (current) => {
      const elem = html`
      <div class="col-12 d-flex align-items-center justify-content-center h-100 w-100">
        <div class="col-11 pe-3 d-flex flex-column align-items-center">
          <p class="small text-muted">${moment(current.datePublished).format("D MMMM YYYY")}</p>
          <p class="text-center">${current.comment}</p>
          <p class="pt-4 mt-4 border-top border-warning small">Zooniverse volunteer</p>
        </div>
        <!--
        <div class="col-1 d-flex align-items-center" style="font-size: 3rem;">
           <a id="nextQuote" style="color: #f9b233 !important;">&#x27A1;</a>
         </div>
        -->
      </div>`

      d3.select(elem).select("#nextQuote").on("click", function () {

      })

      return elem;
    }
  )
}

function _moment(require) {
  return (
    require("moment")
  )
}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["accumulativeByDate@1.json", { url: new URL("./files/40e591aeb3b2f0075a899f5cb827e43346589691979de06e86eab50ce11936b2642248aabf11ddca0540d0818f03b3542d2635460171799c767f9fc3afac0742.json", import.meta.url), mimeType: "application/json", toString }],
    ["zooniverse-comments@1.csv", { url: new URL("./files/ac187a9ba708a0eaf9f3a7fbab9a6882243482026437f1785e0aed7802256dfff2f0b4f9e825ae182a99f9a75db8f9b9d879804ea4cd250018c2f3bd5ce51fbe.csv", import.meta.url), mimeType: "text/csv", toString }]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["breadCrumb"], _1);
  main.variable(observer("viewof place")).define("viewof place", ["Inputs", "m", "html", "d3", "Event"], _place);
  main.variable(observer("place")).define("place", ["Generators", "viewof place"], (G, _) => G.input(_));
  main.variable(observer("accumulativeAccidentArticles")).define("accumulativeAccidentArticles", ["d3", "Plot", "place", "accumulativeByDate", "width", "html", "zooniverseComment"], _accumulativeAccidentArticles);
  main.variable(observer()).define(["backToStart"], _4);
  main.variable(observer("m")).define("m", ["_", "accumulativeByDate"], _m);
  main.variable(observer("dataSelector")).define("dataSelector", ["html"], _dataSelector);
  main.variable(observer("accumulativeByDate")).define("accumulativeByDate", ["FileAttachment"], _accumulativeByDate);
  main.variable(observer("breadCrumb")).define("breadCrumb", ["html"], _breadCrumb);
  main.variable(observer("backToStart")).define("backToStart", ["html"], _backToStart);
  main.variable(observer("zooniverseComment")).define("zooniverseComment", ["_", "zooniverseComments", "getHTML", "Promises", "getNewSample"], _zooniverseComment);
  main.variable(observer("getNewSample")).define("getNewSample", ["_", "zooniverseComments"], _getNewSample);
  main.variable(observer("zooniverseComments")).define("zooniverseComments", ["FileAttachment"], _zooniverseComments);
  main.variable(observer("getHTML")).define("getHTML", ["html", "moment", "d3"], _getHTML);
  main.variable(observer("moment")).define("moment", ["require"], _moment);
  return main;
}
