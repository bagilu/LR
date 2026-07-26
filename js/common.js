(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  window.LR = window.LR || {};
  window.LR.escapeHtml = function (value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  };

  window.LR.getClient = function () {
    const cfg = window.LR_CONFIG || {};
    if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) return null;
    if (!window.supabase?.createClient) return null;
    return window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  };
})();
