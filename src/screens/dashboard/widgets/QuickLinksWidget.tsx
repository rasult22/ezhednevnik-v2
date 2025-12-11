const QUICK_LINKS = [
  {
    name: 'Claude',
    url: 'https://claude.ai',
    icon: '🤖',
    color: 'from-[#D97757] to-[#B85C3C]',
  },
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    icon: '💬',
    color: 'from-[#10A37F] to-[#0D8B6B]',
  },
  {
    name: 'Perplexity',
    url: 'https://www.perplexity.ai',
    icon: '🔮',
    color: 'from-[#20808D] to-[#196770]',
  },
];

export function QuickLinksWidget() {
  return (
    <div className="glass p-6">
      <h3 className="text-lg font-semibold mb-4 gradient-text">Быстрые ссылки</h3>

      <div className="grid grid-cols-1 gap-3">
        {QUICK_LINKS.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`bg-gradient-to-r ${link.color} p-4 rounded-glass-sm hover:scale-105 transition-transform duration-200 flex items-center gap-3 group`}
          >
            <span className="text-3xl">{link.icon}</span>
            <span className="text-lg font-semibold text-white group-hover:text-white/90">
              {link.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
