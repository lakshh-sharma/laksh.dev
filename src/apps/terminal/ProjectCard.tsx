import type { Project } from "../../data/profile";
import { PROJECT_ICONS } from "../../data/projectIcons";

// Rich project view rendered inline in the terminal when a project is selected
// (`/projects <id>` or just typing its name in laksh mode): art on the left,
// formatted rundown on the right.
export function ProjectCard({ project }: { project: Project }) {
  const icon = PROJECT_ICONS[project.id];
  return (
    <div className="proj-card" style={{ "--accent": project.accent } as React.CSSProperties}>
      <div className="proj-icon">
        {icon ? (
          <img src={icon} alt={project.name} draggable={false} />
        ) : (
          <span className="proj-glyph">{project.glyph}</span>
        )}
      </div>

      <div className="proj-body">
        <div className="proj-head">
          <span className="proj-name">{project.name}</span>
          {project.year && <span className="proj-year">{project.year}</span>}
        </div>
        <div className="proj-tagline">{project.tagline}</div>

        <ul className="proj-bullets">
          {project.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>

        {project.stack.length > 0 && (
          <div className="proj-stack">
            {project.stack.map((t) => (
              <span className="proj-tag" key={t}>{t}</span>
            ))}
          </div>
        )}

        {project.links?.repo && (
          <a
            className="proj-link"
            href={`https://${project.links.repo}`}
            target="_blank"
            rel="noreferrer"
          >
            {project.links.repo} ↗
          </a>
        )}
      </div>
    </div>
  );
}
