const QUICK_LINKS = [
  {
    name: 'Claude',
    url: 'https://claude.ai',
    iconPath: '/claude.png',
    color: 'from-[#D97757] to-[#B85C3C]',
  },
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    iconPath: '/gpt.png',
    color: 'from-[#10A37F] to-[#0D8B6B]',
  },
  {
    name: 'Perplexity',
    url: 'https://www.perplexity.ai',
    iconPath: '/perplexity.png',
    color: 'from-[#20808D] to-[#196770]',
  },
];

export function QuickLinksWidget() {
  return (
    <div className="glass p-6">
      <h3 className="text-lg font-semibold mb-4 gradient-text">Быстрые ссылки</h3>

      <div className="grid grid-cols-3 gap-3">
        {QUICK_LINKS.map((link) => (
          <a
            key={link.name}
            href={link.url}
            className={`bg-gradient-to-r ${link.color} p-3 rounded-glass-sm hover:scale-105 transition-transform duration-200 flex flex-col items-center justify-center gap-2 group`}
          >
            <img
              src={link.iconPath}
              alt={link.name}
              className="w-10 h-10 object-contain"
            />
            <span className="text-sm font-semibold text-white group-hover:text-white/90 text-center">
              {link.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
