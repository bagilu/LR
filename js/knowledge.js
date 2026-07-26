(function () {
  const listEl = document.getElementById("podcast-list");
  const statusEl = document.getElementById("podcast-status");
  const sortEl = document.getElementById("sort-mode");
  const paginationEl = document.getElementById("pagination");
  const client = window.LR.getClient();
  const pageSize = Number(window.LR_CONFIG?.PAGE_SIZE) || 30;
  let currentPage = 1;
  let totalCount = 0;

  function setStatus(message, isError = false) {
    statusEl.textContent = message;
    statusEl.classList.toggle("error-message", isError);
  }

  function applySorting(query) {
    switch (sortEl.value) {
      case "episode-asc":
        return query.order("EpisodeNo", { ascending: true });
      case "category-episode-desc":
        return query
          .order("Category", { ascending: true, nullsFirst: false })
          .order("EpisodeNo", { ascending: false });
      case "category-episode-asc":
        return query
          .order("Category", { ascending: true, nullsFirst: false })
          .order("EpisodeNo", { ascending: true });
      default:
        return query.order("EpisodeNo", { ascending: false });
    }
  }

  function actionLink(url, label, extra = "") {
    if (!url) return "";
    return `<a class="podcast-link" href="${window.LR.escapeHtml(url)}" ${extra}>${label}</a>`;
  }

  function renderEpisodes(rows) {
    if (!rows.length) {
      listEl.innerHTML = '<div class="empty-state">目前尚無公開的 Podcast 集數。</div>';
      return;
    }

    listEl.innerHTML = rows.map((item) => {
      const transcriptUrl = `podcast.html?episode=${encodeURIComponent(item.EpisodeNo)}`;
      const category = item.Category || "未分類";
      const actions = [
        actionLink(item.SpotifyURL, "Spotify 收聽", 'target="_blank" rel="noopener noreferrer"'),
        actionLink(transcriptUrl, "閱讀逐字稿"),
        actionLink(item.QuizURL, "挑戰問答", 'target="_blank" rel="noopener noreferrer"')
      ].filter(Boolean).join("");

      return `
        <article class="podcast-card">
          <div class="podcast-number">第 ${window.LR.escapeHtml(item.EpisodeNo)} 集</div>
          <h2 class="podcast-title">${window.LR.escapeHtml(item.Title)}</h2>
          <p class="podcast-desc">${window.LR.escapeHtml(item.ShortDescription || "本集簡介整理中。")}</p>
          <div class="podcast-meta">主題：${window.LR.escapeHtml(category)}</div>
          <div class="podcast-actions">${actions || '<span class="podcast-pending">相關內容整理中</span>'}</div>
        </article>`;
    }).join("");
  }

  function renderPagination() {
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    paginationEl.innerHTML = `
      <button type="button" id="prev-page" ${currentPage <= 1 ? "disabled" : ""}>上一頁</button>
      <span>第 ${currentPage} / ${totalPages} 頁，共 ${totalCount} 集</span>
      <button type="button" id="next-page" ${currentPage >= totalPages ? "disabled" : ""}>下一頁</button>`;

    document.getElementById("prev-page").addEventListener("click", () => {
      if (currentPage > 1) { currentPage -= 1; loadEpisodes(); }
    });
    document.getElementById("next-page").addEventListener("click", () => {
      if (currentPage < totalPages) { currentPage += 1; loadEpisodes(); }
    });
  }

  async function loadEpisodes() {
    if (!client) {
      setStatus("尚未設定 Supabase。請先填寫 config.js。", true);
      listEl.innerHTML = '<div class="empty-state">網站版型已完成；連接資料庫後，Podcast 目錄會顯示在此處。</div>';
      paginationEl.innerHTML = "";
      return;
    }

    setStatus("正在載入 Podcast 目錄……");
    listEl.innerHTML = "";
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = client
      .from("TblLRPodcastEpisode")
      .select("EpisodeID,EpisodeNo,Title,ShortDescription,Category,SpotifyURL,QuizURL", { count: "exact" })
      .eq("IsPublished", true)
      .range(start, end);
    query = applySorting(query);

    const { data, error, count } = await query;
    if (error) {
      console.error(error);
      setStatus(`讀取失敗：${error.message}`, true);
      return;
    }

    totalCount = count || 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;
    renderEpisodes(data || []);
    renderPagination();
    setStatus(totalCount ? `目前收錄 ${totalCount} 集 Podcast。` : "目前尚無公開集數。");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  sortEl.addEventListener("change", () => {
    currentPage = 1;
    loadEpisodes();
  });

  loadEpisodes();
})();
