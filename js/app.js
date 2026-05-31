// JawiKids App Helper v1.04
// Compatibility file. No import/export here so it can run in normal browsers.

(function () {
  window.JawiKidsApp = window.JawiKidsApp || {
    showToast(message) {
      if (window.JK && typeof window.JK.toast === "function") {
        window.JK.toast(message);
        return;
      }
      alert(message);
    }
  };
})();
