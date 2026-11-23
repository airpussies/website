import React from "react";

// Building blocks for DefaultPage's intro/outro (styles in layout.scss)

// facts: [{ icon: "fa-users", value: "7", label: "…" }]
export function Facts({ facts }) {
  return (
    <div className="facts">
      {facts.map(f => (
        <div className="fact" key={f.label}>
          <span className="icon is-medium"><i className={`fas ${f.icon} fa-lg`} aria-hidden="true"/></span>
          <strong className="fact-value">{f.value}</strong>
          <span className="fact-label">{f.label}</span>
        </div>
      ))}
    </div>
  );
}

// children: the button (a Gatsby <Link> or an <a>)
export function Cta({ title, text, children }) {
  return (
    <div className="cta">
      <div>
        <h2 className="title is-4">{title}</h2>
        <p>{text}</p>
      </div>
      {children}
    </div>
  );
}
