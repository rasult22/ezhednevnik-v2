import{r as l,j as e}from"./index-xxW3EWhZ.js";const b=l.forwardRef(({label:o,error:t,helperText:n,autoSize:a=!1,maxHeight:c=500,className:u="",...d},i)=>{const x=l.useRef(null),s=i||x;l.useEffect(()=>{if(a&&s.current){const r=s.current;r.style.height="auto";const f=Math.min(r.scrollHeight,c);r.style.height=`${f}px`}},[d.value,a,c,s]);const m=`
      w-full px-4 py-3
      bg-glass-light backdrop-blur-glass
      border border-glass-border
      rounded-glass-sm
      text-text-primary
      transition-all duration-200 resize-none
      focus:outline-none focus:border-accent-blue/50 focus:shadow-glow-blue focus:bg-glass-medium
      disabled:opacity-40 disabled:cursor-not-allowed
      ${t?"border-danger/50 focus:border-danger focus:shadow-glow-pink":""}
      ${a?"overflow-y-hidden":"overflow-y-auto custom-scrollbar"}
      ${u}
    `;return e.jsxs("div",{className:"w-full",children:[o&&e.jsx("label",{className:"block mb-2 text-sm font-medium text-text-secondary",children:o}),e.jsx("textarea",{ref:s,className:m,...d}),t&&e.jsx("p",{className:"mt-2 text-sm text-danger",children:t}),n&&!t&&e.jsx("p",{className:"mt-2 text-sm text-text-muted",children:n})]})});b.displayName="Textarea";export{b as T};
