(function () {
  "use strict";

  document.querySelectorAll(".paper-keywords").forEach(function (group) {
    if (group.querySelector(".paper-keyword")) return;
    var keywords = group.textContent
      .split(/\s*·\s*/)
      .map(function (keyword) { return keyword.trim(); })
      .filter(Boolean);
    group.textContent = "";
    keywords.forEach(function (keyword) {
      var item = document.createElement("span");
      item.className = "paper-keyword";
      item.textContent = keyword;
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
      group.appendChild(link);
    });
  });
}());
