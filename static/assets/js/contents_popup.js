/* data-popup 付きのリンクを押すと、リンク先ページの一部を共有ダイアログに表示する。
   JSが使えない・取得に失敗したときは、普通のリンクとして移動する。 */
(() => {
  const dialog = document.getElementById('popup');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const body = dialog.querySelector('.popup_body');

  // 取り込んだHTMLの相対パスを、取得元のページ基準の絶対パスに直す
  const absolutize = (root, base) => {
    root.querySelectorAll('[src], [href]').forEach((el) => {
      ['src', 'href'].forEach((attr) => {
        const v = el.getAttribute(attr);
        if (v && !v.startsWith('#')) el.setAttribute(attr, new URL(v, base).href);
      });
    });
  };

  document.addEventListener('click', async (e) => {
    const link = e.target.closest('a[data-popup]');
    if (!link || e.defaultPrevented || e.button !== 0 ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (new URL(link.href).origin !== location.origin) return;  // 外部サイトは通常のリンク

    e.preventDefault();
    try {
      const res = await fetch(link.href);
      if (!res.ok) throw new Error(res.status);
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      const part = doc.querySelector(link.getAttribute('data-popup') || '.popup_content') || doc.body;
      if (!part) throw new Error('selector not found');
      absolutize(part, res.url);
      if (part === doc.body) body.replaceChildren(...part.childNodes);
      else body.replaceChildren(part);   // 指定した要素そのものを入れる
      dialog.setAttribute('aria-label', link.title || link.querySelector('img')?.alt || '詳細');
      dialog.showModal();
    } catch (err) {
      location.href = link.href;   // 失敗したら普通に移動
    }
  });

  dialog.querySelector('.popup_close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
})();