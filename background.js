if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getManifest) {
    // Running in Chrome
    console.log("Running in Chrome");
    chrome.runtime.onInstalled.addListener((details) => {
      switch (details.reason) {
      case "install":
        console.info("EXTENSION INSTALLED");
        break;
      case "update":
        console.info("EXTENSION UPDATED");
        break;
      default:
        console.info("BROWSER UPDATED");
        break;
      }
    });
} else if (typeof browser !== "undefined" && browser.runtime && browser.runtime.getManifest) {
    // Running in Firefox
    console.log("Running in Firefox");
    browser.runtime.onInstalled.addListener((details) => {
      switch (details.reason) {
      case "install":
        console.info("EXTENSION INSTALLED");
        break;
      case "update":
        console.info("EXTENSION UPDATED");
        break;
      default:
        console.info("BROWSER UPDATED");
        break;
  }
});
} else {
    // Not running in a supported browser
    console.error("Unsupported browser");
}