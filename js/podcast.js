(function () {
  const contentEl = document.getElementById("podcast-content");
  const statusEl = document.getElementById("podcast-detail-status");
  const client = window.LR.getClient();
  const episodeNo = new URLSearchParams(window.location.search).get("episode");

  function fail(message) {
    statusEl.textContent = message;
    statusEl.classList.add("error-message");
    contentEl.innerHTML = '<a class="back-link" href="knowledge.html">← 回到 Podcast 目錄</a>';
  }

  async function loadEpisode() {
    if (!episodeNo || !/^\d+$/.test(episodeNo)) {
      fail("網址未提供有效的 Podcast 集數。");
      return;
    }
    if (!client) {
      fail("尚未設定 Supabase。請先填寫 config.js。");
      return;
    }

    const { data, error } = await client
      .from("TblLRPodcastEpisode")
      .select("EpisodeNo,Title,ShortDescription,Category,SpotifyURL,Transcript,QuizURL")
      .eq("EpisodeNo", Number(episodeNo))
      .eq("IsPublished", true)
      .maybeSingle();

    if (error) {
      console.error(error);
      fail(`讀取失敗：${error.message}`);
      return;
    }
    if (!data) {
      fail("找不到這一集，或本集尚未公開。");
      return;
    }

    document.title = `第 ${data.EpisodeNo} 集｜${data.Title}｜林榮讀書館`;
    const links = [
      data.SpotifyURL ? `<a class="podcast-link" href="${window.LR.escapeHtml(data.SpotifyURL)}" target="_blank" rel="noopener noreferrer">Spotify 收聽</a>` : "",
      data.QuizURL ? `<a class="podcast-link" href="${window.LR.escapeHtml(data.QuizURL)}" target="_blank" rel="noopener noreferrer">挑戰問答</a>` : ""
    ].filter(Boolean).join("");

    const transcript = data.Transcript
      ? `<div class="transcript-text">${window.LR.escapeHtml(data.Transcript)}</div>`
      : '<div class="empty-state">本集逐字稿尚在整理中。</div>';

    statusEl.textContent = "";
    contentEl.innerHTML = `
      <a class="back-link" href="knowledge.html">← 回到 Podcast 目錄</a>
      <article class="podcast-detail-card">
        <div class="podcast-number">第 ${window.LR.escapeHtml(data.EpisodeNo)} 集</div>
        <h1 class="podcast-detail-title">${window.LR.escapeHtml(data.Title)}</h1>
        <p class="podcast-detail-desc">${window.LR.escapeHtml(data.ShortDescription || "")}</p>
        <div class="podcast-meta">主題：${window.LR.escapeHtml(data.Category || "未分類")}</div>
        <div class="podcast-actions">${links}</div>
      </article>
      <section class="transcript-section">
        <h2>本集逐字稿</h2>
        ${transcript}
      </section>`;
  }

  loadEpisode();
})();
