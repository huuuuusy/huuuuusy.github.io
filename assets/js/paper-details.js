(function () {
  "use strict";

  // Paper details dialog: abstract, contributions, BibTeX, and links for the
  // entries listed in _data/papers.yml. The data loads on first open.
  var script = document.currentScript;
  var dataUrl = script && script.getAttribute("data-papers");
  var HASH_SUFFIX = "-details";

  function initialise() {
    var dialog = document.getElementById("paper-dialog");
    if (!dialog || !dataUrl || typeof dialog.showModal !== "function") {
      return;
    }

    var ids = (dialog.getAttribute("data-paper-ids") || "").split(",").filter(Boolean);
    var entries = {};
    var dataPromise = null;
    var openedByPush = false;

    ids.forEach(function (id) {
      var anchor = document.getElementById(id);
      var entry = anchor && anchor.closest(".paper-box");
      if (!entry) {
        return;
      }
      entries[id] = entry;
      addTriggers(entry, id);
    });

    function loadData() {
      if (!dataPromise) {
        dataPromise = fetch(dataUrl).then(function (response) {
          if (!response.ok) {
            throw new Error("HTTP " + response.status);
          }
          return response.json();
        });
      }
      return dataPromise;
    }

    function addTriggers(entry, id) {
      var text = entry.querySelector(".paper-box-text");
      var links = text && text.querySelector(".paper-links");
      if (!links && text) {
        links = document.createElement("span");
        links.className = "paper-links";
        var paragraph = text.querySelectorAll("p");
        (paragraph[paragraph.length - 1] || text).appendChild(links);
      }
      if (!links) {
        return;
      }

      var button = document.createElement("button");
      button.type = "button";
      button.className = "paper-link paper-link--details";
      button.textContent = "📝 Details";
      button.setAttribute("aria-haspopup", "dialog");
      button.addEventListener("click", function () {
        open(id, true);
      });
      links.insertBefore(button, links.firstChild);

      var title = titleElement(entry);
      if (title) {
        title.classList.add("paper-title--interactive");
        title.setAttribute("role", "button");
        title.setAttribute("tabindex", "0");
        title.setAttribute("aria-haspopup", "dialog");
        title.addEventListener("click", function () {
          open(id, true);
        });
        title.addEventListener("keydown", function (event) {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            open(id, true);
          }
        });
      }
    }

    function titleElement(entry) {
      var paragraphs = entry.querySelectorAll(".paper-box-text p");
      for (var i = 0; i < paragraphs.length; i += 1) {
        var strong = paragraphs[i].querySelector(":scope > strong:first-child");
        if (strong && !strong.querySelector("em")) {
          return strong;
        }
      }
      return null;
    }

    // Author and venue lines: the title paragraph without its title,
    // keywords, and resource links.
    function metaFragment(entry) {
      var title = titleElement(entry);
      var paragraph = title && title.parentElement;
      var fragment = document.createElement("div");
      if (!paragraph) {
        return fragment;
      }
      var copy = paragraph.cloneNode(true);
      Array.prototype.forEach.call(
        copy.querySelectorAll(".paper-keywords, .paper-links, .paper-title--interactive"),
        function (node) {
          node.remove();
        }
      );
      copy.innerHTML = copy.innerHTML
        .replace(/^(\s*<br\s*\/?>\s*)+/i, "")
        .replace(/(\s*<br\s*\/?>\s*)+$/i, "");
      fragment.appendChild(copy);
      return fragment;
    }

    function fill(id, data) {
      var entry = entries[id];
      var badge = entry.querySelector(".badge, .badge-preprint");
      var title = titleElement(entry);

      dialog.querySelector(".paper-dialog__badge").textContent = badge ? badge.textContent.trim() : "";
      dialog.querySelector(".paper-dialog__title").textContent = title ? title.textContent.trim() : "";

      var meta = dialog.querySelector(".paper-dialog__meta");
      meta.innerHTML = "";
      meta.appendChild(metaFragment(entry));

      var abstract = dialog.querySelector(".paper-dialog__abstract");
      var more = dialog.querySelector(".paper-dialog__more");
      abstract.textContent = data.abstract || "";
      abstract.classList.add("is-clamped");
      more.textContent = "Show more";
      more.hidden = true;
      window.requestAnimationFrame(function () {
        more.hidden = abstract.scrollHeight <= abstract.clientHeight + 2;
      });

      var list = dialog.querySelector(".paper-dialog__contributions");
      list.innerHTML = "";
      (data.contributions || []).forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
      });
      dialog.querySelector(".paper-dialog__section--contributions").hidden = !(data.contributions || []).length;

      dialog.querySelector(".paper-dialog__bibtex code").textContent = data.bibtex || "";
      dialog.querySelector(".paper-dialog__section--bibtex").hidden = !data.bibtex;
      var copy = dialog.querySelector(".paper-dialog__copy");
      copy.textContent = "Copy";

      var links = dialog.querySelector(".paper-dialog__links");
      links.innerHTML = "";
      var source = entry.querySelector(".paper-links");
      if (source) {
        Array.prototype.forEach.call(source.querySelectorAll("a"), function (link) {
          links.appendChild(link.cloneNode(true));
        });
      }
      links.hidden = !links.children.length;
    }

    function open(id, push) {
      if (!entries[id]) {
        return;
      }
      loadData()
        .then(function (papers) {
          if (!papers[id]) {
            return;
          }
          fill(id, papers[id]);
          if (push && window.location.hash !== "#" + id + HASH_SUFFIX) {
            window.history.pushState({ paperDetails: id }, "", "#" + id + HASH_SUFFIX);
            openedByPush = true;
          }
          if (!dialog.open) {
            dialog.showModal();
            document.documentElement.classList.add("has-paper-dialog");
          }
          dialog.scrollTop = 0;
          dialog.querySelector(".paper-dialog__inner").scrollTop = 0;
        })
        .catch(function () {
          // Without the data the entry keeps its normal links.
        });
    }

    function close(fromHistory) {
      if (dialog.open) {
        dialog.close();
      }
      document.documentElement.classList.remove("has-paper-dialog");
      if (!fromHistory && openedByPush) {
        openedByPush = false;
        window.history.back();
      } else if (!fromHistory && window.location.hash.slice(-HASH_SUFFIX.length) === HASH_SUFFIX) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }

    function idFromHash() {
      var hash = decodeURIComponent(window.location.hash.slice(1));
      return hash.slice(-HASH_SUFFIX.length) === HASH_SUFFIX
        ? hash.slice(0, -HASH_SUFFIX.length)
        : null;
    }

    dialog.querySelector(".paper-dialog__close").addEventListener("click", function () {
      close(false);
    });

    dialog.addEventListener("cancel", function (event) {
      event.preventDefault();
      close(false);
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) {
        close(false);
      }
    });

    dialog.querySelector(".paper-dialog__more").addEventListener("click", function () {
      var abstract = dialog.querySelector(".paper-dialog__abstract");
      var clamped = abstract.classList.toggle("is-clamped");
      this.textContent = clamped ? "Show more" : "Show less";
    });

    dialog.querySelector(".paper-dialog__copy").addEventListener("click", function () {
      var button = this;
      var text = dialog.querySelector(".paper-dialog__bibtex code").textContent;
      var done = function () {
        button.textContent = "Copied";
        window.setTimeout(function () {
          button.textContent = "Copy";
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {});
      } else {
        var range = document.createRange();
        range.selectNodeContents(dialog.querySelector(".paper-dialog__bibtex code"));
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        try {
          document.execCommand("copy");
          done();
        } catch (error) {
          // Leave the text selected for a manual copy.
        }
      }
    });

    window.addEventListener("popstate", function () {
      var id = idFromHash();
      if (id && entries[id]) {
        open(id, false);
      } else if (dialog.open) {
        openedByPush = false;
        close(true);
      }
    });

    var initial = idFromHash();
    if (initial && entries[initial]) {
      // Reveal the entry behind the dialog too, in case it is collapsed.
      var anchor = document.getElementById(initial);
      if (anchor) {
        anchor.dispatchEvent(new Event("paper-details:reveal", { bubbles: true }));
      }
      open(initial, false);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise);
  } else {
    initialise();
  }
})();
