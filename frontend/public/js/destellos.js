/**
 * Destellos decorativos para Editorial Codex.
 * Expone window.Destellos.lanzar(elemento, opciones): estallido de partículas en un
 * <canvas> temporal, absoluto y encima del elemento (polvo dorado, estrellitas y
 * luciérnagas). Se borra solo al terminar. Respeta prefers-reduced-motion.
 * opciones.cantidad controla las partículas de polvo + estrellitas (por defecto 80);
 * siempre se suman 12 luciérnagas.
 */
(function () {
  'use strict';

  var ESTILOS_ID = 'destellos-estilos';
  var COLORES = ['#f6d27a', '#ffe9a8', '#d4a446', '#fff6dc', '#c48a2e'];
  var CANTIDAD_DEFECTO = 80;
  var LUCIERNAGAS = 12;
  var MARGEN = 180;
  var GRAVEDAD = 260;

  function prefiereMovimientoReducido() {
    return typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function inyectarEstilos() {
    if (document.getElementById(ESTILOS_ID)) {
      return;
    }
    var style = document.createElement('style');
    style.id = ESTILOS_ID;
    style.textContent =
      '.destellos-canvas{position:absolute;pointer-events:none;overflow:visible;' +
      'z-index:2147483647;}';
    document.head.appendChild(style);
  }

  function alAzar(minimo, maximo) {
    return minimo + Math.random() * (maximo - minimo);
  }

  function elegirColor() {
    return COLORES[Math.floor(Math.random() * COLORES.length)];
  }

  function crearPolvo(cx, cy) {
    var angulo = Math.random() * Math.PI * 2;
    var rapidez = alAzar(60, 220);
    return {
      tipo: 'polvo',
      x: cx,
      y: cy,
      vx: Math.cos(angulo) * rapidez,
      vy: Math.sin(angulo) * rapidez - alAzar(20, 90),
      radio: alAzar(0.5, 1.7),
      color: elegirColor(),
      vida: 0,
      vidaMax: alAzar(0.8, 2)
    };
  }

  function crearEstrella(cx, cy) {
    return {
      tipo: 'estrella',
      x: cx + alAzar(-6, 6),
      y: cy + alAzar(-6, 6),
      vx: alAzar(-26, 26),
      vy: alAzar(-46, -8),
      tamano: alAzar(2, 4),
      color: elegirColor(),
      fase: Math.random() * Math.PI * 2,
      vida: 0,
      vidaMax: alAzar(1.8, 3.3)
    };
  }

  function crearLuciernaga(cx, cy) {
    return {
      tipo: 'luciernaga',
      baseX: cx + alAzar(-14, 14),
      x: cx,
      y: cy + alAzar(-10, 10),
      vy: -alAzar(8, 18),
      radio: 1.7,
      fase: Math.random() * Math.PI * 2,
      vida: 0,
      vidaMax: alAzar(3.5, 6)
    };
  }

  function opacidad(p) {
    var t = p.vida / p.vidaMax;
    var entrada = Math.min(1, p.vida / 0.12);
    var salida = 1 - Math.max(0, (t - 0.6) / 0.4);
    return Math.max(0, entrada * salida);
  }

  function dibujarEstrella(ctx, p, alpha) {
    var r = p.tamano;
    var rInterior = r * 0.42;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.globalAlpha = alpha;
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

  function actualizar(p, dt) {
    p.vida += dt;
    if (p.tipo === 'polvo') {
      p.vy += GRAVEDAD * dt;
      p.vx *= (1 - 1.2 * dt);
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    } else if (p.tipo === 'estrella') {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= (1 - 0.8 * dt);
      p.vy *= (1 - 0.8 * dt);
    } else {
      p.y += p.vy * dt;
      p.x = p.baseX + Math.sin(p.vida * 2 + p.fase) * 10;
    }
    return p.vida < p.vidaMax;
  }

  function dibujar(ctx, p) {
    var alpha = opacidad(p);
    if (alpha <= 0) {
      return;
    }
    if (p.tipo === 'estrella') {
      var parpadeo = 0.55 + 0.45 * Math.sin(p.vida * 6 + p.fase);
      dibujarEstrella(ctx, p, alpha * parpadeo);
      return;
    }
    if (p.tipo === 'luciernaga') {
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
      return;
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function ubicarCanvas(elemento) {
    var rect = elemento.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return null;
    }
    var host = (typeof elemento.closest === 'function')
      ? elemento.closest('dialog[open]')
      : null;
    var esDialogo = !!host;
    if (!host) {
      host = document.body;
    }
    var hostRect = esDialogo ? host.getBoundingClientRect() : { left: 0, top: 0 };
    var left = esDialogo
      ? rect.left - hostRect.left - host.clientLeft + host.scrollLeft
      : rect.left + (window.pageXOffset || 0);
    var top = esDialogo
      ? rect.top - hostRect.top - host.clientTop + host.scrollTop
      : rect.top + (window.pageYOffset || 0);

    var ancho = rect.width + MARGEN * 2;
    var alto = rect.height + MARGEN * 2;

    var canvas = document.createElement('canvas');
    canvas.className = 'destellos-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.left = (left - MARGEN) + 'px';
    canvas.style.top = (top - MARGEN) + 'px';
    canvas.style.width = ancho + 'px';
    canvas.style.height = alto + 'px';

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(ancho * dpr);
    canvas.height = Math.round(alto * dpr);

    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    host.appendChild(canvas);

    return {
      canvas: canvas,
      ctx: ctx,
      ancho: ancho,
      alto: alto,
      cx: MARGEN + rect.width / 2,
      cy: MARGEN + rect.height / 2
    };
  }

  function lanzar(elemento, opciones) {
    if (!elemento || prefiereMovimientoReducido()) {
      return;
    }
    inyectarEstilos();

    var lienzo = ubicarCanvas(elemento);
    if (!lienzo) {
      return;
    }

    var cantidad = (opciones && typeof opciones.cantidad === 'number')
      ? Math.max(0, Math.round(opciones.cantidad))
      : CANTIDAD_DEFECTO;

    var particulas = [];
    var i;
    var cantidadEstrellas = Math.round(cantidad * 0.3);
    for (i = 0; i < cantidad - cantidadEstrellas; i += 1) {
      particulas.push(crearPolvo(lienzo.cx, lienzo.cy));
    }
    for (i = 0; i < cantidadEstrellas; i += 1) {
      particulas.push(crearEstrella(lienzo.cx, lienzo.cy));
    }
    for (i = 0; i < LUCIERNAGAS; i += 1) {
      particulas.push(crearLuciernaga(lienzo.cx, lienzo.cy));
    }

    var ctx = lienzo.ctx;
    var ancho = lienzo.ancho;
    var alto = lienzo.alto;
    var anterior = null;
    var idFrame = null;
    var vivo = true;

    function limpiar() {
      vivo = false;
      if (idFrame !== null) {
        window.cancelAnimationFrame(idFrame);
        idFrame = null;
      }
      if (lienzo.canvas.parentNode) {
        lienzo.canvas.parentNode.removeChild(lienzo.canvas);
      }
    }

    function cuadro(ahora) {
      if (!vivo) {
        return;
      }
      if (anterior === null) {
        anterior = ahora;
      }
      var dt = Math.min((ahora - anterior) / 1000, 0.05);
      anterior = ahora;

      ctx.clearRect(0, 0, ancho, alto);

      var vivas = [];
      for (var j = 0; j < particulas.length; j += 1) {
        if (actualizar(particulas[j], dt)) {
          dibujar(ctx, particulas[j]);
          vivas.push(particulas[j]);
        }
      }
      particulas = vivas;

      if (particulas.length === 0) {
        limpiar();
        return;
      }
      idFrame = window.requestAnimationFrame(cuadro);
    }

    idFrame = window.requestAnimationFrame(cuadro);
    window.setTimeout(limpiar, 12000);
  }

  window.Destellos = {
    lanzar: lanzar
  };
})();
