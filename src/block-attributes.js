import FontPicker from './font-picker';
import FontWeightPicker from './font-weight-picker';

const {
  hooks: { addFilter },
  element: { createElement: e, Fragment: f },
  blockEditor: { InspectorControls },
  components: { PanelBody },
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
            e(FontWeightPicker, {
              label: __('Font Weight', 'slide'),
              value: attributes.fontWeight || '400',
              onChange: (fontWeight) => setAttributes({ fontWeight }),
              fontFamily: attributes.fontFamily
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
