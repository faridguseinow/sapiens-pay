import type { ReactNode } from "react";

export function toAnchorId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function getArticleHeadings(content: string) {
  return content
    .split("\n")
    .filter((line) => /^#{2,3}\s+/.test(line))
    .map((line) => line.replace(/^#{2,3}\s+/, "").trim())
    .filter(Boolean);
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\((?:https?:\/\/|\/)[^)]+\))/g);
  return parts.map((part, index) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={index}>{bold[1]}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)]+)\)$/);
    if (link) {
      const external = link[2].startsWith("http");
      return <a key={index} href={link[2]} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{link[1]}</a>;
    }
    return part;
  });
}

export function ArticleContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: ReactNode[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (!list.length) return;
    elements.push(
      <ul key={`list-${elements.length}`}>
        {list.map((item, index) => (
          <li key={`${item}-${index}`}>{renderInline(item)}</li>
        ))}
      </ul>,
    );
    list = [];
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    if (line.startsWith("- ")) {
      list.push(line.slice(2));
      return;
    }

    flushList();
    if (!line) return;

    if (line.startsWith("### ")) {
      const text = line.slice(4);
      elements.push(
        <h3 key={index} id={toAnchorId(text)}>
          {renderInline(text)}
        </h3>,
      );
    } else if (line.startsWith("## ")) {
      const text = line.slice(3);
      elements.push(
        <h2 key={index} id={toAnchorId(text)}>
          {renderInline(text)}
        </h2>,
      );
    } else {
      elements.push(<p key={index}>{renderInline(line)}</p>);
    }
  });

  flushList();
  return <>{elements}</>;
}
