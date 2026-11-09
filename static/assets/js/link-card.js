/* リンクカード
   HTMLには <a class="link-card" href="URL">URL</a> とだけ書く。
   読み込み後に /api/link-card からタイトル・本文冒頭・画像を取得して差し替える。
   JSが動かない・取得に失敗した場合は、URLの通常リンクのまま残る。 */
(() => {
  const ENDPOINT = "/api/link-card";

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    node.className = className;
    if (text) node.textContent = text; // textContent なのでHTMLとして解釈されない
    return node;
  };

  const render = (a, data) => {
    const thumb = el("span", "link-card__thumb");
    if (data.image) {
      const img = new Image();
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      img.addEventListener("error", () => {
        img.remove();
        a.classList.add("link-card--no-image");
        thumb.remove();
      });
      img.src = data.image;
      thumb.append(img);
    } else {
      a.classList.add("link-card--no-image");
    }

    a.replaceChildren(
      ...(data.image ? [thumb] : []),
      el("span", "link-card__title", data.title || data.host),
      ...(data.text ? [el("span", "link-card__text", data.text)] : [])
    );
    a.dataset.state = "loaded";
  };

  const load = async (a) => {
    a.dataset.state = "loading";
    try {
      const res = await fetch(`${ENDPOINT}?url=${encodeURIComponent(a.href)}`, {
        headers: { accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      render(a, await res.json());
    } catch (e) {
      a.dataset.state = "error";
    }
  };

  document.querySelectorAll("a.link-card:not([data-state])").forEach(load);
})();
