function _1(breadCrumb){return(
breadCrumb({active: "When were accidents reported"})
)}

function _place(Inputs,m,html,d3,Event)
{
  const elem = Inputs.select(m)

  const embedding = html`<div id="data-selector" class="d-flex flex-row">
    <div class="col-8" style="font-size: 1.75vw">
      <div class="input-group input-group-sm mb-3" id="data-selector-group">
        <span class="input-group-text">Select a place to compare</span>
        ${elem}
      </div>
    </div>
  </div>`

  d3.select(embedding).select("select").on("change", function(evt) {
    const chosenText = this.options[this.options.selectedIndex].text;
    embedding.value = chosenText === "Choose..." ? "all" : chosenText;
    embedding.dispatchEvent(new Event("input", {bubbles: true}));
  })
  
  return Object.assign(html`${embedding}`, { value: "all" })
}


function _3(d3,Plot,place,accumulativeByDate,width,html)
{
  const plot = d3.select(Plot.plot({
    y: { type: "log" },
    x: {
      type: "time",
      domain: [new Date("1835-01-01"), new Date("1900-01-01")]
    },
    marks: place === "all" ? 
      [Plot.areaX(accumulativeByDate[place], {x: "date", y: "totalArticles", fill: "#83c8b6"})] :
      [
        Plot.areaX(accumulativeByDate.all, {x: "date", y: "totalArticles", fill: "#83c8b6"}),
        Plot.line(accumulativeByDate[place], {x: "date", y: "totalArticles", stroke: "#662483"}),
        Plot.text(accumulativeByDate[place], Plot.selectLast({
          x: "date",
          y: "totalArticles",
          text: d => place, textAnchor: "end", dx: 0, dy: -10,
          fontSize: "2rem"
        }))
      ],
    grid: true,
    marginLeft: 40,
    marginTop: 0,
    marginBottom: 30,
    width,
    height: 800
  }))

  plot.attr("style", "max-width:100%;height:auto;")
  plot.selectAll("g[aria-label='x-axis'] .tick text").attr("font-size", "1rem")
  plot.selectAll("g[aria-label='y-axis'] .tick text").attr("font-size", "0.8rem")

  // remove first y-axis value
  plot.selectAll("g[aria-label='y-axis'] .tick text").nodes()[0].remove()

  // remove last year
  const x = plot.selectAll("g[aria-label='x-axis'] .tick text").nodes().pop()
  x.remove()
  
  return html`
  <div id="data-content" class="d-flex flex-column align-items-start">
    <div class="card shadow-sm">
      <div class="card-body row">
      <div class="col-12">
        <h3>When did newspapers report accidents?</h3>
      </div>
        
      <div class="col-8">
      <p>The timeline shows the total number of accidents reported in our sample over time. Select a place above to see how local reports contributed to the total.</p>
      </div>
      
      <div class="col-4">
        <p class="small"><strong>Online volunteers read thousands of articles to create this dataset. Their comments helped shape this exhibition. We’ve shared some comments for a sense of the accidents they read about.</strong></p>
      </div>

      <div class="col-8">
        ${plot.node()}
      </div>
  
      <div class="col-4">
        <div class="col-12 d-flex flex-column align-items-center justify-content-center h-100 w-100">
            <div id="comment" class="d-flex flex-column align-items-center mt-auto"></div>
            <div id="commentProgress" class="mt-auto" style="background:#d4d7d1;height:5px;border-radius:5px"></div>
        </div>
      </div>

    </div>
  </div>
  `
}


function _4(backToStart){return(
backToStart()
)}

function _DEBUG(){return(
false
)}

function _delaySeconds(){return(
10
)}

function _delayFrames(delaySeconds){return(
delaySeconds * 60
)}

async function* _8(DEBUG,reloadComment,setHTML,delaySeconds,delayFrames,Promises,location)
{
  DEBUG ? console.log("RELOADER SETUP ------------------------------------") : undefined;
  
  let frame = 0,
    current = reloadComment();
  
  await setHTML(current);
  DEBUG ? console.log("current received in reloader before while", current) : undefined;

  while (true) {
    frame++;
    //DEBUG ? console.log('in while loop') : undefined;
    const second = ~~(frame / 60);
    setHTML(current);
    if (second === delaySeconds) {
      current = reloadComment(current);
      DEBUG ? console.log("current received in reloader during while", current) : undefined;
      await setHTML(current);
      frame = 0;
    }

    const percentDone = +(frame / delayFrames).toFixed(3)
    let elem = document.querySelector("#commentProgress")
    
    elem.style.width = percentDone * 100 + "%";
    if (!elem) {
      elem = await Promises.delay(500, document.querySelector("#commentProgress"));
      if (!elem) {
        elem = await Promises.delay(750, document.querySelector("#commentProgress"));
        if (!elem) {
          elem = await Promises.delay(1000, document.querySelector("#commentProgress"));
          if (!elem) {
            // last minute resort
            location.reload();
          }
        }
      }
    }
    
    yield percentDone
  }
}


function _m(_,accumulativeByDate){return(
new Map([
  ["Choose...", "all"],
  ..._.zip(Object.keys(accumulativeByDate).filter(o => o !== "all"), Object.keys(accumulativeByDate).filter(o => o !== "all"))
])
)}

function _dataSelector(html){return(
() => {
  const select = html`
    <select class="form-select" aria-label="Example select with button addon">
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
)}

async function _accumulativeByDate(FileAttachment)
{
  const accumulativeByDate = await FileAttachment("accumulativeByDate@1.json").json()

  const obj = Object.fromEntries(
    Object.entries(accumulativeByDate)
      .map(([place, o]) => [place, o.map(d => Object.assign(d, { date: new Date(d.date) }))]))

  return obj
}


function _breadCrumb(html){return(
({
  active = ""
}={}) => html`<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="#slide2">Explore sample data</a></li>
      <li class="breadcrumb-item active" aria-current="page">${active}</li>
    </ol>
  </nav>`
)}

function _backToStart(html){return(
() => html`<footer class="mt-auto">
    <p><a class="me-4 btn btn btn-warning rounded-4 shadow" href="#slide2">Back to start</a></p>
  </footer>`
)}

function _getNewSample(_,zooniverseComments,DEBUG){return(
(current) => {
  const sample = _.sample(zooniverseComments);
  
  DEBUG ? console.log("getNewSample called with current", current) : undefined;
  DEBUG ? console.log("getNewSample chose", sample, sample === current) : undefined;
  
  if (sample === current) {
    DEBUG ? console.log("———> in getNewSample's conditional") : undefined;
    while (sample === current) {
      DEBUG ? console.log("———>  ———>  in getNewSample's while loop") : undefined;
      const sample = _.sample(zooniverseComments);
      current = sample
    }
  }
  current = sample;
  DEBUG ? console.log("getNewSample setting current to", current) : undefined;
  return current;
}
)}

function _reloadComment(DEBUG,getNewSample){return(
(current) => {
  DEBUG ? console.log("reloadComment called with current", current) : undefined;
  const _return = current ? getNewSample(current) : getNewSample(undefined);
  DEBUG ? console.log("reloadComment got return value", _return) : undefined;
  return _return
}
)}

function _setHTML(DEBUG,Promises,location,moment){return(
async (current) => {
  DEBUG ? console.log("setHTML") : undefined;
  let elem = document.querySelector("#comment")
  
  if (!elem) {
    elem = await Promises.delay(500, document.querySelector("#comment"));
    if (!elem) {
      elem = await Promises.delay(750, document.querySelector("#comment"));
      if (!elem) {
        elem = await Promises.delay(1000, document.querySelector("#comment"));
        if (!elem) {
          // last minute resort
          location.reload();
        }
      }
    }
  }
  
  const _html = `
    <p class="small d-flex flex-column align-items-center">
      <span class="text-muted">On an accident reported on</span>
      <span><strong>${moment(current.datePublished).format("D MMMM YYYY")}</strong>, </span>
      <span class="text-muted">a Zooniverse volunteer commented</span></p>
    <p class="text-center">${current.comment}</p>
      <p class="small pt-4 mt-4 border-top border-warning">Zooniverse volunteer</p>`
    
  document.querySelector("#comment").innerHTML = _html;

  return true;
}
)}

function _zooniverseComments(FileAttachment){return(
FileAttachment("zooniverse-comments@1.csv").csv()
)}

function _18(Promises){return(
Promises.delay(299)
)}

function _moment(require){return(
require("moment")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["accumulativeByDate@1.json", {url: new URL("./files/40e591aeb3b2f0075a899f5cb827e43346589691979de06e86eab50ce11936b2642248aabf11ddca0540d0818f03b3542d2635460171799c767f9fc3afac0742.json", import.meta.url), mimeType: "application/json", toString}],
    ["zooniverse-comments@1.csv", {url: new URL("./files/ac187a9ba708a0eaf9f3a7fbab9a6882243482026437f1785e0aed7802256dfff2f0b4f9e825ae182a99f9a75db8f9b9d879804ea4cd250018c2f3bd5ce51fbe.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["breadCrumb"], _1);
  main.variable(observer("viewof place")).define("viewof place", ["Inputs","m","html","d3","Event"], _place);
  main.variable(observer("place")).define("place", ["Generators", "viewof place"], (G, _) => G.input(_));
  main.variable(observer()).define(["d3","Plot","place","accumulativeByDate","width","html"], _3);
  main.variable(observer()).define(["backToStart"], _4);
  main.variable(observer("DEBUG")).define("DEBUG", _DEBUG);
  main.variable(observer("delaySeconds")).define("delaySeconds", _delaySeconds);
  main.variable(observer("delayFrames")).define("delayFrames", ["delaySeconds"], _delayFrames);
  main.variable(observer()).define(["DEBUG","reloadComment","setHTML","delaySeconds","delayFrames","Promises","location"], _8);
  main.variable(observer("m")).define("m", ["_","accumulativeByDate"], _m);
  main.variable(observer("dataSelector")).define("dataSelector", ["html"], _dataSelector);
  main.variable(observer("accumulativeByDate")).define("accumulativeByDate", ["FileAttachment"], _accumulativeByDate);
  main.variable(observer("breadCrumb")).define("breadCrumb", ["html"], _breadCrumb);
  main.variable(observer("backToStart")).define("backToStart", ["html"], _backToStart);
  main.variable(observer("getNewSample")).define("getNewSample", ["_","zooniverseComments","DEBUG"], _getNewSample);
  main.variable(observer("reloadComment")).define("reloadComment", ["DEBUG","getNewSample"], _reloadComment);
  main.variable(observer("setHTML")).define("setHTML", ["DEBUG","Promises","location","moment"], _setHTML);
  main.variable(observer("zooniverseComments")).define("zooniverseComments", ["FileAttachment"], _zooniverseComments);
  main.variable(observer()).define(["Promises"], _18);
  main.variable(observer("moment")).define("moment", ["require"], _moment);
  return main;
}
