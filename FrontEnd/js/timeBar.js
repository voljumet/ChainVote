 function move(delay) {
  var elem = document.getElementById('myBar');
  var end = Date.now() + delay;
  var frame = () => {
    var timeleft = Math.max(0, end - Date.now());
    elem.style.width = (100 * timeleft) / delay + '%';
    elem.innerHTML = (timeleft / 1000).toFixed(1) + 's';
    if (timeleft === 0) return;
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
