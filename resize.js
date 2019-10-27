window.addEventListener('DOMContentLoaded', resize);

function resize () {
  const element = document.querySelector('.block-editor-writing-flow');

  if (!element) {
    window.requestAnimationFrame(resize);
    return;
  }

  const width = element.clientWidth;
  const parentWidth = element.parentNode.clientWidth;
  const margin = parentWidth / 26;
  const innerParentWidth = element.parentNode.clientWidth - margin * 2;
  const scale = Math.min(1, innerParentWidth / width);
  const marginLeft = scale === 1 ? ((innerParentWidth - width) / 2) + margin : margin;
  const transform = `translate(${marginLeft}px, ${margin}px) scale(${scale})`;

  if (element.style.transform !== transform) {
    element.style.transformOrigin = '0 0';
    element.style.transform = transform;
  }

  window.requestAnimationFrame(resize);
}
