const {
  element: { createElement: e },
  components: { BaseControl },
  compose: { withInstanceId }
} = window.wp;

const googleFonts = {
  'Abril Fatface': { weight: ['400'] },
  Anton: { weight: ['400'] },
  Arvo: { weight: ['400', '700'] },
  Asap: { weight: ['400', '500', '600', '700'] },
  'Barlow Condensed': { weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
  Barlow: { weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
  'Cormorant Garamond': { weight: ['300', '400', '500', '600', '700'] },
  Faustina: { weight: ['400', '500', '600', '700'] },
  'Fira Sans': { weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
  'IBM Plex Sans': { weight: ['100', '200', '300', '400', '500', '600', '700'] },
  Inconsolata: { weight: ['400', '700'] },
  Heebo: { weight: ['100', '300', '400', '500', '700', '800', '900'] },
  Karla: { weight: ['400', '700'] },
  Lato: { weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
  Lora: { weight: ['400', '700'] },
  Merriweather: { weight: ['300', '400', '500', '600', '700', '800', '900'] },
  Montserrat: { weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] },
  'Noto Sans': { weight: ['400', '700'] },
  'Noto Serif': { weight: ['400', '700'] },
  'Open Sans': { weight: ['300', '400', '500', '600', '700', '800'] },
  Oswald: { weight: ['200', '300', '400', '500', '600', '700'] },
  'Playfair Display': { weight: ['400', '700', '900'] },
  'PT Serif': { weight: ['400', '700'] },
  Roboto: { weight: ['100', '300', '400', '500', '700', '900'] },
  Rubik: { weight: ['300', '400', '500', '700', '900'] },
  Tajawal: { weight: ['200', '300', '400', '500', '700', '800', '900'] },
  Ubuntu: { weight: ['300', '400', '500', '700'] },
  Yrsa: { weight: ['300', '400', '500', '600', '700'] },
  'Source Serif Pro': { weight: ['200', '300', '400', '600', '700', '900'] },
  'Source Sans Pro': { weight: ['200', '300', '400', '600', '700', '900'] },
  Martel: { weight: ['200', '300', '400', '600', '700', '800', '900'] }
};

export default withInstanceId(({ label, value, help, instanceId, onChange, className, ...props }) => {
  const id = `inspector-coblocks-font-family-${instanceId}`;
  const systemFonts = [
    { value: 'Arial', label: 'Arial' },
    { value: '', label: 'Helvetica' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Georgia', label: 'Georgia' }
  ];
  const fonts = [];

  function sortThings (a, b) {
    return a > b ? 1 : b > a ? -1 : 0;
  }

  // Add Google Fonts
  Object.keys(googleFonts).sort(sortThings).map((k) => {
    fonts.push(
      { value: k, label: k }
    );
  });

  const customFonts = [];

  if (document.fonts && document.fonts.forEach) {
    document.fonts.forEach((font) => {
      if (googleFonts[font.family]) {
        return;
      }

      if (font.family === 'dashicons') {
        return;
      }

      if (customFonts.find(({ value }) => value === font.family)) {
        return;
      }

      customFonts.push({ value: font.family, label: font.family });
    });
  }

  const onChangeValue = ({ target: { value } }) => {
    const googleFontsAttr = ':100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic';
    const isSystemFont = systemFonts.filter(function (font) {
      return font.label === value;
    }).length > 0;

    let url = '';

    if (!isSystemFont) {
      url = 'https://fonts.googleapis.com/css?family=' + value.replace(/ /g, '+') + googleFontsAttr;
    }

    onChange(value, url);
  };

  return (
    e(
      BaseControl,
      {
        label,
        id,
        help,
        className
      },
      e(
        'select',
        {
          className: 'components-select-control__input components-select-control__input--coblocks-fontfamily',
          onChange: onChangeValue,
          'aria-describedby': help ? `${id}__help` : undefined,
          ...props
        },
        customFonts.length > 0 && e('optgroup', { label: 'Custom Loaded Fonts' },
          customFonts.map((option, index) =>
            e('option', {
              key: option.value,
              value: option.value,
              selected: value === option.value
            }, option.label)
          )
        ),
        e('optgroup', { label: 'System Fonts' },
          systemFonts.map((option, index) =>
            e('option', {
              key: option.value,
              value: option.value,
              selected: value === option.value
            }, option.label)
          )
        ),
        e('optgroup', { label: 'Google Fonts' },
          fonts.map((option, index) =>
            e('option', {
              key: option.value,
              value: option.value,
              selected: value === option.value
            }, option.label)
          )
        )
      )
    )
  );
});
