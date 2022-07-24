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

function _3(html, getChart, decadeSelected) {
  const elem = html`
    <div id="data-content" class="d-flex flex-row align-items-start" style="">
      <div class="card shadow-sm col-11">
        <div class="card-header">
          Accident sites
        </div>
        <div class="card-body row">
          <div class="col-12 row" style="height: 370px;">
            <div class="col-4">
              <p><em>Where do you think more accidents involving machinery happened?</em> The circles to the right are sized by the number of accidents reported in different sites.</p>
              <p><em>Tap a decade to how this changed over time. Can you guess what kind of site had the most or least accidents reported? Tap a circle to see if you were right.</em></p>
            </div>
            <div class="col-8">
              ${getChart({ decade: decadeSelected })}
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

  return elem;
}


function _4(backToStart) {
  return (
    backToStart()
  )
}

function _getChart(d3, svg, categoryDataByDecade) {
  return (
    ({
      decade = 1830,
      width = 600,
      height = 400,
      padding = 5,
    } = {}) => {

      //const svg = d3.select(DOM.svg(width, height));

      const SVG = d3
        .select(svg`<svg
        width=${width}
        height=${height}
        viewBox="0,0,${width},${height}"
        style="max-width:100%;height:auto;"
        >`)

      const categoryData = categoryDataByDecade[decade]

      // const top3 = categoryData.children[0].children
      //    .slice(0, 3)
      //    .map(d => d.category)

      const packing = d3.pack()
        .size([width, height]) // width, height
        .padding(padding)

      const pack = () => packing(d3.hierarchy(categoryData).sum(d => d.value))

      const root = pack();

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
  main.variable(observer()).define(["html", "getChart", "decadeSelected"], _3);
  main.variable(observer()).define(["backToStart"], _4);
  main.variable(observer("getChart")).define("getChart", ["d3", "svg", "categoryDataByDecade"], _getChart);
  main.variable(observer("categoryDataByDecade")).define("categoryDataByDecade", ["FileAttachment"], _categoryDataByDecade);
  main.variable(observer("decadeSelector")).define("decadeSelector", ["html"], _decadeSelector);
  main.variable(observer("breadCrumb")).define("breadCrumb", ["html"], _breadCrumb);
  main.variable(observer("backToStart")).define("backToStart", ["html"], _backToStart);
  return main;
}
