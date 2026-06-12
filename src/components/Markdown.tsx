/** Markdown tối giản: ##/### heading, **bold**, - list, dòng trống → đoạn. */
export function Markdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];

  const inline = (s: string) =>
    s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );

  let list: string[] = [];
  const flush = (key: string) => {
    if (list.length) {
      out.push(
        <ul key={key} className="my-1 list-disc space-y-0.5 pl-5">
          {list.map((li, i) => (
            <li key={i}>{inline(li)}</li>
          ))}
        </ul>
      );
      list = [];
    }
  };

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();
    if (line.startsWith("### ")) {
      flush(`f${i}`);
      out.push(<h4 key={i} className="mt-2 font-semibold">{inline(line.slice(4))}</h4>);
    } else if (line.startsWith("## ")) {
      flush(`f${i}`);
      out.push(<h3 key={i} className="mt-3 text-base font-bold text-secondary">{inline(line.slice(3))}</h3>);
    } else if (/^[-*]\s/.test(line)) {
      list.push(line.replace(/^[-*]\s/, ""));
    } else if (line === "") {
      flush(`f${i}`);
    } else {
      flush(`f${i}`);
      out.push(<p key={i} className="leading-relaxed">{inline(line)}</p>);
    }
  });
  flush("end");

  return <div className="space-y-1 text-sm">{out}</div>;
}
