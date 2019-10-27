import FontPicker from './font-picker';

const {
  hooks: { addFilter },
  element: { createElement: e, Fragment: f },
  blockEditor: { InspectorControls },
  components: { PanelBody, SelectControl },
  i18n: { __ }
} = window.wp;

const allowedBlocks = new Set(['core/paragraph']);

addFilter(
  'blocks.registerBlockType',
  'slide/register-block-attributes',
  (settings) => {
    if (!allowedBlocks.has(settings.name)) {
      return settings;
    }

    return {
      ...settings,
      attributes: {
        ...settings.attributes,
        fontFamily: {
          type: 'string'
        },
        fontWeight: {
          type: 'string'
        }
      }
    };
  }
);

addFilter(
  'editor.BlockEdit',
  'slide/control-block-attributes',
  (BlockEdit) => {
    return (props) => {
      const { attributes, setAttributes, isSelected, name } = props;
      return e(
        f,
        null,
        e(BlockEdit, props),
        isSelected && allowedBlocks.has(name) && e(
          InspectorControls,
          null,
          e(
            PanelBody,
            {
              title: __('Font', 'slide'),
              icon: 'format-text',
              initialOpen: false
            },
            e(FontPicker, {
              label: __('Font Family', 'slide'),
              value: attributes.fontFamily,
              onChange: (fontFamily) => setAttributes({ fontFamily })
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
              value: attributes.fontWeight || '400',
              onChange: (fontWeight) => setAttributes({ fontWeight })
            })
          )
        )
      );
    };
  }
);

addFilter(
  'editor.BlockListBlock',
  'slide/edit-block-attributes',
  (BlockListBlock) => {
    return (props) => {
      if (allowedBlocks.has(props.block.name)) {
        const { wrapperProps = {}, attributes } = props;
        const { style = {} } = wrapperProps;
        const { fontFamily, fontWeight } = attributes;

        if (fontFamily) {
          props = {
            ...props,
            wrapperProps: {
              ...wrapperProps,
              style: {
                ...style,
                fontFamily,
                fontWeight
              }
            }
          };
        }
      }

      return e(BlockListBlock, props);
    };
  }
);

addFilter(
  'blocks.getSaveContent.extraProps',
  'slide/save-block-attributes',
  (extraProps, blockType, attributes) => {
    if (!allowedBlocks.has(blockType.name)) {
      return extraProps;
    }

    const { fontFamily, fontWeight } = attributes;
    const { style = {} } = extraProps;

    return {
      ...extraProps,
      style: {
        ...style,
        fontFamily,
        fontWeight
      }
    };
  }
);
