/* Project path helper for nested static HTML pages. */
(function () {
  function projectRootURL() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const markers = new Set(["pages", "auth", "dashboards"]);
    const markerIndex = parts.findIndex(part => markers.has(part));
    let rootPath;

    if (markerIndex >= 0) {
      rootPath = "/" + parts.slice(0, markerIndex).join("/") + "/";
    } else {
      const last = parts.length ? parts[parts.length - 1] : "";
      rootPath = "/" + parts.slice(0, last && last.includes(".") ? -1 : parts.length).join("/") + "/";
    }

    if (rootPath === "//") rootPath = "/";
    return new URL(rootPath, window.location.origin);
  }

  window.projectUrl = function (relativePath) {
    return new URL(relativePath.replace(/^\/+/, ""), projectRootURL()).href;
  };
})();
