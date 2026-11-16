// カテゴリページ：最初の10件のあと、一番下までスクロールするたびに10件ずつ表示する
(function () {
  var list = document.getElementById('cardlist_more');
  var sentinel = document.getElementById('more_sentinel');
  if (!list || !sentinel) return;
  var step = parseInt(list.getAttribute('data-step'), 10) || 10;

  function showMore() {
    var hidden = list.querySelectorAll('.more_hidden');
    for (var i = 0; i < hidden.length && i < step; i++) {
      hidden[i].classList.remove('more_hidden');
    }
    return list.querySelectorAll('.more_hidden').length;
  }

  if (!('IntersectionObserver' in window)) {   // 古いブラウザは全件表示
    while (showMore() > 0) {}
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    if (showMore() === 0) io.disconnect();
    else { io.unobserve(sentinel); io.observe(sentinel); }   // まだ画面内なら続けて判定
  }, { rootMargin: '200px' });
  io.observe(sentinel);
})();
