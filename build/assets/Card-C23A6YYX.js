import{j as e}from"./index-Bb7dJ0St.js";function g({children:o,title:r,subtitle:a,className:c="",padding:t="md",variant:d="default",accentColor:n="blue"}){const s={none:"",sm:"p-4",md:"p-6",lg:"p-8"},l={blue:"from-accent-blue/20 to-transparent",purple:"from-accent-purple/20 to-transparent",pink:"from-accent-pink/20 to-transparent",cyan:"from-accent-cyan/20 to-transparent",emerald:"from-accent-emerald/20 to-transparent",orange:"from-accent-orange/20 to-transparent"},m={blue:"border-accent-blue/30",purple:"border-accent-purple/30",pink:"border-accent-pink/30",cyan:"border-accent-cyan/30",emerald:"border-accent-emerald/30",orange:"border-accent-orange/30"},i=`
    relative overflow-hidden
    bg-glass-light backdrop-blur-glass
    border border-glass-border
    shadow-glass
    rounded-glass
    transition-all duration-300
    hover:shadow-glass-lg hover:bg-glass-medium
  `,p={default:"",gradient:`bg-gradient-to-br ${l[n]}`,accent:`border-t-2 ${m[n]}`};return e.jsxs("div",{className:`${i} ${p[d]} ${c}`,children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"}),(r||a)&&e.jsxs("div",{className:`relative border-b border-glass-border ${s[t]}`,children:[r&&e.jsx("h3",{className:"text-lg font-semibold text-text-primary",children:r}),a&&e.jsx("p",{className:"mt-1 text-sm text-text-muted",children:a})]}),e.jsx("div",{className:`relative ${s[t]}`,children:o})]})}export{g as C};
