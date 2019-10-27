const {
  blocks: { createBlock },
  data: { subscribe, select, dispatch }
} = window.wp;

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
