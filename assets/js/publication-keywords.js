(function () {
  "use strict";

  document.querySelectorAll(".paper-keywords").forEach(function (group) {
    if (group.querySelector(".paper-keyword")) return;
    var keywords = group.textContent
      .split(/\s*·\s*/)
      .map(function (keyword) { return keyword.trim(); })
      .filter(Boolean);
    group.textContent = "";
    keywords.forEach(function (keyword, index) {
      var item = document.createElement("span");
      item.className = "paper-keyword";
      item.textContent = keyword;
      if (index) group.appendChild(document.createTextNode(" "));
      group.appendChild(item);
    });
  });

  // Resource links (📃 Paper, 📑 PDF, 🪧 Poster, ...) start with an emoji.
  // Group each entry's run of resource links so they can wrap as buttons.
  var resourcePattern;
  try {
    resourcePattern = new RegExp("^\\s*\\p{Extended_Pictographic}", "u");
  } catch (error) {
    return;
  }

  var stripPattern = new RegExp("^\\s*[\\p{Extended_Pictographic}\\uFE0F\\u200D]+\\s*", "u");
  var icons = { paper: "paper", pdf: "pdf", slides: "slides", poster: "poster", platform: "web",
    project: "web", benchmark: "web", toolkit: "code", code: "code", dataset: "data", bibtex: "cite",
    book: "book", supplementary: "attach", award: "award" };
  function iconFor(label) {
    return icons[label.toLowerCase()] || "web";
  }

  document.querySelectorAll(".paper-box-text > p, .workshop-list li > p").forEach(function (paragraph) {
    if (paragraph.querySelector(".paper-links")) return;
    var links = Array.prototype.filter.call(paragraph.children, function (child) {
      return child.tagName === "A" && resourcePattern.test(child.textContent);
    });
    if (!links.length) return;
    var group = document.createElement("span");
    group.className = "paper-links";
    paragraph.insertBefore(group, links[0]);
    links.forEach(function (link) {
      link.classList.add("paper-link");
      link.textContent = link.textContent.replace(stripPattern, "").trim();
      link.setAttribute("data-icon", iconFor(link.textContent));
      group.appendChild(link);
    });
  });
}());
