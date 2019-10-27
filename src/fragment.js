const {
  i18n: { __ },
  element: { createElement: e },
  richText: { registerFormatType, toggleFormat },
  blockEditor: { RichTextToolbarButton }
} = window.wp;

registerFormatType('slide/fragment', {
  title: __('Slide Fragment', 'slide'),
  tagName: 'span',
  className: 'fragment',
  edit: ({ value, onChange }) =>
    e(RichTextToolbarButton, {
      icon: 'editor-textcolor',
      title: __('Slide Fragment', 'slide'),
      onClick: () => {
        onChange(toggleFormat(value, { type: 'slide/fragment' }));
      }
    })
});
