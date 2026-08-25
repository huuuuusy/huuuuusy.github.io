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
}());
