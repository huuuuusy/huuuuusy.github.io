(function () {
  "use strict";

  var root = document.documentElement;
  var options = document.querySelectorAll("[data-language-option]");
  var switcher = document.querySelector(".language-switcher");
  var recentDetails = document.querySelector(".visitor-recent");
  var englishDocumentTitle = document.title;

  if (!options.length) return;

  function normalizeLanguage(value) {
    return value === "zh" ? "zh" : "en";
  }

  function updateTranslatedAttributes(language) {
    var elements = document.querySelectorAll("[data-i18n-en][data-i18n-zh]");
    var labelledElements = document.querySelectorAll(
      "[data-i18n-aria-label-en][data-i18n-aria-label-zh]"
    );

    Array.prototype.forEach.call(elements, function (element) {
      element.textContent = element.getAttribute(
        language === "zh" ? "data-i18n-zh" : "data-i18n-en"
      );
    });

    Array.prototype.forEach.call(labelledElements, function (element) {
      element.setAttribute(
        "aria-label",
        element.getAttribute(
          language === "zh"
            ? "data-i18n-aria-label-zh"
            : "data-i18n-aria-label-en"
        )
      );
    });
  }

  function updateRecentHint(language) {
    if (!recentDetails) return;

    var hint = recentDetails.querySelector(".visitor-recent__hint");
    if (!hint) return;

    if (recentDetails.open) {
      hint.textContent = language === "zh" ? "收起详情" : "Hide details";
    } else {
      hint.textContent = language === "zh" ? "查看详情" : "View details";
    }
  }

  function updateHonorKinds(language) {
    var awards = document.querySelectorAll(".honor-kind--award");
    var honors = document.querySelectorAll(".honor-kind--honor");

    Array.prototype.forEach.call(awards, function (element) {
      element.textContent = language === "zh" ? "奖项" : "Award";
    });
    Array.prototype.forEach.call(honors, function (element) {
      element.textContent = language === "zh" ? "荣誉" : "Honor";
    });
  }

  function applyLanguage(language, persist) {
    var nextLanguage = normalizeLanguage(language);

    root.setAttribute("data-language", nextLanguage);
    root.setAttribute("lang", nextLanguage === "zh" ? "zh-CN" : "en");

    Array.prototype.forEach.call(options, function (option) {
      var selected = option.getAttribute("data-language-option") === nextLanguage;
      option.setAttribute("aria-pressed", selected ? "true" : "false");
    });

    if (switcher) {
      switcher.setAttribute(
        "aria-label",
        nextLanguage === "zh" ? "语言选择" : "Language selection"
      );
    }

    updateTranslatedAttributes(nextLanguage);
    updateRecentHint(nextLanguage);
    updateHonorKinds(nextLanguage);
    document.title = nextLanguage === "zh"
      ? "胡世宇 | 学术主页"
      : englishDocumentTitle;

    if (persist) {
      try {
        window.localStorage.setItem("site-language", nextLanguage);
      } catch (error) {
        // The language switch still works when storage is unavailable.
      }
    }

    document.dispatchEvent(new CustomEvent("site-language-change", {
      detail: { language: nextLanguage }
    }));
    window.dispatchEvent(new Event("resize"));
  }

  Array.prototype.forEach.call(options, function (option) {
    option.addEventListener("click", function () {
      applyLanguage(option.getAttribute("data-language-option"), true);
    });
  });

  if (recentDetails) {
    recentDetails.addEventListener("toggle", function () {
      updateRecentHint(normalizeLanguage(root.getAttribute("data-language")));
    });
  }

  applyLanguage(root.getAttribute("data-language"), false);
}());
