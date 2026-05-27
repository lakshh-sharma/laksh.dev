import sukunaUrl from "../../assets/sukuna.svg";
import { profile } from "../../data/profile";

export function ClaudeBoot() {
  return (
    <div className="cc-box">
      <div className="cc-box-label">
        laksh <span className="v">v2.1.150</span>
      </div>

      <div className="cc-left">
        <div className="cc-welcome">
          Welcome back <b>Laksh</b>!
        </div>
        <img className="cc-sprite" src={sukunaUrl} alt="Sukuna pixel sprite" />
        <div className="model">
          Sukuna 4.7 <span className="a">(1M context)</span> with high effort <span className="a">·</span> {profile.role} <span className="a">·</span>
        </div>
        <div className="org">{profile.school} · {profile.tagline}</div>
        <div className="cwd">~/Documents/Claude/Projects/crAIwl</div>
      </div>

      <div className="cc-right">
        <div className="cc-sec">
          <h4>Getting started</h4>
          <div className="ln">Ask me anything — or run <span className="cmd">about</span> / <span className="cmd">projects</span></div>
          <div className="ln"><span className="cmd">stack</span> lists my tools · <span className="cmd">contact</span> to reach me</div>
          <div className="ln"><span className="cmd">ls</span> and <span className="cmd">cd</span> work — poke around the filesystem</div>
        </div>
        <div className="cc-sec">
          <h4>What's new</h4>
          {profile.whatsNew.map((w, i) => (
            <div className="ln" key={i}>
              <span className="date">{w.date}</span> · {w.text}{" "}
              {w.note && <span className="dim">{w.note}</span>}
            </div>
          ))}
        </div>
        <div className="cc-mode">
          <span className="arrows">▸▸</span>
          <span><span className="mn">auto mode on</span> (<kbd>shift+tab</kbd> to cycle)</span>
          <span className="right">
            <span className="dot">●</span> high <span className="eff">/effort</span>
          </span>
        </div>
      </div>
    </div>
  );
}
