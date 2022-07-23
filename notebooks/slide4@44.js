function _1(breadCrumb) {
  return (
    breadCrumb({ active: "Who" })
  )
}

function _decade(decadeSelector, genderAgeByDecade) {
  return (
    decadeSelector(genderAgeByDecade.map(d => d.decade))
  )
}

function _3(d3, _, genderAgeByDecade, Plot, counts, width, html, decade) {
  const maxCount = d3.max(
    _.flatMap(
      genderAgeByDecade,
      d => d.counts.map(o => o.count)));

  const p = Plot.plot({
    x: {
      axis: null,
      domain: counts.age,
    },
    y: {
      // grid: true,
      domain: [0, maxCount + 1],
      ticks: false
    },
    facet: {
      data: counts,
      x: "gender",
      marginBottom: 40,
      label: "",
    },
    marks: [
      Plot.barY(counts, {
        x: "age",
        y: "count",
        fill: d => d.age === "adult" ? d.gender === "female" ? "#83c8b6" : "#cc8abb" : d.gender === "female" ? "#71ad9c" : "#662483",
        rx: 12
      }),
      // Plot.ruleY([0]),
      Plot.text(counts, { x: "age", y: d => d.count + 0.5, text: d => d.label })
    ],
    insetBottom: 10,
    width,
    marginLeft: 0,
    style: {
      fontFamily: "GT Walsheim, Zen Kaku Gothic New, sans-serif"
    }
  })

  d3.select(p).selectAll("svg > g > g > text").style("font-size", "15px");

  d3.select(p).selectAll("svg > g[aria-label='y-axis']").style("display", "none");

  return html`
    <div id="data-content" class="d-flex flex-row align-items-start" style="">
      <div class="card shadow-sm col-12 me-3">
        <div class="card-header">
          Who was affected by accidents between ${decade} and ${+decade + 10}?
        </div>
        <div class="card-body row m-2">
          <div class="col-8">
            ${p}
          </div>
          <div class="col-4">
            <h3>Who was affected by accidents?</h3>
            <p>Who was affected by accidents involving machinery? We gathered data via a crowdsourcing task to plot age and gender distributions.</p>
            <p><em>Press different decades above to see different results.</em></p>
          </div>
        </div>
      </div>
    </div>`;
}


function _4(backToStart) {
  return (
    backToStart()
  )
}

function _counts(genderAgeByDecade, decade) {
  return (
    genderAgeByDecade.find(d => d.decade === `${decade}`).counts
  )
}

function _decadeSelector(html) {
  return (
    (decadeList = [1830, 1840, 1850, 1860, 1870, 1880, 1890, 1900, 1910]) => {
      const buttons = decadeList
        .map(decade => html`<button type="button" class="btn btn-light" value="${decade}">${decade}s</button>`);

      const control = html`<div class="btn-group" role="group" aria-label="Select a decade">${buttons}</div>`;
      buttons.forEach(button => {
        button.onclick = (evt) => {
          evt && evt.preventDefault(); // avoid dispatching 'click' event outside
          control.value = +button.value;
          control.dispatchEvent(new CustomEvent('input'));
        }
      })

      // if (!control.value)
      //   control.value = 1830

      return Object.assign(control, {
        value: 1830
      });
    }
  )
}

function _genderAgeByDecade(FileAttachment) {
  return (
    FileAttachment("genderAgeByDecade.json").json()
  )
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

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["genderAgeByDecade.json", { url: new URL("./files/8111d1400c78dd08a3020c40bb37acf92a13c81a59915e5697713c80bfa575285c606bdf8206dcc5af473486fc78c4b34906f54d7b04e99e7f891d37fb8e9e92.json", import.meta.url), mimeType: "application/json", toString }]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["breadCrumb"], _1);
  main.variable(observer("viewof decade")).define("viewof decade", ["decadeSelector", "genderAgeByDecade"], _decade);
  main.variable(observer("decade")).define("decade", ["Generators", "viewof decade"], (G, _) => G.input(_));
  main.variable(observer()).define(["d3", "_", "genderAgeByDecade", "Plot", "counts", "width", "html", "decade"], _3);
  main.variable(observer()).define(["backToStart"], _4);
  main.variable(observer("counts")).define("counts", ["genderAgeByDecade", "decade"], _counts);
  main.variable(observer("decadeSelector")).define("decadeSelector", ["html"], _decadeSelector);
  main.variable(observer("genderAgeByDecade")).define("genderAgeByDecade", ["FileAttachment"], _genderAgeByDecade);
  main.variable(observer("breadCrumb")).define("breadCrumb", ["html"], _breadCrumb);
  main.variable(observer("backToStart")).define("backToStart", ["html"], _backToStart);
  return main;
}
