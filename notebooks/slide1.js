function _1(htl) {
  return (
    htl.html`<div class="mt-auto">
  <p>Imagine a time when machines were new, and injuries were common. Making machines safe took a long time, and a lot of work.</p>
</div>
<div class="mt-auto d-flex flex-column align-items-center pt-5">
  <a class="btn btn-xl btn-warning rounded-4 shadow" href="slide2.html">Touch to explore accidents involving machinery in the 1800s</a>
</div>`
  )
}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["htl"], _1);
  return main;
}
