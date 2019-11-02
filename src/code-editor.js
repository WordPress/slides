const {
  element: { createElement: e, useRef, useEffect, memo },
  codeEditor: { initialize, defaultSettings }
} = window.wp;

export default memo(({ onChange, mode, ...props }) => {
  const ref = useRef();

  useEffect(() => {
    const editor = initialize(ref.current, {
      ...defaultSettings,
      codemirror: {
        ...defaultSettings.codemirror,
        tabSize: 2,
        mode,
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
