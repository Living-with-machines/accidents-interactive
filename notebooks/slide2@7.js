function _1(htl) {
  return (
    htl.html`<div class="slide">
  <p>Where did newspapers report accidents involving machinery? We asked online volunteers to help us find out. Explore sample data.</p>
  <div class="d-flex flex-row align-items-baseline">
    <p><a class="me-4 btn btn-lg btn-warning rounded-4 shadow" href="slide3.html"><b>When</b> and <b>where</b> did newspapers report accidents?</a></p>
    <p><a class="me-4 btn btn-lg btn-warning rounded-4 shadow" href="slide4.html"><b>Who</b> was affected?</a></p>
    <p><a class="btn btn-lg btn-warning rounded-4 shadow" href="slide5.html">Factories or homes? Explore <b>accident sites</b></a></p>
  </div>
</div>`
  )
}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["htl"], _1);
  return main;
}
