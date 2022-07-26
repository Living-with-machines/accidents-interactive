function _1(htl) {
  return (
    htl.html`<div class="mt-auto">
<p class="mb-5">Where did newspapers report accidents involving machinery?</p>
<p style="font-size:80%" class="mb-4">We asked online volunteers to tag articles from selected regional newspapers. <em>Explore our early results.</em></p>
</div>
<div class="mt-auto d-flex flex-row align-items-center">
  <a class="btn btn-xl btn-warning rounded-4 shadow me-3" href="slide3.html" style="font-size: 1.5rem !important;"><b>When</b> did newspapers report accidents?</a></a>
  <a class="btn btn-xl btn-warning rounded-4 shadow me-3" href="slide4.html" style="font-size: 1.5rem !important;"><b>Who</b> was affected?</a>
  <a class="btn btn-xl btn-warning rounded-4 shadow" href="slide5.html" style="font-size: 1.5rem !important;">Factories or homes? Explore <b>accident sites</b></a>
</div>`
  )
}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["htl"], _1);
  return main;
}
