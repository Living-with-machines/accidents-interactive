function _1(htl) {
  return (
    htl.html`<div class="slide">
  <p>
    Imagine a time when machines were new, and injuries were common. Making machines safe took a long time, and a lot of work.
  </p>
  <p>
    <a class="btn btn-lg btn-warning rounded-4 shadow" href="slide2.html">Touch to explore accidents involving machinery in the 1800s</a>
  </p>
</div>`
  )
}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["htl"], _1);
  return main;
}
