/* OpenStream UI/UX review mockup: real behaviour for every control. */
(function () {
  "use strict";

  /* ---------------------------------------------------------- theme */
  var root = document.documentElement;
  var themeBtn = document.getElementById("theme-toggle");
  var themeLabel = document.getElementById("theme-label");

  function applyTheme(name) {
    root.setAttribute("data-theme", name);
    var dark = name === "dark";
    themeBtn.setAttribute("aria-pressed", dark ? "true" : "false");
    themeLabel.textContent = dark ? "Light" : "Dark";
  }

  applyTheme("light");
  themeBtn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
  });

  /* ------------------------------------------------- dashboard states */
  var dashButtons = document.querySelectorAll("[data-dash]");
  var dashPanels = document.querySelectorAll("[data-dash-panel]");

  function setDash(state) {
    dashButtons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-dash") === state ? "true" : "false");
    });
    dashPanels.forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-dash-panel") !== state;
    });
  }

  dashButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setDash(btn.getAttribute("data-dash"));
    });
  });

  /* ------------------------------------------------ pairing validity */
  var validityButtons = document.querySelectorAll("#validity-seg button");
  var expiryValue = document.getElementById("expiry-value");
  var modalExpiry = document.getElementById("modal-expiry");
  var currentValidity = "1 hour";

  function setValidity(value) {
    currentValidity = value;
    validityButtons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-validity") === value ? "true" : "false");
    });
    expiryValue.textContent = value;
    if (modalExpiry) modalExpiry.textContent = value;
  }

  validityButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setValidity(btn.getAttribute("data-validity"));
    });
  });

  /* ------------------------------------------------------- switches */
  function wireSwitch(id, onChange) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", function () {
      var next = el.getAttribute("aria-checked") !== "true";
      el.setAttribute("aria-checked", next ? "true" : "false");
      if (onChange) onChange(next);
    });
  }

  wireSwitch("single-switch", function (on) {
    var hint = document.querySelector("#single-switch").closest(".switchrow").querySelector(".switchrow__hint");
    if (hint) {
      hint.textContent = on
        ? "The code stops working after one device pairs."
        : "Any device can use this code until it expires.";
    }
  });

  wireSwitch("curtain-switch", function (on) {
    var hint = document.getElementById("curtain-hint");
    if (hint) {
      hint.textContent = on
        ? "The local screen is blanked while a device is watching."
        : "Blank the local screen while a device is watching.";
    }
  });

  /* -------------------------------------------------- copy buttons */
  function flash(btn, text) {
    var previous = btn.textContent;
    btn.textContent = text;
    btn.setAttribute("data-copied", "true");
    window.setTimeout(function () {
      btn.textContent = previous;
      btn.removeAttribute("data-copied");
    }, 1400);
  }

  document.querySelectorAll(".copybtn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy") || "";
      var done = function () {
        flash(btn, "Copied");
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, function () {
          flash(btn, value.slice(0, 18));
        });
      } else {
        var field = document.createElement("textarea");
        field.value = value;
        field.setAttribute("readonly", "");
        field.style.position = "absolute";
        field.style.left = "-9999px";
        document.body.appendChild(field);
        field.select();
        try {
          document.execCommand("copy");
          done();
        } catch (err) {
          flash(btn, value.slice(0, 18));
        }
        document.body.removeChild(field);
      }
    });
  });

  /* ----------------------------------------------------------- modal */
  var modal = document.getElementById("code-modal");
  var openBtn = document.getElementById("open-code");
  var lastFocus = null;

  function openModal() {
    lastFocus = document.activeElement;
    modal.setAttribute("data-open", "true");
    var closeBtn = modal.querySelector(".modal__close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.setAttribute("data-open", "false");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (openBtn) openBtn.addEventListener("click", openModal);
  modal.querySelectorAll("[data-close]").forEach(function (el) {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.getAttribute("data-open") === "true") {
      closeModal();
    }
  });

  var regen = document.getElementById("regen-code");
  if (regen) {
    regen.addEventListener("click", function () {
      regen.textContent = "New code generated";
      window.setTimeout(function () {
        regen.textContent = "Generate a new code";
      }, 1400);
    });
  }

  /* --------------------------------------------- misc real behaviours */
  var pairBtn = document.getElementById("dash-pair");
  if (pairBtn) {
    pairBtn.addEventListener("click", function () {
      setDash("empty");
      var title = document.querySelector('[data-dash-panel="empty"] .state__title');
      if (title) title.setAttribute("data-flash", "1");
    });
  }

  document.querySelectorAll(".session__seg").forEach(function (seg) {
    seg.addEventListener("click", function () {
      var bar = seg.closest(".session__bar");
      bar.querySelectorAll(".session__seg").forEach(function (other) {
        other.classList.remove("session__seg--on");
      });
      seg.classList.add("session__seg--on");
    });
  });

  document.querySelectorAll(".tray__item:not(.tray__item--quit)").forEach(function (item) {
    item.addEventListener("click", function () {
      var hint = item.querySelector(".tray__item__hint");
      if (!hint) return;
      var previous = hint.textContent;
      hint.textContent = "Done";
      window.setTimeout(function () {
        hint.textContent = previous;
      }, 1400);
    });
  });

  var quit = document.querySelector(".tray__item--quit");
  if (quit) {
    quit.addEventListener("click", function () {
      var hint = quit.querySelector(".tray__item__hint");
      if (!hint) return;
      var previous = hint.textContent;
      hint.textContent = "Not in this prototype";
      window.setTimeout(function () {
        hint.textContent = previous;
      }, 1600);
    });
  }
})();
