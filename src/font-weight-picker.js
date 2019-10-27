const {
  i18n: { __ },
  element: { createElement: e },
  components: { SelectControl }
} = window.wp;

export default function FontWeightPicker ({ fontFamily, ...props }) {
  const options = [
    { value: '100', label: __('Thin', 'slide') },
    { value: '200', label: __('Extra Light', 'slide') },
    { value: '300', label: __('Light', 'slide') },
    { value: '400', label: __('Normal', 'slide') },
    { value: '500', label: __('Medium', 'slide') },
    { value: '600', label: __('Semi Bold', 'slide') },
    { value: '700', label: __('Bold', 'slide') },
    { value: '800', label: __('Extra Bold', 'slide') },
    { value: '900', label: __('Black', 'slide') }
  ];

  const weights = new Set();

  if (document.fonts && document.fonts.forEach) {
    document.fonts.forEach((font) => {
      if (font.family !== fontFamily) {
        return;
      }

      weights.add(font.weight);
    });
  }

  if (weights.size) {
    options.forEach((option) => {
      if (weights.has(option.value)) {
        return;
      }

      option.disabled = true;
    });
  }

  return e(SelectControl, {
    ...props,
    options
  });
}
