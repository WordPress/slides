import FontPicker from './font-picker';
import FontWeightPicker from './font-weight-picker';
import CodeEditor from './code-editor';

const {
  i18n: { __ },
  element: { createElement: e, useEffect },
  plugins: { registerPlugin },
  editPost: { PluginDocumentSettingPanel },
  data: { useSelect, useDispatch },
  components: { TextareaControl, RangeControl, SelectControl, ToggleControl, Button, FocalPointPicker, ExternalLink, TextControl, RadioControl, CheckboxControl },
  blockEditor: { MediaUpload, __experimentalGradientPickerControl, ColorPalette },
  url: { addQueryArgs }
} = window.wp;

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
const containKey = 'presentation-contain';
const ALLOWED_MEDIA_TYPES = ['image'];

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

    let width = parseInt((meta[widthKey] || '960'), 10) + 30;

    if (meta[containKey] === 'true') {
      rules.width = 'auto !important';
      rules.height = 'auto !important';
      bodyRules.width = meta[widthKey] ? meta[widthKey] + 'px !important' : '960px !important';
      bodyRules.height = '720px !important';
    } else {
      width += 100;
    }

    useEffect(() => {
      if (meta[containKey] === 'true') {
        document.documentElement.classList.add('presentation-contain');
      } else {
        document.documentElement.classList.remove('presentation-contain');
      }
    });

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
      e(
        'style',
        null,
          `.editor-styles-wrapper .editor-writing-flow { width: ${width}px !important; }`
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
        e(CheckboxControl, {
          label: __('Contain view to dimensions', 'slide'),
          help: __('This can be useful if positions from background and full width blocks must be preserved.', 'slide'),
          checked: meta[containKey] === 'true',
          onChange: (value) => {
            editPost({
              meta: {
                [containKey]: value + ''
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
        e(FontWeightPicker, {
          label: __('Font Weight', 'slide'),
          value: meta[fontWeightHeadingKey] || '400',
          onChange: (value) => updateMeta(value, fontWeightHeadingKey),
          fontFamily: meta[fontFamilyHeadingKey]
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
            __('Print (Save as PDF).', 'slide')
          ),
          e('br'),
          __('Enable backgrounds and remove margins.', 'slide')
        )
      )
    ];
  }
});
