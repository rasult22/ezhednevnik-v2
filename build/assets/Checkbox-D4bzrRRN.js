import{j as e}from"./index-xxW3EWhZ.js";import{m as a}from"./motion-D6jSWcB8.js";function o({label:s,className:t="",...r}){return e.jsxs("label",{className:"inline-flex items-center cursor-pointer group",children:[e.jsxs("div",{className:"relative",children:[e.jsx("input",{type:"checkbox",className:"sr-only peer",...r}),e.jsx(a.div,{className:`
            w-6 h-6
            rounded-lg
            border-2
            transition-all duration-200
            ${r.checked?"bg-gradient-to-br from-accent-emerald to-accent-cyan border-accent-emerald shadow-glow-success":"bg-glass-light border-glass-border hover:border-accent-blue/50"}
            peer-focus:ring-2 peer-focus:ring-accent-blue/50 peer-focus:ring-offset-2 peer-focus:ring-offset-dark-300
            peer-disabled:opacity-40 peer-disabled:cursor-not-allowed
            ${t}
          `,whileTap:{scale:r.disabled?1:.9},children:r.checked&&e.jsx(a.svg,{initial:{scale:0,opacity:0},animate:{scale:1,opacity:1},transition:{type:"spring",stiffness:500,damping:30},className:"w-full h-full text-white p-0.5",viewBox:"0 0 20 20",fill:"currentColor",children:e.jsx("path",{fillRule:"evenodd",d:"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",clipRule:"evenodd"})})})]}),s&&e.jsx("span",{className:"ml-3 text-sm text-text-secondary group-hover:text-text-primary transition-colors",children:s})]})}export{o as C};
