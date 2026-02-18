const languageColors = {};
Object.entries(require("./languageColors.json")).forEach(([k, v]) => {
  languageColors[k.toLowerCase()] = v;
});
export default new Proxy(languageColors, {
  get: (target, prop) => target[prop.toLowerCase()] ?? "#858585",
});

