export interface TimelineItem {
  title: string;
  date: string;
  company: string;
  description: string;
  summary?: string;
}
export interface TimelineProps {
  items: TimelineItem[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="timeline">
      {items.map((item) => (
        <article
          className="timeline-entry"
          key={item.title + item.date}
          data-reveal
        >
          <div className="timeline-heading">
            <div>
              <h3>{item.title}</h3>
              <p>{item.company}</p>
            </div>
            <span>{item.date}</span>
          </div>
          {item.summary && <p className="timeline-summary">{item.summary}</p>}
          <details className="timeline-details">
            <summary>Read more</summary>
            <p>{item.description.trim()}</p>
          </details>
        </article>
      ))}
    </div>
  );
}
