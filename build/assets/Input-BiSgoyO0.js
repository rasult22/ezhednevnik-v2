import{r as n,j as s}from"./index-D89efSz-.js";const c=n.forwardRef(({label:e,error:t,helperText:a,className:o="",...l},d)=>{const r=`
      w-full px-4 py-3
      bg-glass-light backdrop-blur-glass
      border border-glass-border
      rounded-glass-sm
      text-text-primary
      transition-all duration-200
      focus:outline-none focus:border-accent-blue/50 focus:shadow-glow-blue focus:bg-glass-medium
      disabled:opacity-40 disabled:cursor-not-allowed
      ${t?"border-danger/50 focus:border-danger focus:shadow-glow-pink":""}
      ${o}
    `;return s.jsxs("div",{className:"w-full",children:[e&&s.jsx("label",{className:"block mb-2 text-sm font-medium text-text-secondary",children:e}),s.jsx("input",{ref:d,className:r,...l}),t&&s.jsx("p",{className:"mt-2 text-sm text-danger",children:t}),a&&!t&&s.jsx("p",{className:"mt-2 text-sm text-text-muted",children:a})]})});c.displayName="Input";export{c as I};
