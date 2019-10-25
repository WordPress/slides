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
  const { TextareaControl, PanelBody, RangeControl, SelectControl, ToggleControl, Button, FocalPointPicker, ExternalLink, Notice, TextControl, RadioControl } = components;
  const { MediaUpload, __experimentalGradientPickerControl, InnerBlocks, InspectorControls, RichTextToolbarButton, ColorPalette } = blockEditor;
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
  const fontFamilyUrlKey = 'presentation-font-family-url';
  const fontFamilyHeadingKey = 'presentation-font-family-heading';
  const fontFamilyHeadingUrlKey = 'presentation-font-family-heading-url';
  const fontWeightHeadingKey = 'presentation-font-weight-heading';
  const transitionKey = 'presentation-transition';
  const backgroundTransitionKey = 'presentation-background-transition';
  const transitionSpeedKey = 'presentation-transition-speed';
  const controlsKey = 'presentation-controls';
  const progressKey = 'presentation-progress';
  const widthKey = 'presentation-width';
  const horizontalPaddingKey = 'presentation-horizontal-padding';
  const verticalPaddingKey = 'presentation-vertical-padding';
  const colorPaletteKey = 'presentation-color-palette';

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
      block.name === 'core/paragraph'
        ? createBlock('core/heading')
        : createBlock(block.name, block.attributes)
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

      const bodyRules = {
        'background-color': meta[bgColorKey] || '#fff',
        'background-image': meta[backgroundGradientKey] || 'none',
        color: meta[colorKey] || '#000',
        'font-size': (meta[fontSizeKey] || '42') + 'px',
        'font-family': meta[fontFamilyKey] || 'Helvetica, sans-serif'
      };

      const rules = {
        width: meta[widthKey] ? meta[widthKey] + 'px !important' : undefined,
        'padding-top': meta[verticalPaddingKey] ? meta[verticalPaddingKey] : '0.2em',
        'padding-bottom': meta[verticalPaddingKey] ? meta[verticalPaddingKey] : '0.2em',
        'padding-left': meta[horizontalPaddingKey] ? meta[horizontalPaddingKey] : '0.2em',
        'padding-right': meta[horizontalPaddingKey] ? meta[horizontalPaddingKey] : '0.2em'
      };

      const backgroundRules = {
        'background-image': meta[backgroundUrlKey] ? `url("${meta[backgroundUrlKey]}")` : 'none',
        'background-size': 'cover',
        'background-position': meta[backgroundPositionKey] ? meta[backgroundPositionKey] : '50% 50%',
        opacity: meta[backgroundOpacityKey] ? meta[backgroundOpacityKey] / 100 : 1
      };

      return [
        ...Object.keys(bodyRules).map((key) => {
          return e(
            'style',
            null,
            `.wp-block-slide-slide__body {${key}:${bodyRules[key]}}`
          );
        }),
        ...Object.keys(rules).map((key) => {
          return e(
            'style',
            null,
            `.wp-block-slide-slide {${key}:${rules[key]}}`
          );
        }),
        ...Object.keys(backgroundRules).map((key) => {
          return e(
            'style',
            null,
            `.wp-block-slide-slide__background {${key}:${backgroundRules[key]}}`
          );
        }),
        e('style', null, meta[cssKey]),
        !!meta[fontFamilyUrlKey] && e(
          'style',
          null,
          `@import url("${meta[fontFamilyUrlKey]}")`
        ),
        !!meta[fontFamilyHeadingKey] && e(
          'style',
          null,
          (meta[fontFamilyHeadingUrlKey] ? `@import url("${meta[fontFamilyHeadingUrlKey]}");` : '') +
          `.wp-block-slide-slide h1, .wp-block-slide-slide h2, .wp-block-slide-slide h3, .wp-block-slide-slide h4, .wp-block-slide-slide h5, .wp-block-slide-slide h6 { font-family: ${meta[fontFamilyHeadingKey]} }`
        ),
        !!meta[fontWeightHeadingKey] && e(
          'style',
          null,
          `.wp-block-slide-slide h1, .wp-block-slide-slide h2, .wp-block-slide-slide h3, .wp-block-slide-slide h4, .wp-block-slide-slide h5, .wp-block-slide-slide h6 { font-weight: ${meta[fontWeightHeadingKey]} }`
        ),
        !!meta[widthKey] && e(
          'style',
          null,
          `.editor-styles-wrapper .editor-writing-flow { width: ${parseInt(meta[widthKey], 10) + 130}px !important; }`
        ),
        e(
          PluginDocumentSettingPanel,
          {
            name: 'slide-dimensions',
            title: __('Setup', 'slide'),
            icon: 'editor-expand'
          },
          e(RadioControl, {
            selected: meta[widthKey] === '1280' ? '16:9' : '',
            options: [
              { label: __('Standard 4:3'), value: '' },
              { label: __('Widescreen 16:9'), value: '16:9' }
            ],
            onChange: (value) => {
              editPost({
                meta: {
                  [widthKey]: value === '16:9' ? '1280' : ''
                }
              });
            }
          }),
          e(TextControl, {
            label: __('Horizontal Padding'),
            placeholder: '0.2em',
            value: meta[horizontalPaddingKey],
            onChange: (value) => updateMeta(value, horizontalPaddingKey)
          }),
          e(TextControl, {
            label: __('Vertical Padding'),
            placeholder: '0.2em',
            value: meta[verticalPaddingKey],
            onChange: (value) => updateMeta(value, verticalPaddingKey)
          })
        ),
        e(
          PluginDocumentSettingPanel,
          {
            name: 'slide-font',
            title: __('Base Font', 'slide'),
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
            onChange: (value, fontUrl) => {
              editPost({
                meta: {
                  [fontFamilyKey]: value,
                  [fontFamilyUrlKey]: fontUrl
                }
              });
            }
          }),
          e(ColorPalette, {
            label: __('Color', 'slide'),
            value: meta[colorKey],
            onChange: (value) => updateMeta(value, colorKey)
          })
        ),
        e(
          PluginDocumentSettingPanel,
          {
            name: 'slide-heading-font',
            title: __('Heading Font', 'slide'),
            icon: 'text'
          },
          e(FontPicker, {
            label: __('Font Family', 'slide'),
            value: meta[fontFamilyHeadingKey],
            onChange: (value, fontUrl) => {
              editPost({
                meta: {
                  [fontFamilyHeadingKey]: value,
                  [fontFamilyHeadingUrlKey]: fontUrl
                }
              });
            }
          }),
          e(SelectControl, {
            label: __('Font Weight', 'slide'),
            help: __('Depending on the Font, some options may not be available.'),
            options: [
              { value: '100', label: __('Thin', 'slide') },
              { value: '200', label: __('Extra Light', 'slide') },
              { value: '300', label: __('Light', 'slide') },
              { value: '400', label: __('Normal', 'slide') },
              { value: '500', label: __('Medium', 'slide') },
              { value: '600', label: __('Semi Bold', 'slide') },
              { value: '700', label: __('Bold', 'slide') },
              { value: '800', label: __('Extra Bold', 'slide') },
              { value: '900', label: __('Black', 'slide') }
            ],
            value: meta[fontWeightHeadingKey] || '400',
            onChange: (value) => updateMeta(value, fontWeightHeadingKey)
          })
        ),
        e(
          PluginDocumentSettingPanel,
          {
            name: 'slide-background',
            title: __('Background', 'slide'),
            icon: 'art'
          },
          e(ColorPalette, {
            label: __('Background Color', 'slide'),
            value: meta[bgColorKey],
            onChange: (value) => {
              editPost({
                meta: {
                  ...meta,
                  [bgColorKey]: value,
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
                  [backgroundUrlKey]: '',
                  [backgroundIdKey]: '',
                  [backgroundPositionKey]: '',
                  [backgroundOpacityKey]: ''
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
            name: 'slide-palette',
            title: __('Color Palette', 'slide'),
            icon: 'art'
          },
          e(TextareaControl, {
            label: __('Comma separated list of color values. Please refresh the page to be able to use the palette.', 'slide'),
            value: meta[colorPaletteKey],
            onChange: (value) => updateMeta(value, colorPaletteKey)
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
            label: __('Background Transition Style', 'slide'),
            options: [
              { value: 'none', label: __('None', 'slide') },
              { value: 'fade', label: __('Fade', 'slide') },
              { value: 'slide', label: __('Slide', 'slide') },
              { value: 'convex', label: __('Convex', 'slide') },
              { value: 'concave', label: __('Concave', 'slide') },
              { value: 'zoom', label: __('Zoom', 'slide') }
            ],
            value: meta[backgroundTransitionKey],
            onChange: (value) => updateMeta(value, backgroundTransitionKey)
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
      },
      backgroundSize: {
        type: 'string'
      },
      hidden: {
        type: 'boolean'
      },
      backgroundIframeUrl: {
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
              title: __('Speaker Notes', 'slide'),
              icon: 'edit',
              initialOpen: false
            },
            e(TextareaControl, {
              label: __('Anything you want to remember.', 'slide'),
              value: attributes.notes,
              onChange: (notes) => setAttributes({ notes }),
              rows: 10
            })
          ),
          e(
            PanelBody,
            {
              title: __('Font', 'slide'),
              icon: 'text',
              initialOpen: false
            },
            e(ColorPalette, {
              label: __('Color', 'slide'),
              value: attributes.color,
              onChange: (color) =>
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
            e(ColorPalette, {
              label: __('Background Color', 'slide'),
              value: attributes.backgroundColor,
              onChange: (backgroundColor) =>
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
                    backgroundSize: undefined,
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
                  backgroundSize: undefined,
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
            }),
            !!attributes.backgroundUrl && e(RadioControl, {
              label: __('Size', 'slide'),
              selected: attributes.backgroundSize,
              options: [
                { label: __('Cover'), value: 'cover' },
                { label: __('Contain'), value: 'contain' }
              ],
              onChange: (backgroundSize) => setAttributes({
                backgroundSize
              })
            })
          ),
          e(
            PanelBody,
            {
              title: __('Background Iframe', 'slide'),
              icon: 'format-video',
              initialOpen: false
            },
            e(TextControl, {
              label: __('Iframe URL'),
              value: attributes.backgroundIframeUrl,
              onChange: (backgroundIframeUrl) => setAttributes({ backgroundIframeUrl })
            }),
            e('br'), e('br'),
            !!attributes.backgroundIframeUrl && e(RangeControl, {
              label: __('Opacity', 'slide'),
              value: attributes.backgroundOpacity ? parseInt(attributes.backgroundOpacity, 10) : undefined,
              min: 0,
              max: 100,
              initialPosition: 100,
              onChange: (value) => setAttributes({
                backgroundOpacity: value + ''
              })
            })
          ),
          e(
            PanelBody,
            {
              title: __('Visibility', 'slide'),
              icon: 'visibility',
              initialOpen: false
            },
            e(ToggleControl, {
              label: __('Hide Slide', 'slide'),
              checked: attributes.hidden,
              onChange: (hidden) => setAttributes({ hidden })
            })
          )
        ),
        attributes.hidden && e(
          Notice,
          { status: 'warning', isDismissible: false },
          'This slide is hidden'
        ),
        e(
          'div',
          {
            className: 'wp-block-slide-slide__body',
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
                backgroundSize: attributes.backgroundSize ? attributes.backgroundSize : undefined,
                opacity: attributes.backgroundOpacity ? attributes.backgroundOpacity / 100 : undefined
              }
            },
            !!attributes.backgroundIframeUrl && e('iframe', {
              src: attributes.backgroundIframeUrl
            })
          ),
          e(
            'section',
            { className },
            e(InnerBlocks)
          )
        )
      );
    },
    save: ({ attributes }) => e(
      attributes.hidden ? 'div' : 'section',
      {
        style: {
          color: attributes.color || undefined,
          display: attributes.hidden ? 'none' : undefined
        },
        'data-background-color': attributes.backgroundColor || undefined,
        'data-background-image': attributes.backgroundUrl ? attributes.backgroundUrl : undefined,
        'data-background-position': attributes.focalPoint ? `${attributes.focalPoint.x * 100}% ${attributes.focalPoint.y * 100}%` : undefined,
        'data-background-opacity': attributes.backgroundOpacity ? attributes.backgroundOpacity / 100 : undefined,
        'data-background-iframe': attributes.backgroundIframeUrl ? attributes.backgroundIframeUrl : undefined,
        'data-background-size': attributes.backgroundSize ? attributes.backgroundSize : undefined
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
    compose: { withInstanceId }
  }) => {
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

      systemFonts.map((font) => {
        fonts.push(font);
      });

      function sortThings (a, b) {
        return a > b ? 1 : b > a ? -1 : 0;
      }

      // Add Google Fonts
      Object.keys(googleFonts).sort(sortThings).map((k) => {
        fonts.push(
          { value: k, label: k }
        );
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
  })(window.wp)
);
