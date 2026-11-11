(() => {
  const dialog = document.getElementById('zoom');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const img = dialog.querySelector('img');

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-zoom]');
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    img.src = link.href;
    img.alt = link.querySelector('img')?.alt || '';
    dialog.showModal();
  });

  // 画像・背景のどこをクリックしても閉じる（Escキーでも閉じる）
  dialog.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => img.removeAttribute('src'));
})();