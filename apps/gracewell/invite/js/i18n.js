const I18N = {
  locale: "en",
  strings: {},

  async load(locale) {
    const normalized = ["en", "es"].includes(locale) ? locale : "en";
    this.locale = normalized;

    const response = await fetch(`./locales/${normalized}.json`);
    this.strings = await response.json();
  },

  t(path, replacements = []) {
    const value = path.split(".").reduce((obj, key) => obj?.[key], this.strings);
    if (typeof value !== "string") {
      return path;
    }

    let result = value;
    replacements.forEach((replacement) => {
      result = result.replace("%@", replacement);
    });
    return result;
  }
};

function detectLocale() {
  const params = new URLSearchParams(window.location.search);
  const queryLang = params.get("lang");
  if (queryLang && ["en", "es"].includes(queryLang)) {
    return queryLang;
  }

  const stored = window.localStorage.getItem("gw_lang");
  if (stored && ["en", "es"].includes(stored)) {
    return stored;
  }

  const browser = navigator.language?.slice(0, 2);
  if (browser && ["en", "es"].includes(browser)) {
    return browser;
  }

  return "en";
}

function applyTranslations(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    element.textContent = I18N.t(key);
  });
}

function tFormat(path, ...replacements) {
  return I18N.t(path, replacements);
}
