import katex from 'katex';
import * as React from 'react';

import 'katex/dist/katex.min.css';

type KatexSpanProps = { text: string; display?: boolean } & React.ComponentPropsWithoutRef<'span'>;

/** Renders a single LaTeX expression (no delimiters needed). */
export default function KatexSpan({ text, display = false, ...delegated }: KatexSpanProps) {
  const html = React.useMemo(
    () =>
      katex.renderToString(text.replace(/^\$+|\$+$/g, ''), {
        throwOnError: false,
        displayMode: display,
      }),
    [text, display]
  );
  return <span {...delegated} dangerouslySetInnerHTML={{ __html: html }} />;
}
