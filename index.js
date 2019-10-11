(({
  i18n,
  blocks,
  editor,
  element,
  richText,
  plugins,
  editPost,
  data,
  components
}) => {
  const { __ } = i18n;
  const { registerBlockType } = blocks;
  const { InnerBlocks, InspectorControls, RichTextToolbarButton } = editor;
  const { createElement: e, Fragment } = element;
  const { registerFormatType, toggleFormat } = richText;
  const { registerPlugin } = plugins;
  const { PluginDocumentSettingPanel } = editPost;
  const { useSelect, useDispatch } = data;
  const { TextareaControl, ColorPicker, PanelBody, RangeControl, TextControl } = components;
  const colorKey = 'presentation-color';
  const bgColorKey = 'presentation-background-color';
  const cssKey = 'presentation-css';
  const fontSizeKey = 'presentation-font-size';
  const fontFamilyKey = 'presentation-font-family';
  const cssPrefix = '.block-editor-block-list__layout .block-editor-block-list__block[data-type="slide/slide"]';

  registerPlugin('slide', {
    render: () => {
      const meta = useSelect((select) =>
        select('core/editor').getEditedPostAttribute('meta')
      );
      const { editPost } = useDispatch('core/editor');
      const updateMeta = (value, key) => editPost({
        meta: { ...meta, [key]: value }
      });

      return [
        e('style', null,
`
${cssPrefix} > .block-editor-block-list__block-edit:before {
    outline: 1px solid black;
    background: ${meta[bgColorKey]};
}

${cssPrefix} section {
    color: ${meta[colorKey]};
    font-size: ${meta[fontSizeKey] || '42'}px;
    font-family: ${meta[fontFamilyKey] || 'Helvetica, sans-serif'};
}
`
        ),
        e('style', null, meta[cssKey]),
        e(
          PluginDocumentSettingPanel,
          {
            name: 'slide-font',
            title: __('Font', 'slide'),
            icon: 'text'
          },
          e(RangeControl, {
            label: __('Font Size', 'slide'),
            value: parseInt(meta[fontSizeKey], 10),
            min: 10,
            max: 100,
            onChange: (value) => updateMeta(value + '', fontSizeKey)
          }),
          e(TextControl, {
            label: __('Font Family', 'slide'),
            help: __('E.g. "Helvetica, sans-serif" or "Georgia, serif"', 'slide'),
            value: meta[fontFamilyKey],
            onChange: (value) => updateMeta(value, fontFamilyKey)
          }),
          e(ColorPicker, {
            label: __('Color', 'slide'),
            color: meta[colorKey],
            onChangeComplete: (value) => updateMeta(value.hex, colorKey)
          })
        ),
        e(
          PluginDocumentSettingPanel,
          {
            name: 'slide-background',
            title: __('Background', 'slide'),
            icon: 'art'
          },
          e(ColorPicker, {
            label: __('Background Color', 'slide'),
            color: meta[bgColorKey],
            onChangeComplete: (value) => updateMeta(value.hex, bgColorKey)
          })
        ),
        e(
          PluginDocumentSettingPanel,
          {
            name: 'slide-css',
            title: __('Custom CSS', 'slide'),
            icon: 'editor-code'
          },
          e(TextareaControl, {
            label: __('Custom CSS Rules', 'slide'),
            help: __('Please prefix all rules with "section.wp-block-slide-slide"!', 'slide'),
            value: meta[cssKey] || 'section.wp-block-slide-slide {}',
            onChange: (value) => updateMeta(value, cssKey)
          })
        )
      ];
    }
  });

  registerBlockType('slide/slide', {
    title: __('Slide', 'slide'),
    icon: 'slides',
    category: 'common',
    keywords: [__('Presentation', 'slide')],
    attributes: {
      notes: {
        type: 'string'
      }
    },
    edit: ({ attributes, setAttributes, className }) =>
      e(Fragment, null,
        e(InspectorControls, null,
          e(PanelBody, {
            title: __('Slide Notes', 'slide')
          },
          e(TextareaControl, {
            label: __('Anything you want to remember.', 'slide'),
            value: attributes.notes,
            onChange: (notes) => setAttributes({ notes })
          })
          )
        ),
        e('section', {
          className,
          style: {
            backgroundColor: attributes.backgroundColor
          }
        }, e(InnerBlocks))
      ),
    save: ({ attributes }) =>
      e('section', {
        style: {
          backgroundColor: attributes.backgroundColor
        }
      }, e(InnerBlocks.Content))
  });

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

  window.addEventListener('DOMContentLoaded', resize);

  function resize () {
    const element = document.querySelector('.block-editor-writing-flow');
    const width = element.clientWidth;
    const margin = width / 33;
    const parentWidth = element.parentNode.clientWidth - margin * 2;
    const scale = Math.min(1, parentWidth / width);
    const marginLeft = scale === 1 ? ((parentWidth - width) / 2) + margin : margin;
    const transform = `translate(${marginLeft}px, ${margin}px) scale(${scale})`;

    if (element.style.transform !== transform) {
      element.style.transformOrigin = '0 0';
      element.style.transform = transform;
    }

    window.requestAnimationFrame(resize);
  }
})(window.wp);
