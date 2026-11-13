/**
 * Título mágico para Editorial Codex.
 * Estela ancha, abundante y difuminada de "polvo de hadas" que cruza todo el
 * encabezado (.marca) con dos capas <canvas>: la de atrás por debajo de las
 * letras y la de adelante por encima. La emisión se interpola entre la posición
 * anterior y la actual de la cabeza, repartida en 4-6 puntos, para que la estela
 * sea continua; el polvo queda flotando y se desvanece de a poco. Se repite cada
 * 12 s (primera pasada a los 800 ms) y respeta prefers-reduced-motion.
 */
(function () {
  'use strict';

  var SELECTOR_TITULO = '.marca__codex';
  var SELECTOR_ENCABEZADO = '.marca';
  var COLORES = ['#f6d27a', '#ffe9a8', '#d4a446', '#fff6dc', '#c48a2e'];
  var BRUMA_RGB = '246, 210, 122';
  var DURACION = 6400;
  var INTERVALO = 12000;
  var MAX_PARTICULAS = 1200;
  var ARRANQUE = 800;
  var POR_CUADRO = 25;
  var FRANJA = 20;
  var BORDE = 30;

  var P_BRUMA = 0.08;
  var P_ESTRELLA = 0.36;
  var P_LUCIERNAGA = 0.22;

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

  function elegirColor() {
    return COLORES[Math.floor(Math.random() * COLORES.length)];
  }

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

    var canvasAtras = crearCapa('atras', encabezado);
    var canvasFrente = crearCapa('frente', encabezado);
    var ctxAtras = canvasAtras.getContext('2d');
    var ctxFrente = canvasFrente.getContext('2d');

    var ancho = 0;
    var alto = 0;
    var centroY = 0;
    var letras = [];
    var dpr = 1;

    var polvo = [];
    var brumas = [];
    var estrellas = [];
    var luciernagas = [];
    var travesia = false;
    var inicioTravesia = 0;
    var anterior = null;
    var cabezaAnterior = null;
    var idFrame = null;

    function total() {
      return polvo.length + brumas.length + estrellas.length + luciernagas.length;
    }

    function medir() {
      var rectEncabezado = encabezado.getBoundingClientRect();
      ancho = encabezado.clientWidth || rectEncabezado.width;
      alto = encabezado.clientHeight || rectEncabezado.height;
      if (ancho <= 0 || alto <= 0) {
        return false;
      }
      dpr = Math.min(window.devicePixelRatio || 1, 2);

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
    function capaDeX(x) {
      for (var i = 0; i < letras.length; i += 1) {
        var l = letras[i];
        if (x >= l.izq && x <= l.der) {
          if (l.char === 'D' || l.char === 'E') {
            return 'atras';
          }
          if (l.char === 'O') {
            return x < l.medio ? 'frente' : 'atras';
          }
          return 'frente';
        }
      }
      return 'frente';
    }

    function clasificar() {
      var r = Math.random();
      if (r < P_BRUMA) {
        return 'bruma';
      }
      if (r < P_BRUMA + P_ESTRELLA) {
        return 'estrella';
      }
      if (r < P_BRUMA + P_ESTRELLA + P_LUCIERNAGA) {
        return 'luciernaga';
      }
      return 'polvo';
    }

    function crearPolvo(x, y) {
      return {
        x: x,
        y: y,
        vx: alAzar(-6, 6),
        vy: alAzar(-16, -3),
        radio: alAzar(0.6, 1.8),
        color: elegirColor(),
        vida: 0,
        vidaMax: alAzar(1.5, 3)
      };
    }

    function crearBruma(x, y) {
      return {
        x: x,
        y: y,
        vx: alAzar(-4, 4),
        vy: alAzar(-10, -2),
        radio: alAzar(6, 14),
        vida: 0,
        vidaMax: alAzar(1.5, 3)
      };
    }

    function crearEstrella(x, y) {
      return {
        x: x,
        y: y,
        vx: alAzar(-6, 6),
        vy: alAzar(-16, -3),
        tamano: alAzar(2, 4.5),
        color: elegirColor(),
        fase: Math.random() * Math.PI * 2,
        vida: 0,
        vidaMax: alAzar(1.5, 3)
      };
    }

    function crearLuciernaga(x, y) {
      return {
        baseX: x,
        x: x,
        y: y,
        vx: alAzar(-4, 4),
        vy: -alAzar(14, 36),
        radio: 1.7,
        fase: Math.random() * Math.PI * 2,
        vida: 0,
        vidaMax: alAzar(1.5, 3)
      };
    }

    function agregar(tipo, x, y) {
      if (tipo === 'bruma') {
        brumas.push(crearBruma(x, y));
      } else if (tipo === 'estrella') {
        estrellas.push(crearEstrella(x, y));
      } else if (tipo === 'luciernaga') {
        luciernagas.push(crearLuciernaga(x, y));
      } else {
        polvo.push(crearPolvo(x, y));
      }
    }

    function emitir(cabeza) {
      var puntos = 4 + Math.floor(Math.random() * 3);
      var x0 = cabezaAnterior ? cabezaAnterior.x : cabeza.x;
      var y0 = cabezaAnterior ? cabezaAnterior.y : cabeza.y;
      for (var i = 0; i < POR_CUADRO; i += 1) {
        if (total() >= MAX_PARTICULAS) {
          break;
        }
        var indice = Math.floor(Math.random() * puntos);
        var f = puntos > 1 ? indice / (puntos - 1) : 0;
        var bx = x0 + (cabeza.x - x0) * f;
        var by = y0 + (cabeza.y - y0) * f;
        agregar(clasificar(), bx + triangular() * FRANJA, by + triangular() * FRANJA);
      }
    }

    function opacidad(p) {
      var entrada = Math.min(1, p.vida / 0.2);
      var salida = 1 - p.vida / p.vidaMax;
      return Math.max(0, entrada * salida);
    }

    function ctxDe(x) {
      return capaDeX(x) === 'frente' ? ctxFrente : ctxAtras;
    }

    function dibujarPolvo(p) {
      var alpha = opacidad(p);
      if (alpha <= 0) {
        return;
      }
      var ctx = ctxDe(p.x);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
      ctx.fill();
    }

    function dibujarBruma(p) {
      var alpha = opacidad(p) * 0.18;
      if (alpha <= 0) {
        return;
      }
      var ctx = ctxDe(p.x);
      var gradiente = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radio);
      gradiente.addColorStop(0, 'rgba(' + BRUMA_RGB + ', ' + alpha.toFixed(3) + ')');
      gradiente.addColorStop(1, 'rgba(' + BRUMA_RGB + ', 0)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = gradiente;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
      ctx.fill();
    }

    function dibujarEstrella(p) {
      var alpha = opacidad(p);
      if (alpha <= 0) {
        return;
      }
      var ctx = ctxDe(p.x);
      var r = p.tamano;
      var rInterior = r * 0.42;
      var parpadeo = 0.55 + 0.45 * Math.sin(p.vida * 7 + p.fase);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.globalAlpha = alpha * parpadeo;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      for (var i = 0; i < 8; i += 1) {
        var radio = (i % 2 === 0) ? r : rInterior;
        var ang = (Math.PI / 4) * i - Math.PI / 2;
        var px = Math.cos(ang) * radio;
        var py = Math.sin(ang) * radio;
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function dibujarLuciernaga(p) {
      var alpha = opacidad(p);
      if (alpha <= 0) {
        return;
      }
      var ctx = ctxDe(p.x);
      var pulso = 0.5 + 0.5 * Math.sin(p.vida * 3 + p.fase);
      ctx.save();
      ctx.globalAlpha = alpha * (0.55 + 0.45 * pulso);
      ctx.fillStyle = '#ffeab0';
      ctx.shadowColor = '#ffeab0';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function actualizar(p, dt) {
      p.vida += dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      return p.vida < p.vidaMax;
    }

    function actualizarLuciernaga(p, dt) {
      p.vida += dt;
      p.baseX += p.vx * dt;
      p.y += p.vy * dt;
      p.x = p.baseX + Math.sin(p.vida * 3 + p.fase) * 8;
      return p.vida < p.vidaMax;
    }

    function cuadro(ahora) {
      if (document.hidden) {
        idFrame = null;
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

      polvo = polvo.filter(function (p) {
        if (actualizar(p, dt)) {
          dibujarPolvo(p);
          return true;
        }
        return false;
      });
      brumas = brumas.filter(function (p) {
        if (actualizar(p, dt)) {
          dibujarBruma(p);
          return true;
        }
        return false;
      });
      estrellas = estrellas.filter(function (p) {
        if (actualizar(p, dt)) {
          dibujarEstrella(p);
          return true;
        }
        return false;
      });
      luciernagas = luciernagas.filter(function (p) {
        if (actualizarLuciernaga(p, dt)) {
          dibujarLuciernaga(p);
          return true;
        }
        return false;
      });

      if (travesia || total() > 0) {
        idFrame = window.requestAnimationFrame(cuadro);
      } else {
        idFrame = null;
      }
    }

    function asegurarLoop() {
      if (idFrame === null && !document.hidden) {
        anterior = null;
        idFrame = window.requestAnimationFrame(cuadro);
      }
    }

    function lanzarTravesia() {
      if (!medir()) {
        return;
      }
      travesia = true;
      cabezaAnterior = null;
      inicioTravesia = window.performance && window.performance.now
        ? window.performance.now()
        : Date.now();
      asegurarLoop();
    }

    function alRedimensionar() {
      polvo = [];
      brumas = [];
      estrellas = [];
      luciernagas = [];
      medir();
      cabezaAnterior = null;
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (idFrame !== null) {
          window.cancelAnimationFrame(idFrame);
          idFrame = null;
        }
      } else {
        asegurarLoop();
      }
    });
    window.addEventListener('resize', alRedimensionar);

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
