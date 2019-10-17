(({
  i18n,
  blocks,
  element,
  richText,
  plugins,
  editPost,
  data,
  components,
  blockEditor,
  url,
  codeEditor
}, FontPicker) => {
  const { __ } = i18n;
  const { registerBlockType, createBlock } = blocks;
  const { createElement: e, Fragment, useRef, useEffect, memo } = element;
  const { registerFormatType, toggleFormat } = richText;
  const { registerPlugin } = plugins;
  const { PluginDocumentSettingPanel } = editPost;
  const { useSelect, useDispatch, subscribe, select, dispatch } = data;
  const { TextareaControl, ColorPicker, PanelBody, RangeControl, SelectControl, ToggleControl, Button, FocalPointPicker, ExternalLink } = components;
  const { MediaUpload, __experimentalGradientPickerControl, InnerBlocks, InspectorControls, RichTextToolbarButton } = blockEditor;
  const { addQueryArgs } = url;
  const colorKey = 'presentation-color';
  const bgColorKey = 'presentation-background-color';
  const backgroundGradientKey = 'presentation-background-gradient';
  const backgroundUrlKey = 'presentation-background-url';
  const backgroundIdKey = 'presentation-background-id';
  const backgroundPositionKey = 'presentation-background-position';
  const backgroundOpacityKey = 'presentation-background-opacity';
  const cssKey = 'presentation-css';
  const fontSizeKey = 'presentation-font-size';
  const fontFamilyKey = 'presentation-font-family';
  const fontFamilyUrlKey = 'presentation-font-url-family';
  const transitionKey = 'presentation-transition';
  const transitionSpeedKey = 'presentation-transition-speed';
  const controlsKey = 'presentation-controls';
  const progressKey = 'presentation-progress';
  const cssPrefix = '.block-editor-block-list__layout .block-editor-block-list__block[data-type="slide/slide"]';

  const CodeEditor = memo(({ onChange, ...props }) => {
    const ref = useRef();

    useEffect(() => {
      const editor = codeEditor.initialize(ref.current, {
        ...codeEditor.defaultSettings,
        codemirror: {
          ...codeEditor.defaultSettings.codemirror,
          tabSize: 2,
          mode: 'css',
          lineNumbers: false
        }
      });

      editor.codemirror.on('change', () => {
        onChange(editor.codemirror.getValue());
      });

      return () => {
        editor.codemirror.toTextArea();
      };
    });

    return e('textarea', {
      ref,
      ...props
    });
  // Never rerender.
  }, () => true);

  subscribe(() => {
    const blocks = select('core/block-editor').getBlocks();
    const block = blocks.find(({ name }) => name !== 'slide/slide');

    if (!block) {
      return;
    }

    const slide = createBlock('slide/slide', {}, [
      createBlock(block.name, block.attributes)
    ]);

    dispatch('core/block-editor').replaceBlock(block.clientId, slide);
  });

  registerPlugin('slide', {
    render: () => {
      const meta = useSelect((select) =>
        select('core/editor').getEditedPostAttribute('meta')
      );
      const link = useSelect((select) =>
        select('core/editor').getCurrentPost('meta').link
      );
      const { editPost } = useDispatch('core/editor');
      const updateMeta = (value, key) => editPost({
        meta: { ...meta, [key]: value }
      });
      const rules = {
        color: meta[colorKey] || '#000',
        'background-color': meta[bgColorKey] || '#fff',
        'background-image': meta[backgroundGradientKey] || 'none',
        'font-size': (meta[fontSizeKey] || '42') + 'px',
        'font-family': meta[fontFamilyKey] || 'Helvetica, sans-serif'
      };

      const backgroundRules = {
        'background-image': meta[backgroundUrlKey] ? `url("${meta[backgroundUrlKey]}")` : 'none',
        'background-size': 'cover',
        'background-position': meta[backgroundPositionKey] ? meta[backgroundPositionKey] : '50% 50%',
        opacity: meta[backgroundOpacityKey] ? meta[backgroundOpacityKey] / 100 : 1
      };

      console.log(meta[fontFamilyUrlKey]);

      return [
        ...Object.keys(rules).map((key) => {
          return e(
            'style',
            null,
            `${cssPrefix} section {${key}:${rules[key]}}`
          );
        }),
        ...Object.keys(backgroundRules).map((key) => {
          return e(
            'style',
            null,
            `${cssPrefix} section .wp-block-slide-slide__background {${key}:${backgroundRules[key]}}`
          );
        }),
        e('style', null, meta[cssKey]),
        !!meta[fontFamilyUrlKey] && e(
          'style',
          null,
          `@import url("${meta[fontFamilyUrlKey]}")`
        ),
        e(
          PluginDocumentSettingPanel,
          {
            name: 'slide-font',
            title: __('Font', 'slide'),
            icon: 'text'
          },
          e(RangeControl, {
            label: __('Font Size', 'slide'),
            value: meta[fontSizeKey] ? parseInt(meta[fontSizeKey], 10) : undefined,
            min: 10,
            max: 100,
            initialPosition: 42,
            onChange: (value) => updateMeta(value + '', fontSizeKey)
          }),
          e(FontPicker, {
            label: __('Font Family', 'slide'),
            value: meta[fontFamilyKey],
            onChange: (value) => updateMeta(value, fontFamilyKey)
          }),
          e(ColorPicker, {
            disableAlpha: true,
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
            disableAlpha: true,
            label: __('Background Color', 'slide'),
            color: meta[bgColorKey],
            onChangeComplete: (value) => {
              editPost({
                meta: {
                  ...meta,
                  [bgColorKey]: value.hex,
                  [backgroundGradientKey]: ''
                }
              });
            }
          }),
          __('Experimental:'),
          __experimentalGradientPickerControl && e(__experimentalGradientPickerControl, {
            onChange: (value) => updateMeta(value, backgroundGradientKey),
            value: meta[backgroundGradientKey]
          }),
          !!meta[backgroundUrlKey] && e(RangeControl, {
            label: __('Opacity', 'slide'),
            help: __('May be overridden by the block!'),
            value: meta[backgroundOpacityKey] ? 100 - parseInt(meta[backgroundOpacityKey], 10) : undefined,
            min: 0,
            max: 100,
            initialPosition: 0,
            onChange: (value) => {
              editPost({
                meta: {
                  ...meta,
                  [backgroundOpacityKey]: 100 - value + ''
                }
              });
            }
          })
        ),
        e(
          PluginDocumentSettingPanel,
          {
            name: 'slide-background-image',
            title: __('Background Image', 'slide'),
            icon: 'format-image'
          },
          e(MediaUpload, {
            onSelect: (media) => {
              if (!media || !media.url) {
                editPost({
                  meta: {
                    ...meta,
                    [backgroundUrlKey]: undefined,
                    [backgroundIdKey]: undefined,
                    [backgroundPositionKey]: undefined,
                    [backgroundOpacityKey]: undefined
                  }
                });
                return;
              }

              editPost({
                meta: {
                  ...meta,
                  [backgroundUrlKey]: media.url,
                  [backgroundIdKey]: media.id + ''
                }
              });
            },
            allowedTypes: ALLOWED_MEDIA_TYPES,
            value: meta[backgroundIdKey] ? parseInt(meta[backgroundIdKey], 10) : undefined,
            render: ({ open }) => e(Button, {
              isDefault: true,
              onClick: open
            }, meta[backgroundUrlKey] ? __('Change') : __('Add Background Image'))
          }),
          ' ',
          !!meta[backgroundUrlKey] && e(Button, {
            isDefault: true,
            onClick: () => {
              editPost({
                meta: {
                  ...meta,
                  [backgroundUrlKey]: undefined,
                  [backgroundIdKey]: undefined,
                  [backgroundPositionKey]: undefined,
                  [backgroundOpacityKey]: undefined
                }
              });
            }
          }, __('Remove')),
          e('br'), e('br'),
          !!meta[backgroundUrlKey] && e(FocalPointPicker, {
            label: __('Focal Point Picker'),
            url: meta[backgroundUrlKey],
            value: (() => {
              if (!meta[backgroundPositionKey]) {
                return;
              }

              let [x, y] = meta[backgroundPositionKey].split(' ');

              x = parseFloat(x) / 100;
              y = parseFloat(y) / 100;

              return { x, y };
            })(),
            onChange: (focalPoint) => {
              editPost({
                meta: {
                  ...meta,
                  [backgroundPositionKey]: `${focalPoint.x * 100}% ${focalPoint.y * 100}%`
                }
              });
            }
          }),
          !!meta[backgroundUrlKey] && e(RangeControl, {
            label: __('Opacity', 'slide'),
            help: __('May be overridden by the block!'),
            value: meta[backgroundOpacityKey] ? parseInt(meta[backgroundOpacityKey], 10) : undefined,
            min: 0,
            max: 100,
            initialPosition: 100,
            onChange: (value) => {
              editPost({
                meta: {
                  ...meta,
                  [backgroundOpacityKey]: value + ''
                }
              });
            }
          })
        ),
        e(
          PluginDocumentSettingPanel,
          {
            name: 'slide-css',
            title: __('Custom CSS', 'slide'),
            icon: 'editor-code'
          },
          e(CodeEditor, {
            value: meta[cssKey] || '/* Always a block prefix! */\n.wp-block-slide-slide {\n\t\n}\n',
            onChange: (value) => updateMeta(value, cssKey)
          })
        ),
        e(
          PluginDocumentSettingPanel,
          {
            name: 'slide-transition',
            title: __('Transition', 'slide'),
            icon: 'slides'
          },
          e(SelectControl, {
            label: __('Transition Style', 'slide'),
            options: [
              { value: 'none', label: __('None', 'slide') },
              { value: 'fade', label: __('Fade', 'slide') },
              { value: 'slide', label: __('Slide', 'slide') },
              { value: 'convex', label: __('Convex', 'slide') },
              { value: 'concave', label: __('Concave', 'slide') },
              { value: 'zoom', label: __('Zoom', 'slide') }
            ],
            value: meta[transitionKey],
            onChange: (value) => updateMeta(value, transitionKey)
          }),
          e(SelectControl, {
            label: __('Transition Speed', 'slide'),
            options: [
              { value: 'default', label: __('Default', 'slide') },
              { value: 'fast', label: __('Fast', 'slide') },
              { value: 'slow', label: __('Slow', 'slide') }
            ],
            value: meta[transitionSpeedKey],
            onChange: (value) => updateMeta(value, transitionSpeedKey)
          })
        ),
        e(
          PluginDocumentSettingPanel,
          {
            name: 'slide-controls',
            title: __('Controls', 'slide'),
            icon: 'leftright'
          },
          e(ToggleControl, {
            label: __('Control Arrows', 'slide'),
            checked: meta[controlsKey] === 'true',
            onChange: (value) => updateMeta(value + '', controlsKey)
          }),
          e(ToggleControl, {
            label: __('Progress Bar', 'slide'),
            checked: meta[progressKey] === 'true',
            onChange: (value) => updateMeta(value + '', progressKey)
          })
        ),
        e(
          PluginDocumentSettingPanel,
          {
            name: 'slide-pdf',
            title: __('PDF (Experimental)', 'slide'),
            icon: 'page'
          },
          e(
            'p',
            {},
            e(
              ExternalLink,
              {
                href: addQueryArgs(link, { 'print-pdf': true }),
                target: '_blank'
              },
              __('Print (Save as PDF).', 'slides')
            ),
            e('br'),
            __('Enable backgrounds and remove margins.', 'slides')
          )
        )
      ];
    }
  });

  const ALLOWED_MEDIA_TYPES = ['image'];

  registerBlockType('slide/slide', {
    title: __('Slide', 'slide'),
    description: __('With this blocks you can form your slide deck! You can override document level setting for each slide block.'),
    icon: 'slides',
    category: 'common',
    keywords: [__('Presentation', 'slide')],
    attributes: {
      notes: {
        type: 'string'
      },
      color: {
        type: 'string'
      },
      backgroundColor: {
        type: 'string'
      },
      backgroundId: {
        type: 'string'
      },
      backgroundUrl: {
        type: 'string'
      },
      focalPoint: {
        type: 'object'
      },
      backgroundOpacity: {
        type: 'string'
      }
    },
    edit: ({ attributes, setAttributes, className }) => {
      const meta = useSelect((select) =>
        select('core/editor').getEditedPostAttribute('meta')
      );

      return e(
        Fragment,
        null,
        e(
          InspectorControls,
          null,
          e(
            PanelBody,
            {
              title: __('Slide Notes', 'slide'),
              icon: 'edit',
              initialOpen: false
            },
            e(TextareaControl, {
              label: __('Anything you want to remember.', 'slide'),
              value: attributes.notes,
              onChange: (notes) => setAttributes({ notes })
            })
          ),
          e(
            PanelBody,
            {
              title: __('Font', 'slide'),
              icon: 'text',
              initialOpen: false
            },
            e(ColorPicker, {
              disableAlpha: true,
              label: __('Color', 'slide'),
              color: attributes.color,
              onChangeComplete: ({ hex: color }) =>
                setAttributes({ color })
            }),
            !!attributes.color && e(Button, {
              isDefault: true,
              onClick: () => {
                setAttributes({
                  color: undefined
                });
              }
            }, __('Remove'))
          ),
          e(
            PanelBody,
            {
              title: __('Background Color', 'slide'),
              icon: 'art',
              initialOpen: false
            },
            e(ColorPicker, {
              disableAlpha: true,
              label: __('Background Color', 'slide'),
              color: attributes.backgroundColor,
              onChangeComplete: ({ hex: backgroundColor }) =>
                setAttributes({ backgroundColor })
            }),
            (attributes.backgroundUrl || meta[backgroundUrlKey]) &&
            e(RangeControl, {
              label: __('Opacity', 'slide'),
              value: attributes.backgroundOpacity ? 100 - parseInt(attributes.backgroundOpacity, 10) : undefined,
              min: 0,
              max: 100,
              initialPosition: 0,
              onChange: (value) => {
                if (value === undefined) {
                  setAttributes({
                    backgroundOpacity: undefined
                  });
                } else {
                  setAttributes({
                    backgroundOpacity: 100 - value + ''
                  });
                }
              }
            }),
            !!attributes.backgroundColor && e(Button, {
              isDefault: true,
              onClick: () => {
                setAttributes({
                  backgroundColor: undefined
                });
              }
            }, __('Remove'))
          ),
          e(
            PanelBody,
            {
              title: __('Background Image', 'slide'),
              icon: 'format-image',
              initialOpen: false
            },
            e(MediaUpload, {
              onSelect: (media) => {
                if (!media || !media.url) {
                  setAttributes({
                    backgroundUrl: undefined,
                    backgroundId: undefined,
                    focalPoint: undefined
                  });
                  return;
                }

                setAttributes({
                  backgroundUrl: media.url,
                  backgroundId: media.id
                });
              },
              allowedTypes: ALLOWED_MEDIA_TYPES,
              value: attributes.backgroundId,
              render: ({ open }) => e(Button, {
                isDefault: true,
                onClick: open
              }, attributes.backgroundUrl ? __('Change') : __('Add Background Image'))
            }),
            ' ',
            !!attributes.backgroundUrl && e(Button, {
              isDefault: true,
              onClick: () => {
                setAttributes({
                  backgroundUrl: undefined,
                  backgroundId: undefined,
                  focalPoint: undefined
                });
              }
            }, __('Remove')),
            e('br'), e('br'),
            !!attributes.backgroundUrl && e(FocalPointPicker, {
              label: __('Focal Point Picker'),
              url: attributes.backgroundUrl,
              value: attributes.focalPoint,
              onChange: (focalPoint) => setAttributes({ focalPoint })
            }),
            !!attributes.backgroundUrl && e(RangeControl, {
              label: __('Opacity', 'slide'),
              value: attributes.backgroundOpacity ? parseInt(attributes.backgroundOpacity, 10) : undefined,
              min: 0,
              max: 100,
              initialPosition: 100,
              onChange: (value) => setAttributes({
                backgroundOpacity: value + ''
              })
            })
          )
        ),
        e(
          'section',
          {
            className,
            style: {
              color: attributes.color || undefined,
              backgroundColor: attributes.backgroundColor || undefined,
              // If a background color is set, disable the global gradient.
              backgroundImage: attributes.backgroundColor ? 'none' : undefined
            }
          },
          e(
            'div',
            {
              className: 'wp-block-slide-slide__background',
              style: {
                backgroundImage: attributes.backgroundUrl ? `url("${attributes.backgroundUrl}")` : undefined,
                backgroundPosition: attributes.focalPoint ? `${attributes.focalPoint.x * 100}% ${attributes.focalPoint.y * 100}%` : undefined,
                opacity: attributes.backgroundOpacity ? attributes.backgroundOpacity / 100 : undefined
              }
            }
          ),
          e(InnerBlocks)
        )
      );
    },
    save: ({ attributes }) => e(
      'section',
      {
        style: {
          color: attributes.color || undefined
        },
        'data-background-color': attributes.backgroundColor || undefined,
        'data-background-image': attributes.backgroundUrl ? attributes.backgroundUrl : undefined,
        'data-background-position': attributes.focalPoint ? `${attributes.focalPoint.x * 100}% ${attributes.focalPoint.y * 100}%` : undefined,
        'data-background-opacity': attributes.backgroundOpacity ? attributes.backgroundOpacity / 100 : undefined
      },
      e(InnerBlocks.Content)
    )
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
})(
  window.wp,
  (({
    i18n: { __ },
    element: { createElement: e },
    components: { BaseControl },
    compose: { withInstanceId },
    data: { select, dispatch }
  }) => {
    const fontFamilyUrlKey = 'presentation-font-url-family';
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
      Yrsa: { weight: ['300', '400', '500', '600', '700'] }
    };

    return withInstanceId(({ label, value, help, instanceId, onChange, className, ...props }) => {
      const id = `inspector-coblocks-font-family-${instanceId}`;
      const systemFonts = [
        { value: '', label: __('Default') },
        { value: 'Arial', label: 'Arial' },
        { value: 'Helvetica', label: 'Helvetica' },
        { value: 'Times New Roman', label: 'Times New Roman' },
        { value: 'Georgia', label: 'Georgia' }
      ];
      const fonts = [];

      // Add Google Fonts
      Object.keys(googleFonts).map((k) => {
        fonts.push(
          { value: k, label: k }
        );
      });

      systemFonts.reverse().map((font) => {
        fonts.unshift(font);
      });

      const onChangeValue = ({ target: { value } }) => {
        const googleFontsAttr = ':100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic';
        const isSystemFont = systemFonts.filter(function (font) {
          return font.label === value;
        }).length > 0;

        let url = '';

        if (!isSystemFont) {
          url = 'https://fonts.googleapis.com/css?family=' + value.replace(/ /g, '+') + googleFontsAttr;
        }

        onChange(value);
        dispatch('core/editor').editPost({
          meta: {
            [fontFamilyUrlKey]: url
          }
        });
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
              id,
              className: 'components-select-control__input components-select-control__input--coblocks-fontfamily',
              onChange: onChangeValue,
              'aria-describedby': help ? `${id}__help` : undefined,
              ...props
            },
            fonts.map((option, index) =>
              e('option', {
                key: `${option.label}-${option.value}-${index}`,
                value: option.value,
                selected: value === option.value ? 'selected' : ''
              }, option.label)
            )
          )
        )
      );
    });
  })(window.wp)
);
