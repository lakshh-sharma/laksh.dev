interface Props { title?: string; body?: string; }

export default function FileViewer({ title, body }: Props) {
  return (
    <div className="viewer">
      <div className="doc">
        {title && <h1>{title}</h1>}
        <div>{body ?? "(empty file)"}</div>
      </div>
    </div>
  );
}
