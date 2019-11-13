(({ Reveal }) => {
  Reveal.initialize(window.slideTemplate.revealSettings);
  document.querySelectorAll('.wp-block-media-text').forEach((element) => {
    const percentage = parseInt(element.style.gridTemplateColumns, 10);

    if (percentage === 50) {
      return;
    }

    element.querySelector('.wp-block-media-text__media')
      .style.flexBasis = `${percentage}%`;
    element.querySelector('.wp-block-media-text__content')
      .style.flexBasis = `${100 - percentage}%`;
  });

  function backgroundSvg (event) {
    const svg = event.currentSlide.getAttribute('data-background-svg');

    if (!svg) {
      return;
    }

    const targetBackgound = document.querySelectorAll('.slide-background')[event.indexh];

    if (!targetBackgound) {
      return;
    }

    window.setTimeout(() => {
      targetBackgound.innerHTML = svg;
    });
  }

  Reveal.addEventListener('ready', backgroundSvg);
  Reveal.addEventListener('slidechanged', backgroundSvg);

  if (window.slideTemplate.contain) {
    const slidesElement = document.querySelector('.slides');
    const backgroundsElement = document.querySelector('.backgrounds');

    slidesElement.appendChild(backgroundsElement);
    document.documentElement.classList.add('presentation-contain');
  } else {
    document.querySelectorAll('.alignfull').forEach((element) => {
      element.style.width = 100 / Reveal.getScale() + 'vw';
      element.style.maxHeight = 84 / Reveal.getScale() + 'vh';
    });
    Reveal.addEventListener('ready', function (event) {
      document.querySelectorAll('.alignfull').forEach((element) => {
        element.style.width = 100 / Reveal.getScale() + 'vw';
        element.style.maxHeight = 84 / Reveal.getScale() + 'vh';
      });
    });
    Reveal.addEventListener('resize', function (event) {
      document.querySelectorAll('.alignfull').forEach((element) => {
        element.style.width = 100 / event.scale + 'vw';
        element.style.maxHeight = 100 / event.scale + 'vh';
      });
    });
  }

  document.querySelectorAll('[autoplay]')
    .forEach((el) => el.setAttribute('data-autoplay', 'true'));
})(window);
// Admin bar buttons.
window.addEventListener('DOMContentLoaded', () => {
  const bar = document.querySelector('ul#wp-admin-bar-root-default');
  const { __ } = window.wp.i18n;

  if (!bar) {
    return;
  }

  const fullscreenLi = document.createElement('li');
  const speakerLi = document.createElement('li');
  const fullscreenButton = document.createElement('button');
  const speakerButton = document.createElement('button');
  const fullscreenText = document.createTextNode(__('Fullscreen', 'slide'));
  const speakerText = document.createTextNode(__('Speaker View', 'slide'));

  fullscreenButton.appendChild(fullscreenText);
  fullscreenLi.appendChild(fullscreenButton);
  fullscreenLi.classList.add('slide-button');
  bar.appendChild(fullscreenLi);

  speakerButton.appendChild(speakerText);
  speakerLi.appendChild(speakerButton);
  speakerLi.classList.add('slide-button');
  bar.appendChild(speakerLi);

  fullscreenButton.addEventListener('click', (event) => {
    const target = document.querySelector('.reveal');

    if (target.requestFullscreen) {
      target.requestFullscreen();
    } else if (target.webkitRequestFullscreen) {
      target.webkitRequestFullscreen();
    }

    event.preventDefault();
  });
  speakerButton.addEventListener('click', (event) => {
    const { protocol, host, pathname, search } = window.location;
    let url = [protocol, '//', host, pathname].join('');
    url += search ? search + '&speaker=true' : '?speaker=true';
    window.Reveal.getPlugin('notes').open(url);
    event.preventDefault();
  });
});
