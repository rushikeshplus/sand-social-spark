import { Button } from "../components/ui/button";
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
    <aside className="h-screen w-24 md:w-64 bg-gradient-to-b from-blue-900 to-slate-900 rounded-2xl m-2 flex flex-col py-8 px-3 shadow-2xl glass-card">
      <div className="mb-10">
        <div className="text-blue-300 text-3xl font-extrabold tracking-widest ml-2">SAND</div>
      </div>
      <nav className="flex flex-col gap-4 w-full">
        {platforms.map((plat) => (
          <Button
            key={plat.id}
            variant={selected === plat.id ? "default" : "ghost"}
            size="lg"
            className={`flex items-center gap-4 px-2 ${selected === plat.id ? "bg-blue-800/80 text-white shadow-lg" : "text-blue-200 hover:bg-blue-800/60"}`}
            onClick={() => onSelect(plat.id)}
          >
            <plat.icon className="w-6 h-6" />
            <span className="hidden md:inline font-semibold">{plat.label}</span>
          </Button>
        ))}
      </nav>
    </aside>
  );
}
