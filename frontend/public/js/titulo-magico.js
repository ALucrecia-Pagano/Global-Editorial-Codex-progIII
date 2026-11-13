/**
 * Título mágico para Editorial Codex.
 * Estela ancha y difuminada de "polvo de hadas" que cruza todo el encabezado
 * (.marca) con dos capas <canvas>: la de atrás por debajo de las letras y la de
 * adelante por encima. La emisión se interpola entre la posición anterior y la
 * actual de la cabeza, repartida en 4-6 puntos, para que la estela sea continua.
 * Se repite cada 16 s (primera pasada a los 800 ms), solo anima con el
 * encabezado a la vista y respeta prefers-reduced-motion.
 *
 * Rendimiento: cada tipo de partícula se dibuja UNA vez en un canvas fuera de
 * pantalla (sprite) y en el loop solo se usa globalAlpha + drawImage. Un único
 * array reutilizado; las muertas se borran con swap-and-pop.
 */
(function () {
  'use strict';

  var SELECTOR_TITULO = '.marca__codex';
  var SELECTOR_ENCABEZADO = '.marca';
  var COLORES = ['#f6d27a', '#ffe9a8', '#d4a446', '#fff6dc', '#c48a2e'];
  var COLOR_LUCIERNAGA = '255, 234, 176'; // #ffeab0
  var COLOR_BRUMA = '246, 210, 122';
  var DURACION = 6400;
  var INTERVALO = 16000;
  var ARRANQUE = 800;
  var POR_CUADRO = 12;
  var MAX_PARTICULAS = 450;
  var POR_CUADRO_MOVIL = 6;
  var MAX_PARTICULAS_MOVIL = 220;
  var ANCHO_MOVIL = 768;
  var DPR_MAXIMO = 1.5;
  var FRANJA = 20;
  var BORDE = 30;

  // Proporciones: 72 % polvo, 14 % estrellitas, 8 % luciérnagas, 6 % bruma.
  var P_BRUMA = 0.06;
  var P_ESTRELLA = 0.14;
  var P_LUCIERNAGA = 0.08;

  var TAM_LUCIERNAGA = 24;
  var TAM_ESTRELLA = 16;
  var TAM_BRUMA = 32;
  var TAM_POLVO = 4;

  var TIPO_POLVO = 0;
  var TIPO_ESTRELLA = 1;
  var TIPO_LUCIERNAGA = 2;
  var TIPO_BRUMA = 3;

  function prefiereMovimientoReducido() {
    return typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function alAzar(minimo, maximo) {
    return minimo + Math.random() * (maximo - minimo);
  }

  function triangular() {
    return Math.random() + Math.random() - 1;
  }

  function ahoraMs() {
    return window.performance && window.performance.now
      ? window.performance.now()
      : Date.now();
  }

  /* ---------- Sprites (se dibujan una sola vez, fuera del DOM) ---------- */

  function lienzo(tam) {
    var c = document.createElement('canvas');
    c.width = tam;
    c.height = tam;
    return c;
  }

  function spriteLuciernaga() {
    var c = lienzo(TAM_LUCIERNAGA);
    var ctx = c.getContext('2d');
    var m = TAM_LUCIERNAGA / 2;
    var g = ctx.createRadialGradient(m, m, 0, m, m, m);
    g.addColorStop(0, 'rgba(' + COLOR_LUCIERNAGA + ', 1)');
    g.addColorStop(0.14, 'rgba(' + COLOR_LUCIERNAGA + ', 1)');
    g.addColorStop(0.3, 'rgba(' + COLOR_LUCIERNAGA + ', 0.45)');
    g.addColorStop(0.6, 'rgba(' + COLOR_LUCIERNAGA + ', 0.12)');
    g.addColorStop(1, 'rgba(' + COLOR_LUCIERNAGA + ', 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, TAM_LUCIERNAGA, TAM_LUCIERNAGA);
    return c;
  }

  function spriteEstrella(color) {
    var c = lienzo(TAM_ESTRELLA);
    var ctx = c.getContext('2d');
    var m = TAM_ESTRELLA / 2;
    var rInterior = m * 0.42;
    ctx.fillStyle = color;
    ctx.beginPath();
    for (var i = 0; i < 8; i += 1) {
      var radio = (i % 2 === 0) ? m : rInterior;
      var ang = (Math.PI / 4) * i - Math.PI / 2;
      var px = m + Math.cos(ang) * radio;
      var py = m + Math.sin(ang) * radio;
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fill();
    return c;
  }

  function spriteBruma() {
    var c = lienzo(TAM_BRUMA);
    var ctx = c.getContext('2d');
    var m = TAM_BRUMA / 2;
    var g = ctx.createRadialGradient(m, m, 0, m, m, m);
    g.addColorStop(0, 'rgba(' + COLOR_BRUMA + ', 1)');
    g.addColorStop(1, 'rgba(' + COLOR_BRUMA + ', 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, TAM_BRUMA, TAM_BRUMA);
    return c;
  }

  function spritePolvo(color) {
    var c = lienzo(TAM_POLVO);
    var ctx = c.getContext('2d');
    var m = TAM_POLVO / 2;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(m, m, m, 0, Math.PI * 2);
    ctx.fill();
    return c;
  }

  function crearSprites() {
    return {
      luciernaga: spriteLuciernaga(),
      bruma: spriteBruma(),
      estrellas: COLORES.map(spriteEstrella),
      polvo: COLORES.map(spritePolvo)
    };
  }

  /* ---------- Letras y capas ---------- */

  function envolverLetras(titulo) {
    var texto = titulo.textContent;
    if (!texto) {
      return false;
    }
    while (titulo.firstChild) {
      titulo.removeChild(titulo.firstChild);
    }
    for (var i = 0; i < texto.length; i += 1) {
      var letra = document.createElement('span');
      letra.className = 'titulo-magico__letra';
      letra.textContent = texto.charAt(i);
      titulo.appendChild(letra);
    }
    return true;
  }

  function crearCapa(nombre, encabezado) {
    var canvas = document.createElement('canvas');
    canvas.className = 'titulo-magico__capa titulo-magico__capa--' + nombre;
    canvas.setAttribute('aria-hidden', 'true');
    encabezado.appendChild(canvas);
    return canvas;
  }

  function iniciar() {
    if (prefiereMovimientoReducido()) {
      return;
    }
    var encabezado = document.querySelector(SELECTOR_ENCABEZADO);
    var titulo = document.querySelector(SELECTOR_TITULO);
    if (!encabezado || !titulo || !envolverLetras(titulo)) {
      return;
    }

    var sprites = crearSprites();
    var canvasAtras = crearCapa('atras', encabezado);
    var canvasFrente = crearCapa('frente', encabezado);
    var ctxAtras = canvasAtras.getContext('2d');
    var ctxFrente = canvasFrente.getContext('2d');

    var ancho = 0;
    var alto = 0;
    var centroY = 0;
    var letras = [];
    var porCuadro = POR_CUADRO;
    var maximo = MAX_PARTICULAS;

    var particulas = [];
    var travesia = false;
    var inicioTravesia = 0;
    var anterior = null;
    var cabezaAnterior = null;
    var idFrame = null;
    var visible = true;

    function medir() {
      var rectEncabezado = encabezado.getBoundingClientRect();
      ancho = encabezado.clientWidth || rectEncabezado.width;
      alto = encabezado.clientHeight || rectEncabezado.height;
      if (ancho <= 0 || alto <= 0) {
        return false;
      }
      var dpr = Math.min(window.devicePixelRatio || 1, DPR_MAXIMO);
      var movil = window.innerWidth < ANCHO_MOVIL;
      porCuadro = movil ? POR_CUADRO_MOVIL : POR_CUADRO;
      maximo = movil ? MAX_PARTICULAS_MOVIL : MAX_PARTICULAS;

      [canvasAtras, canvasFrente].forEach(function (canvas) {
        canvas.style.width = ancho + 'px';
        canvas.style.height = alto + 'px';
        canvas.width = Math.round(ancho * dpr);
        canvas.height = Math.round(alto * dpr);
      });
      ctxAtras.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxFrente.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxAtras.globalCompositeOperation = 'lighter';
      ctxFrente.globalCompositeOperation = 'lighter';

      var rectTitulo = titulo.getBoundingClientRect();
      centroY = rectTitulo.top - rectEncabezado.top + rectTitulo.height / 2;

      letras = [];
      var spans = titulo.querySelectorAll('.titulo-magico__letra');
      for (var i = 0; i < spans.length; i += 1) {
        var r = spans[i].getBoundingClientRect();
        var izq = r.left - rectEncabezado.left;
        letras.push({
          char: spans[i].textContent.toUpperCase(),
          izq: izq,
          der: izq + r.width,
          medio: izq + r.width / 2
        });
      }
      return true;
    }

    // DELANTE: fuera de las letras, sobre la C, la mitad izquierda de la O y la X.
    // DETRÁS: sobre la mitad derecha de la O, la D y la E.
    function ctxDe(x) {
      for (var i = 0; i < letras.length; i += 1) {
        var l = letras[i];
        if (x >= l.izq && x <= l.der) {
          if (l.char === 'D' || l.char === 'E') {
            return ctxAtras;
          }
          if (l.char === 'O') {
            return x < l.medio ? ctxFrente : ctxAtras;
          }
          return ctxFrente;
        }
      }
      return ctxFrente;
    }

    function crear(x, y) {
      var r = Math.random();
      var p = {
        tipo: TIPO_POLVO,
        x: x,
        y: y,
        baseX: x,
        vx: alAzar(-6, 6),
        vy: alAzar(-16, -3),
        tam: 0,
        sprite: null,
        fase: Math.random() * Math.PI * 2,
        vida: 0,
        vidaMax: 0
      };
      var color = Math.floor(Math.random() * COLORES.length);
      if (r < P_BRUMA) {
        p.tipo = TIPO_BRUMA;
        p.vx = alAzar(-4, 4);
        p.vy = alAzar(-10, -2);
        p.tam = alAzar(12, 28);
        p.sprite = sprites.bruma;
        p.vidaMax = alAzar(1.5, 2.5);
      } else if (r < P_BRUMA + P_ESTRELLA) {
        p.tipo = TIPO_ESTRELLA;
        p.tam = alAzar(4, 9);
        p.sprite = sprites.estrellas[color];
        p.vidaMax = alAzar(1.8, 3);
      } else if (r < P_BRUMA + P_ESTRELLA + P_LUCIERNAGA) {
        p.tipo = TIPO_LUCIERNAGA;
        p.vx = alAzar(-4, 4);
        p.vy = -alAzar(14, 36);
        p.tam = TAM_LUCIERNAGA;
        p.sprite = sprites.luciernaga;
        p.vidaMax = alAzar(2, 3.5);
      } else {
        p.tam = alAzar(1.2, 3.6);
        p.sprite = sprites.polvo[color];
        p.vidaMax = alAzar(1.2, 2.2);
      }
      return p;
    }

    function emitir(cabeza) {
      var puntos = 4 + Math.floor(Math.random() * 3);
      var x0 = cabezaAnterior ? cabezaAnterior.x : cabeza.x;
      var y0 = cabezaAnterior ? cabezaAnterior.y : cabeza.y;
      for (var i = 0; i < porCuadro && particulas.length < maximo; i += 1) {
        var f = puntos > 1 ? (i % puntos) / (puntos - 1) : 0;
        var bx = x0 + (cabeza.x - x0) * f;
        var by = y0 + (cabeza.y - y0) * f;
        particulas.push(crear(bx + triangular() * FRANJA, by + triangular() * FRANJA));
      }
    }

    function opacidad(p) {
      var entrada = Math.min(1, p.vida / 0.2);
      var salida = 1 - p.vida / p.vidaMax;
      return entrada * salida;
    }

    // Avanza y dibuja; devuelve false si la partícula murió.
    function paso(p, dt) {
      p.vida += dt;
      if (p.vida >= p.vidaMax) {
        return false;
      }
      p.y += p.vy * dt;
      if (p.tipo === TIPO_LUCIERNAGA) {
        p.baseX += p.vx * dt;
        p.x = p.baseX + Math.sin(p.vida * 3 + p.fase) * 8;
      } else {
        p.x += p.vx * dt;
      }

      var alpha = opacidad(p);
      if (p.tipo === TIPO_ESTRELLA) {
        alpha *= 0.55 + 0.45 * Math.sin(p.vida * 7 + p.fase);
      } else if (p.tipo === TIPO_LUCIERNAGA) {
        alpha *= 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(p.vida * 3 + p.fase));
      } else if (p.tipo === TIPO_BRUMA) {
        alpha *= 0.18;
      }
      if (alpha > 0) {
        var ctx = ctxDe(p.x);
        var medio = p.tam / 2;
        ctx.globalAlpha = alpha;
        ctx.drawImage(p.sprite, p.x - medio, p.y - medio, p.tam, p.tam);
      }
      return true;
    }

    function detener() {
      if (idFrame !== null) {
        window.cancelAnimationFrame(idFrame);
        idFrame = null;
      }
    }

    function cuadro(ahora) {
      idFrame = null;
      if (document.hidden || !visible) {
        return;
      }
      if (anterior === null) {
        anterior = ahora;
      }
      var dt = Math.min((ahora - anterior) / 1000, 0.05);
      anterior = ahora;

      ctxAtras.clearRect(0, 0, ancho, alto);
      ctxFrente.clearRect(0, 0, ancho, alto);

      if (travesia) {
        var progreso = (ahora - inicioTravesia) / DURACION;
        if (progreso <= 1) {
          var cabeza = {
            x: -BORDE + progreso * (ancho + BORDE * 2),
            y: centroY + 45 * Math.sin(progreso * Math.PI * 3.2) + 15 * Math.sin(progreso * Math.PI * 9)
          };
          emitir(cabeza);
          cabezaAnterior = cabeza;
        } else {
          travesia = false;
          cabezaAnterior = null;
        }
      }

      var i = 0;
      while (i < particulas.length) {
        if (paso(particulas[i], dt)) {
          i += 1;
        } else {
          particulas[i] = particulas[particulas.length - 1];
          particulas.pop();
        }
      }

      if (travesia || particulas.length > 0) {
        idFrame = window.requestAnimationFrame(cuadro);
      }
    }

    function asegurarLoop() {
      if (idFrame === null && !document.hidden && visible &&
          (travesia || particulas.length > 0)) {
        anterior = null;
        idFrame = window.requestAnimationFrame(cuadro);
      }
    }

    function lanzarTravesia() {
      if (document.hidden || !visible || !medir()) {
        return;
      }
      travesia = true;
      cabezaAnterior = null;
      inicioTravesia = ahoraMs();
      asegurarLoop();
    }

    function alRedimensionar() {
      particulas.length = 0;
      medir();
      cabezaAnterior = null;
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        detener();
      } else {
        asegurarLoop();
      }
    });
    window.addEventListener('resize', alRedimensionar);

    if (typeof window.IntersectionObserver === 'function') {
      var observador = new window.IntersectionObserver(function (entradas) {
        visible = entradas[entradas.length - 1].isIntersecting;
        if (visible) {
          asegurarLoop();
        } else {
          detener();
        }
      });
      observador.observe(encabezado);
    }

    medir();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(medir);
    }

    window.setTimeout(lanzarTravesia, ARRANQUE);
    window.setInterval(lanzarTravesia, INTERVALO);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
