(function () {
  var raiz = document.documentElement;
  var quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fino = matchMedia("(pointer: fine)").matches;

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  }, { threshold: 0.1 });
  function mirar() {
    document.querySelectorAll("[data-ver]:not(.visible)").forEach(function (el) { observador.observe(el); });
  }
  mirar();

  var punto = document.querySelector(".punto");
  var aro = document.querySelector(".aro");
  if (punto && aro && fino && !quieto) {
    addEventListener("mousemove", function (e) {
      punto.style.transform = "translate3d(" + e.clientX + "px," + e.clientY + "px,0)";
      aro.animate({ transform: "translate3d(" + e.clientX + "px," + e.clientY + "px,0)" }, { duration: 420, fill: "forwards" });
      raiz.style.setProperty("--mx", e.clientX + "px");
      raiz.style.setProperty("--my", e.clientY + "px");
    });
  }

  var boton = document.querySelector(".menu");
  var panel = document.querySelector(".panel");
  if (boton && panel) {
    function cerrar() {
      boton.classList.remove("abierto");
      panel.classList.remove("abierto");
      boton.setAttribute("aria-expanded", "false");
      boton.setAttribute("aria-label", "Abrir menú");
      panel.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
    boton.addEventListener("click", function () {
      var abierto = !panel.classList.contains("abierto");
      boton.classList.toggle("abierto", abierto);
      panel.classList.toggle("abierto", abierto);
      boton.setAttribute("aria-expanded", String(abierto));
      boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
      panel.setAttribute("aria-hidden", String(!abierto));
      document.body.style.overflow = abierto ? "hidden" : "";
    });
    panel.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", cerrar); });
  }

  document.querySelectorAll(".categoria").forEach(function (caja) {
    var llave = caja.querySelector("button");
    var vistazo = caja.querySelector(".vistazo");
    if (!llave || !vistazo) return;
    llave.addEventListener("click", function () {
      var abierta = !caja.classList.contains("abierta");
      document.querySelectorAll(".categoria.abierta").forEach(function (otra) {
        otra.classList.remove("abierta");
        otra.querySelector("button").setAttribute("aria-expanded", "false");
        otra.querySelector(".vistazo").hidden = true;
      });
      caja.classList.toggle("abierta", abierta);
      llave.setAttribute("aria-expanded", String(abierta));
      vistazo.hidden = !abierta;
    });
  });

  var filtros = document.querySelectorAll(".filtros button");
  if (filtros.length) {
    filtros.forEach(function (f) {
      f.addEventListener("click", function () {
        filtros.forEach(function (o) { o.classList.remove("activo"); });
        f.classList.add("activo");
        var rubro = f.dataset.filtro;
        var cuenta = 0;
        document.querySelectorAll(".pieza").forEach(function (p) {
          var entra = rubro === "Todo" || p.dataset.rubro === rubro;
          p.hidden = !entra;
          if (entra) {
            cuenta++;
            p.querySelector(".num").textContent = String(cuenta).padStart(2, "0");
            p.style.transitionDelay = ((cuenta - 1) % 4) * 60 + "ms";
            p.classList.add("visible");
          }
        });
      });
    });
  }

  var visor = document.querySelector(".visor");
  if (visor) {
    var foto = visor.querySelector("img");
    var rubro = visor.querySelector(".visor-txt span");
    var nombre = visor.querySelector(".visor-txt h2");
    var precio = visor.querySelector(".visor-txt p");
    document.querySelectorAll(".fila").forEach(function (fila) {
      function elegir() {
        document.querySelectorAll(".fila.activa").forEach(function (o) { o.classList.remove("activa"); });
        fila.classList.add("activa");
        if (foto.getAttribute("src") !== fila.dataset.foto) {
          foto.setAttribute("src", fila.dataset.foto);
          foto.style.animation = "none";
          void foto.offsetWidth;
          foto.style.animation = "";
        }
        foto.alt = fila.dataset.nombre;
        rubro.textContent = fila.dataset.rubro;
        nombre.textContent = fila.dataset.nombre;
        precio.textContent = "$" + fila.dataset.precio;
      }
      fila.addEventListener("mouseenter", elegir);
      fila.querySelector("button").addEventListener("click", elegir);
    });
  }
})();
