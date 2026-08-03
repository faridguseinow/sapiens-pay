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

export function getArticleHeadingEntries(content: string) {
  const counts = new Map<string, number>();
  return content.split("\n").flatMap((line) => {
    const match = line.match(/^(#{2,4})\s+(.+)/);
    if (!match) return [];
    const text = match[2].trim();
    const base = toAnchorId(text) || "section";
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    return match[1].length <= 3 ? [{ text, id: count ? `${base}-${count + 1}` : base, level: match[1].length }] : [];
  });
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|!\[[^\]]*\]\((?:https?:\/\/|\/)[^)]+\)|\[[^\]]+\]\((?:https?:\/\/|\/)[^)]+\))/g);
  return parts.map((part, index) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={index}>{bold[1]}</strong>;
    const italic = part.match(/^\*([^*]+)\*$/);
    if (italic) return <em key={index}>{italic[1]}</em>;
    const code = part.match(/^`([^`]+)`$/);
    if (code) return <code key={index}>{code[1]}</code>;
    const image = part.match(/^!\[([^\]]*)\]\(((?:https?:\/\/|\/)[^)]+)\)$/);
    // Inline editor images may use any validated HTTPS source; dimensions are unknown at authoring time.
    // eslint-disable-next-line @next/next/no-img-element
    if (image) return <img key={index} src={image[2]} alt={image[1]} loading="lazy" decoding="async" />;
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
  let orderedList: string[] = [];
  let tableRows: string[][] = [];
  const headingCounts = new Map<string, number>();
  const headingId = (text: string) => {
    const base = toAnchorId(text) || "section";
    const count = headingCounts.get(base) ?? 0;
    headingCounts.set(base, count + 1);
    return count ? `${base}-${count + 1}` : base;
  };

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

  const flushOrderedList = () => {
    if (!orderedList.length) return;
    elements.push(<ol key={`ordered-${elements.length}`}>{orderedList.map((item, index) => <li key={`${item}-${index}`}>{renderInline(item)}</li>)}</ol>);
    orderedList = [];
  };

  const flushTable = () => {
    if (!tableRows.length) return;
    const rows = tableRows.filter((row) => !row.every((cell) => /^:?-{3,}:?$/.test(cell)));
    const [head, ...body] = rows;
    if (head) elements.push(
      <div className="article-table-wrap" key={`table-${elements.length}`} tabIndex={0}>
        <table><thead><tr>{head.map((cell, i) => <th key={i}>{renderInline(cell)}</th>)}</tr></thead>
          <tbody>{body.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{renderInline(cell)}</td>)}</tr>)}</tbody></table>
      </div>,
    );
    tableRows = [];
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    const unorderedListItem = line.match(/^[-*]\s+(.+)$/);
    if (unorderedListItem) {
      flushOrderedList(); flushTable();
      list.push(unorderedListItem[1]);
      return;
    }

    const orderedListItem = line.match(/^\d+[.)]\s+(.+)$/);
    if (orderedListItem) {
      flushList(); flushTable();
      orderedList.push(orderedListItem[1]);
      return;
    }

    if (/^\|.*\|$/.test(line)) {
      flushList(); flushOrderedList();
      tableRows.push(line.slice(1, -1).split("|").map((cell) => cell.trim()));
      return;
    }

    flushList(); flushOrderedList(); flushTable();
    if (!line) return;

    if (/^---+$/.test(line)) {
      elements.push(<hr key={index} />);
    } else if (line.startsWith("#### ")) {
      const text = line.slice(5);
      elements.push(<h4 key={index} id={headingId(text)}>{renderInline(text)}</h4>);
    } else if (line.startsWith("### ")) {
      const text = line.slice(4);
      elements.push(
        <h3 key={index} id={headingId(text)}>
          {renderInline(text)}
        </h3>,
      );
    } else if (line.startsWith("## ")) {
      const text = line.slice(3);
      elements.push(
        <h2 key={index} id={headingId(text)}>
          {renderInline(text)}
        </h2>,
      );
    } else if (line.startsWith("> [!INFO] ")) {
      elements.push(<aside key={index} className="article-callout article-callout--info">{renderInline(line.slice(10))}</aside>);
    } else if (line.startsWith("> [!WARNING] ")) {
      elements.push(<aside key={index} className="article-callout article-callout--warning">{renderInline(line.slice(13))}</aside>);
    } else if (line.startsWith("> ")) {
      elements.push(<blockquote key={index}>{renderInline(line.slice(2))}</blockquote>);
    } else if (line.startsWith("[CTA: ") && line.endsWith("]")) {
      const match = line.match(/^\[CTA: ([^|]+)\| ((?:https?:\/\/|\/)[^\]]+)\]$/);
      elements.push(match ? <p className="article-cta" key={index}><a href={match[2]}>{match[1]}</a></p> : <p key={index}>{renderInline(line)}</p>);
    } else {
      elements.push(<p key={index}>{renderInline(line)}</p>);
    }
  });

  flushList(); flushOrderedList(); flushTable();
  return <>{elements}</>;
}
