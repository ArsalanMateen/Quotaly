import { useMemo } from "react";
import { Marked } from "marked";
import DOMPurify from "dompurify";
import Prism from "prismjs";
import "prismjs/components/prism-python.js";
import "prismjs/components/prism-javascript.js";
import "prismjs/components/prism-typescript.js";
import "prismjs/components/prism-jsx.js";
import "prismjs/components/prism-tsx.js";
import "prismjs/components/prism-bash.js";
import "prismjs/components/prism-json.js";
import "prismjs/components/prism-sql.js";
import "prismjs/components/prism-yaml.js";
import "prismjs/components/prism-markdown.js";
import "prismjs/components/prism-css.js";
import "prismjs/components/prism-go.js";
import "prismjs/components/prism-rust.js";
import "prismjs/components/prism-c.js";
import "prismjs/components/prism-cpp.js";
import "prismjs/components/prism-csharp.js";
import "prismjs/components/prism-java.js";
import "prismjs/components/prism-docker.js";
import styles from "./MarkdownView.module.css";

const ALIASES = {
  py: "python",
  js: "javascript",
  ts: "typescript",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  yml: "yaml",
  md: "markdown",
  golang: "go",
  cs: "csharp",
};

function escapeHtml(str) {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const markdownParser = new Marked({
  gfm: true,
  breaks: true,
});

markdownParser.use({
  renderer: {
    code({ text, lang }) {
      const rawLang = (lang || "").trim().toLowerCase();
      const language = ALIASES[rawLang] || rawLang;
      const grammar = Prism.languages[language];
      const highlighted = grammar
        ? Prism.highlight(text, grammar, language)
        : escapeHtml(text);
      const displayLang = language || "code";

      return (
        `<div class="${styles.codeBlock}">` +
        `<div class="${styles.codeHeader}">` +
        `<span class="${styles.codeLang}">${displayLang}</span>` +
        `</div>` +
        `<pre class="${styles.codePre}"><code class="language-${language || "none"}">${highlighted}</code></pre>` +
        `</div>`
      );
    },
  },
});

function sanitizeHtml(rawHtml) {
  return DOMPurify.sanitize(rawHtml);
}

export function MarkdownView({ content, className = "" }) {
  const sanitizedHtml = useMemo(() => {
    if (!content) return "";
    try {
      const rawHtml = markdownParser.parse(content);
      return sanitizeHtml(rawHtml);
    } catch {
      return content;
    }
  }, [content]);

  if (!content) return null;

  return (
    <div
      className={`${styles.markdown} ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
