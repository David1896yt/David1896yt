import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Gift, Heart, Volume2, VolumeX, Snowflake, ExternalLink, CheckCircle, Shuffle, ChevronDown, PlusCircle, Music } from 'lucide-react';

interface Wish {
  id: string;
  title: string;
  description: string;
  why: string;
  price: string;
  image: string;
  link: string;
  category: "top" | "prakticke" | "zabava" | "zazitek";
}

const categoryLabels = {
  top: "Top přání 🔥",
  prakticke: "Praktické 🛠️",
  zabava: "Zábava 🎮",
  zazitek: "Zážitek ✨",
};

const initialWishes: Wish[] = [
  {
    id: "sluchatka",
    title: "Bezdrátová sluchátka",
    description: "S potlačením hluku, ideální na cesty a soustředění.",
    why: "Abych neslyšel/a, jak strejda u stolu znovu vypráví tu historku z roku 1998.",
    price: "≈ 5 000 Kč",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80",
    link: "https://www.alza.cz",
    category: "top",
  },
  {
    id: "konzole",
    title: "Herní konzole",
    description: "Na zimní večery s přáteli a rodinou.",
    why: "Rodinné hraní je vědecky prokázaně lepší než rodinné hádky o politice.",
    price: "≈ 9 000 Kč",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1000&q=80",
    link: "https://www.alza.cz",
    category: "zabava",
  },
  {
    id: "termohrnek",
    title: "Termohrnek",
    description: "Udrží kávu teplou celé ráno.",
    why: "Moje káva zatím chladne rychleji než moje motivace v pondělí ráno.",
    price: "≈ 600 Kč",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=1000&q=80",
    link: "https://www.alza.cz",
    category: "prakticke",
  },
  {
    id: "knihy",
    title: "Sada knih",
    description: "Něco dobrého ke čtení pod dekou u krbu.",
    why: "Chci vypadat intelektuálně, až se mě někdo zeptá, co dělám o svátcích.",
    price: "≈ 1 200 Kč",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1000&q=80",
    link: "https://www.knihydobrovsky.cz",
    category: "zabava",
  },
  {
    id: "wellness",
    title: "Víkend ve wellness",
    description: "Sauna, masáž a klid. Nejlepší dárek je čas.",
    why: "Po pečení 14 druhů cukroví si to prostě zasloužím.",
    price: "Poukaz",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&q=80",
    link: "https://www.slevomat.cz",
    category: "zazitek",
  },
  {
    id: "batoh",
    title: "Kvalitní batoh",
    description: "Voděodolný, s přihrádkou na notebook.",
    why: "Ten současný drží pohromadě jen díky izolepě a vůli.",
    price: "≈ 2 500 Kč",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000&q=80",
    link: "https://www.alza.cz",
    category: "prakticke",
  },
];

const santaNotes = [
  { to: "Pro tátu", emoji: "👨", text: "Milý tatínku, ponožky letos opravdu nejsou dárek. Věř mi, sledoval jsem to." },
  { to: "Pro mámu", emoji: "👩", text: "Milá maminko, víme, že bys všechno koupila sama. Nech něco i ostatním!" },
  { to: "Pro sourozence", emoji: "🧒", text: "Ano, i letos je sdílení dárků povoleno. Půjčování konzole se ale nepočítá." },
  { to: "Pro babičku a dědu", emoji: "👵", text: "Vaše cukroví je pořád nejlepší dárek. Ale tamto nahoře by taky nevadilo. 😉" },
];

export default function Index() {
  const [allWishes, setAllWishes] = useState<Wish[]>(() => {
    const custom = localStorage.getItem('custom_wishes');
    return custom ? [...initialWishes, ...JSON.parse(custom)] : initialWishes;
  });

  const [giftStatuses, setGiftStatuses] = useState<Record<string, { purchased: boolean; note: string }>>({});
  const [activeTheme, setActiveTheme] = useState<'cozy' | 'gold' | 'neon'>('cozy');
  
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508212.mp3?filename=we-wish-you-a-merry-christmas-126685.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlayingMusic) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log(e));
      }
      setIsPlayingMusic(!isPlayingMusic);
    }
  };

  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newAuthor, setNewAuthor] = useState('');

  const handleAddCustomWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newWish: Wish = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      description: `Návrh dárku od: ${newAuthor || 'Anonym'}`,
      why: 'Tento dárek vymyslel návštěvník webu jako překvapení!',
      price: newPrice || 'Překvapení',
      image: 'https://images.unsplash.com/photo-151388504200d-88e78162665b?w=1000&q=80',
      link: '#',
      category: 'zabava',
    };

    const updated = [...allWishes, newWish];
    setAllWishes(updated);
    const customOnly = updated.filter(w => w.id.startsWith('custom-'));
    localStorage.setItem('custom_wishes', JSON.stringify(customOnly));

    setNewTitle('');
    setNewPrice('');
    setNewAuthor('');
    alert('Dárek byl úspěšně přidán do seznamu! 🎄');
  };

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [randomizedWish, setRandomizedWish] = useState<Wish | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      let christmas = new Date(currentYear, 11, 24, 0, 0, 0);
      if (now.getTime() > christmas.getTime()) {
        christmas = new Date(currentYear + 1, 11, 24, 0, 0, 0);
      }
      const diff = christmas.getTime() - now.getTime();
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('wishlist_statuses');
    if (saved) {
      try { setGiftStatuses(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const handlePurchaseToggle = (id: string, note: string = '') => {
    const current = giftStatuses[id] || { purchased: false, note: '' };
    const updated = {
      ...giftStatuses,
      [id]: { purchased: !current.purchased, note: note || current.note }
    };
    setGiftStatuses(updated);
    localStorage.setItem('wishlist_statuses', JSON.stringify(updated));
  };

  const handleNoteChange = (id: string, note: string) => {
    const current = giftStatuses[id] || { purchased: false, note: '' };
    setGiftStatuses({
      ...giftStatuses,
      [id]: { ...current, note }
    });
  };

  const pickRandomWish = () => {
    setIsSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * allWishes.length);
      setRandomizedWish(allWishes[randomIndex]);
      count++;
      if (count > 10) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  const filteredWishes = selectedCategory === 'all' 
    ? allWishes 
    : allWishes.filter(w => w.category === selectedCategory);

  const purchasedCount = Object.values(giftStatuses).filter(s => s.purchased).length;

  return (
    <div className={`min-h-screen relative text-white overflow-x-hidden ${activeTheme === 'gold' ? 'bg-amber-950' : activeTheme === 'neon' ? 'bg-purple-950' : 'bg-slate-950'}`}>
      
      <header className="relative z-10 flex justify-between items-center p-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Snowflake className="w-6 h-6 animate-spin text-cyan-300" />
          <span className="font-bold tracking-wider">Můj Vánoční Web</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleMusic} 
            className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-2 transition ${isPlayingMusic ? 'bg-green-600 border-green-400 text-white animate-pulse' : 'bg-black/40 border-white/20 text-white/70 hover:bg-white/10'}`}
          >
            <Music className="w-3.5 h-3.5" />
            {isPlayingMusic ? 'Hraje koleda 🎶' : 'Spustit hudbu 🎵'}
          </button>

          <div className="hidden sm:flex bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/10 text-xs">
            <button onClick={() => setActiveTheme('cozy')} className={`px-3 py-1 rounded-full transition ${activeTheme === 'cozy' ? 'bg-amber-500 text-black font-bold' : 'text-white/70'}`}>Polární noc</button>
            <button onClick={() => setActiveTheme('gold')} className={`px-3 py-1 rounded-full transition ${activeTheme === 'gold' ? 'bg-amber-400 text-black font-bold' : 'text-white/70'}`}>Zlaté Vánoce</button>
            <button onClick={() => setActiveTheme('neon')} className={`px-3 py-1 rounded-full transition ${activeTheme === 'neon' ? 'bg-fuchsia-500 text-white font-bold' : 'text-white/70'}`}>Neon Vibes</button>
          </div>
        </div>
      </header>

      <section className="relative z-10 text-center py-16 px-4 max-w-4xl mx-auto">
        <div className="inline-block mb-4 p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
          <Gift className="w-8 h-8 text-amber-400 animate-bounce" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-md">
          Můj vánoční seznam přání
        </h1>
        <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
          Pár drobností, které by mi letos udělaly radost. Zamluvte dárek, ať se nesejdou dva stejné. ❤️
        </p>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-xl mx-auto shadow-2xl mb-8">
          <p className="text-xs tracking-widest text-amber-300 uppercase font-semibold mb-3">Do Štědrého dne zbývá</p>
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-2xl md:text-4xl font-black">{timeLeft.days}</span>
              <p className="text-[10px] text-white/60 uppercase">dní</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-2xl md:text-4xl font-black">{timeLeft.hours}</span>
              <p className="text-[10px] text-white/60 uppercase">hodin</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-2xl md:text-4xl font-black">{timeLeft.minutes}</span>
              <p className="text-[10px] text-white/60 uppercase">minut</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <span className="text-2xl md:text-4xl font-black">{timeLeft.seconds}</span>
              <p className="text-[10px] text-white/60 uppercase">sekund</p>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          Zamluveno {purchasedCount} / {allWishes.length} dárků
        </div>
      </section>

      <main className="relative z-10 max-w-6xl mx-auto px-4 pb-24">
        
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition ${selectedCategory === 'all' ? 'bg-amber-500 text-black font-bold shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white'}`}
          >
            Všechna přání ✨
          </button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition ${selectedCategory === key ? 'bg-amber-500 text-black font-bold shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredWishes.map((wish) => {
            const status = giftStatuses[wish.id] || { purchased: false, note: '' };
            return (
              <div 
                key={wish.id}
                className={`bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden border transition-all duration-300 hover:scale-[1.02] shadow-xl flex flex-col justify-between ${status.purchased ? 'border-green-500/50 opacity-80' : 'border-white/10 hover:border-amber-500/50'}`}
              >
                <div>
                  <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => setSelectedWish(wish)}>
                    <img src={wish.image} alt={wish.title} className="w-full h-full object-cover transition duration-500 hover:scale-110" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-black/60 backdrop-blur-md border border-white/20 text-amber-300">
                      {categoryLabels[wish.category as keyof typeof categoryLabels] || 'Návrh 💡'}
                    </span>
                    {status.purchased && (
                      <div className="absolute inset-0 bg-green-950/60 backdrop-blur-xs flex items-center justify-center">
                        <span className="px-4 py-2 bg-green-500 text-black font-extrabold rounded-xl shadow-lg transform -rotate-6">
                          ZAMLUVENO 🎁 {status.note ? `(${status.note})` : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{wish.title}</h3>
                      <span className="text-amber-400 font-semibold text-sm">{wish.price}</span>
                    </div>
                    <p className="text-white/70 text-sm mb-4">{wish.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex flex-col gap-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Vaše jméno / vzkaz"
                      value={status.note}
                      onChange={(e) => handleNoteChange(wish.id, e.target.value)}
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 transition"
                    />
                    <button
                      onClick={() => handlePurchaseToggle(wish.id, status.note)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${status.purchased ? 'bg-green-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      {status.purchased ? 'Koupeno' : 'Koupit'}
                    </button>
                  </div>

                  {wish.link !== '#' && (
                    <a 
                      href={wish.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
                    >
                      Koupit / Zobrazit odkaz <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto shadow-2xl mb-16">
          <div className="flex items-center gap-3 mb-4">
            <PlusCircle className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold">Chcete mi navrhnout jiný dárek?</h3>
          </div>
          <p className="text-xs text-white/70 mb-6">Máte skvělý nápad, který na seznamu chybí? Přidejte ho sem a objeví se mezi přáními!</p>
          
          <form onSubmit={handleAddCustomWish} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Název dárku*"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
              />
              <input
                type="text"
                placeholder="Odhadovaná cena"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
            <input
              type="text"
              placeholder="Vaše jméno (např. Teta)"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm rounded-xl transition shadow-lg flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Přidat dárek do seznamu
            </button>
          </form>
        </div>

        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-500/30 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-2xl mb-16">
          <div className="inline-block p-3 bg-amber-500/20 rounded-full mb-3">
            <Gift className={`w-8 h-8 text-amber-400 ${isSpinning ? 'animate-spin' : ''}`} />
          </div>
          <h3 className="text-2xl font-bold mb-2">Tajný Ježíšek 🎅</h3>
          <p className="text-white/70 text-sm mb-6">Nevíte, co vybrat? Nechte rozhodnout osud.</p>
          <button
            onClick={pickRandomWish}
            disabled={isSpinning}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition shadow-lg inline-flex items-center gap-2"
          >
            <Shuffle className="w-4 h-4" /> Losovat dárek
          </button>
          {randomizedWish && (
            <div className="mt-6 p-4 bg-black/40 rounded-xl border border-white/10 animate-fade-in">
              <p className="text-xs text-amber-300 font-bold uppercase mb-1">Los padl na:</p>
              <h4 className="text-lg font-extrabold">{randomizedWish.title}</h4>
              <p className="text-xs text-white/70 mt-1">{randomizedKeyword(randomizedWish.price)}</p>
            </div>
          )}
        </div>

        <div className="max-w-3xl mx-auto bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
          <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">📜 Oficiální dopis od Ježíška</h3>
          <p className="text-white/60 text-sm mb-6">Přísně tajné. Čtěte jen svůj vzkaz.</p>
          <div className="space-y-4">
            {santaNotes.map((note, index) => (
              <details key={index} className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden transition">
                <summary className="p-4 font-bold cursor-pointer flex justify-between items-center hover:bg-white/5 transition">
                  <span className="flex items-center gap-3"><span className="text-xl">{note.emoji}</span> {note.to}</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                </summary>
                <div className="p-4 pt-0 text-sm text-white/80 border-t border-white/10 mt-2">{note.text}</div>
              </details>
            ))}
          </div>
        </div>

      </main>

      <footer className="relative z-10 text-center py-8 text-xs text-white/50 border-t border-white/10">
        Veselé Vánoce a šťastný nový rok! 🎁✨
      </footer>
    </div>
  );
}
