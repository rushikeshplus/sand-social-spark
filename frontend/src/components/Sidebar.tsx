import { Facebook, Instagram, Linkedin } from "lucide-react";

const platforms = [
  { id: "facebook", label: "Facebook", icon: Facebook },
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
];

export default function Sidebar({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="sidebar">
      <div className="logo">SAND</div>
      <nav>
        {platforms.map((plat) => (
          <button
            key={plat.id}
            className={`sidebar-btn ${selected === plat.id ? 'active' : ''}`}


            onClick={() => onSelect(plat.id)}
          >
            <plat.icon size={18} />
            <span className="label">{plat.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
