function _1(breadCrumb) {
  return (
    breadCrumb({ active: "Accident sites" })
  )
}

function _decadeSelected(decadeSelector, categoryDataByDecade) {
  return (
    decadeSelector(Object.keys(categoryDataByDecade))
  )
}

function _3(html, getChart, decadeSelected, d3) {
  const elem = html`
    <div id="data-content" class="d-flex flex-row align-items-start" style="">
      <div class="card shadow-sm col-11">
        <div class="card-body row m-2">
          <div class="col-8">
            ${getChart({ decade: decadeSelected })}
          </div>
          <div class="col-4">
            <h3>Accident sites</h3>
            <p><em>In which kinds of sites do you think the most accidents took place?</em> The graphic to the left represents the amount of reporting around accidents in different sites.</p>

<p><em>Switch the decades above, and then guess which kind of site the biggest circle represents. Tap it to see if you were right.</p>
          </div>
        </div>
      </div>
    </div>`

  d3.select(elem).select("svg").attr("style", "max-width:100%;height:auto;") // make responsive

  return elem;
}


function _4(backToStart) {
  return (
    backToStart()
  )
}

function _getChart(categoryDataByDecade, d3, width, DOM) {
  return (
    ({
      decade = 1830,
      // width = 300,
      height = 400,
      padding = 5,
    } = {}) => {

      const categoryData = categoryDataByDecade[decade]

      const top3 = categoryData.children[0].children.slice(0, 3).map(d => d.category)

      const packing = d3.pack()
        .size([width, height]) // width, height
        .padding(padding)

      const pack = () => packing(d3.hierarchy(categoryData).sum(d => d.value))

      const root = pack();

      const svg = d3.select(DOM.svg(width, height));

      // add gradients
      svg.append("defs")
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

      const circleG = svg.append("g")

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
            // .attr("style", d => d === selected.datum() || top3.includes(d.data.category) ? 
            //       "display: block; cursor: pointer; pointer-events: none;" :
            //       "display: none")
            .attr("style", d => d === selected.datum() ?
              "display: block; cursor: pointer; pointer-events: none;" :
              "display: none")
            .attr("font-weight", d => d === selected.datum() ? "700" : "400")
        })
        .on("mouseout", function () {
          circle.attr("opacity", 1)
          text
            // .attr("style", d => top3.includes(d.data.category) ? "display: block; cursor: pointer; pointer-events: none;" : "display: none;")
            .attr("font-weight", "400")
        })

      const text = svg.append("g")
        .selectAll("text")
        .data(root.leaves().filter(d => d.data.value))
        .join("text")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("text-anchor", "middle")
        .attr("font-family", "GT Walsheim")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .attr("style", "display: none")
        //.attr("style", d => top3.includes(d.data.category) ? "display: block; cursor: pointer; pointer-events: none;" : "display: none;")
        .text(d => d.data.category)

      return svg.node();
    }
  )
}

async function _categoryDataByDecade(FileAttachment) {
  const categoryDataByDecade = await FileAttachment("categoryDataByDecade.json").json()

  return Object.fromEntries(categoryDataByDecade)
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

      return Object.assign(control, {
        value: 1830
      });
    }
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
    ["categoryDataByDecade.json", { url: new URL("./files/de1bce695c6bf745bfcbe77c2758d4893c279c6f3cfa38d18e42ede7f976c53932f573f9444a9745662c5eae73fb3e4615bd752b75a3b5efc405a1c32b884cb1.json", import.meta.url), mimeType: "application/json", toString }]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["breadCrumb"], _1);
  main.variable(observer("viewof decadeSelected")).define("viewof decadeSelected", ["decadeSelector", "categoryDataByDecade"], _decadeSelected);
  main.variable(observer("decadeSelected")).define("decadeSelected", ["Generators", "viewof decadeSelected"], (G, _) => G.input(_));
  main.variable(observer()).define(["html", "getChart", "decadeSelected", "d3"], _3);
  main.variable(observer()).define(["backToStart"], _4);
  main.variable(observer("getChart")).define("getChart", ["categoryDataByDecade", "d3", "width", "DOM"], _getChart);
  main.variable(observer("categoryDataByDecade")).define("categoryDataByDecade", ["FileAttachment"], _categoryDataByDecade);
  main.variable(observer("decadeSelector")).define("decadeSelector", ["html"], _decadeSelector);
  main.variable(observer("breadCrumb")).define("breadCrumb", ["html"], _breadCrumb);
  main.variable(observer("backToStart")).define("backToStart", ["html"], _backToStart);
  return main;
}
