import CodeEditor from './code-editor';

const {
  i18n: { __ },
  blocks: { registerBlockType },
  element: { createElement: e, Fragment },
  data: { useSelect },
  components: { TextareaControl, PanelBody, RangeControl, ToggleControl, Button, FocalPointPicker, Notice, TextControl, RadioControl },
  blockEditor: { MediaUpload, InnerBlocks, InspectorControls, ColorPalette }
} = window.wp;
const ALLOWED_MEDIA_TYPES = ['image'];
const backgroundUrlKey = 'presentation-background-url';

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
    },
    backgroundSvg: {
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
            title: __('Background SVG', 'slide'),
            icon: 'format-video',
            initialOpen: false
          },
          e(CodeEditor, {
            mode: 'htmlmixed',
            value: attributes.backgroundSvg,
            onChange: (backgroundSvg) => setAttributes({ backgroundSvg })
          }),
          e('br'), e('br'),
          !!attributes.backgroundSvg && e(RangeControl, {
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
          }),
          !!attributes.backgroundSvg && e('div', {
            dangerouslySetInnerHTML: {
              __html: attributes.backgroundSvg
            }
          })
        ),
        e(
          'section',
          { className },
          e(InnerBlocks)
        )
      ),
      e(TextareaControl, {
        label: __('Speaker notes', 'slide'),
        value: attributes.notes,
        onChange: (notes) => setAttributes({ notes }),
        rows: 5
      })
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
      'data-background-size': attributes.backgroundSize ? attributes.backgroundSize : undefined,
      'data-background-svg': attributes.backgroundSvg ? attributes.backgroundSvg : undefined
    },
    e(InnerBlocks.Content)
  )
});
