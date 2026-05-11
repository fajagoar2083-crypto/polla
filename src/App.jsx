import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

function Icon({ name, size = 24, className = "" }) {
  const icons = {
    Trophy: "🏆",
    Users: "👥",
    Medal: "🥇",
    CalendarDays: "📅",
    Crown: "👑",
    ShieldCheck: "🛡️",
    Lock: "🔒",
    Unlock: "🔓",
    Sparkles: "✨",
    UserPlus: "➕",
    Goal: "⚽",
    Coins: "💰",
    Warning: "⚠️",
  };
  return (
    <span className={className} style={{ fontSize: size, lineHeight: 1 }}>
      {icons[name] || "⭐"}
    </span>
  );
}

const firstPhaseMatches = [
  { id: 1, phase: "fase1", round: "Fase de grupos", date: "2026-06-11", time: "2:00 p.m.", home: "México", away: "Sudáfrica", result: null },
  { id: 2, phase: "fase1", round: "Fase de grupos", date: "2026-06-12", time: "5:00 p.m.", home: "Colombia", away: "Japón", result: null },
  { id: 3, phase: "fase1", round: "Fase de grupos", date: "2026-06-13", time: "11:00 a.m.", home: "Brasil", away: "España", result: null },
  { id: 4, phase: "fase1", round: "Fase de grupos", date: "2026-06-14", time: "8:00 p.m.", home: "Argentina", away: "Francia", result: null },
  { id: 5, phase: "fase1", round: "Fase de grupos", date: "2026-06-15", time: "2:00 p.m.", home: "Alemania", away: "Portugal", result: null },
  { id: 6, phase: "fase1", round: "Fase de grupos", date: "2026-06-16", time: "5:00 p.m.", home: "Uruguay", away: "Inglaterra", result: null },
];

const secondPhaseMatches = [
  { id: 101, phase: "fase2", round: "Octavos de final", date: "2026-06-28", time: "11:00 a.m.", home: "Clasificado 1", away: "Clasificado 2", result: null },
  { id: 102, phase: "fase2", round: "Octavos de final", date: "2026-06-28", time: "3:00 p.m.", home: "Clasificado 3", away: "Clasificado 4", result: null },
  { id: 103, phase: "fase2", round: "Cuartos de final", date: "2026-07-04", time: "2:00 p.m.", home: "Ganador octavos", away: "Ganador octavos", result: null },
  { id: 104, phase: "fase2", round: "Semifinal", date: "2026-07-08", time: "2:00 p.m.", home: "Ganador cuartos", away: "Ganador cuartos", result: null },
  { id: 105, phase: "fase2", round: "Final", date: "2026-07-19", time: "2:00 p.m.", home: "Finalista 1", away: "Finalista 2", result: null },
];

const sampleUsers = [
  { id: 1, firstName: "Carlos", lastName: "Pérez", paid: true },
  { id: 2, firstName: "Andrea", lastName: "Gómez", paid: true },
  { id: 3, firstName: "Fabio", lastName: "Aristizabal", paid: true },
];

const initialPredictions = {
  1: { 1: "home", 2: "draw", 3: "home", 4: "away" },
  2: { 1: "home", 2: "home", 3: "away", 4: "draw" },
  3: { 1: "draw", 2: "home", 3: "home", 4: "away" },
};

const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function optionLabel(match, option) {
  if (option === "home") return `Gana ${match.home}`;
  if (option === "away") return `Gana ${match.away}`;
  if (option === "draw") return "Empate";
  return "Sin pronóstico";
}

function phaseName(phase) {
  if (phase === "fase1") return "Primera fase";
  if (phase === "fase2") return "Segunda fase";
  return "Fase";
}

export default function App() {
  const [activeTab, setActiveTab] = useState("inicio");
  const [users, setUsers] = useState(sampleUsers);
  const [matches, setMatches] = useState([...firstPhaseMatches, ...secondPhaseMatches]);
  const [predictions, setPredictions] = useState(initialPredictions);
  const [currentUserId, setCurrentUserId] = useState(3);
  const [form, setForm] = useState({ firstName: "", lastName: "" });
  const [adminMatchId, setAdminMatchId] = useState(1);
  const [selectedPhase, setSelectedPhase] = useState("fase1");

  const [phaseConfig, setPhaseConfig] = useState({
    fase1Locked: false,
    fase2Enabled: false,
    fase2Locked: false,
  });

  const inscriptionValue = 100000;
  const paidUsers = users.filter((u) => u.paid);
  const totalPot = paidUsers.length * inscriptionValue;

  const prizes = [
    { place: "Primer lugar", percent: 60, value: totalPot * 0.6, icon: "Crown" },
    { place: "Segundo lugar", percent: 25, value: totalPot * 0.25, icon: "Medal" },
    { place: "Tercer lugar", percent: 15, value: totalPot * 0.15, icon: "Trophy" },
  ];

  const visibleMatches = matches.filter((m) => m.phase === "fase1" || phaseConfig.fase2Enabled);
  const filteredMatches = visibleMatches.filter((m) => m.phase === selectedPhase);

  const ranking = useMemo(() => {
    return users
      .map((user) => {
        const userPredictions = predictions[user.id] || {};
        let points = 0;
        let hits = 0;

        matches.forEach((match) => {
          if (!match.result) return;
          if (userPredictions[match.id] === match.result) {
            points += 3;
            hits += 1;
          }
        });

        return { ...user, points, hits };
      })
      .sort((a, b) => b.points - a.points || b.hits - a.hits || a.firstName.localeCompare(b.firstName));
  }, [users, predictions, matches]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  function isPhaseLocked(phase) {
    if (phase === "fase1") return phaseConfig.fase1Locked;
    if (phase === "fase2") return !phaseConfig.fase2Enabled || phaseConfig.fase2Locked;
    return true;
  }

  function registerUser(e) {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) return;

    const newUser = {
      id: Date.now(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      paid: false,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    setForm({ firstName: "", lastName: "" });
    setActiveTab("pronosticos");
  }

  function savePrediction(matchId, option) {
    const match = matches.find((m) => m.id === matchId);
    if (!match || isPhaseLocked(match.phase)) return;

    setPredictions((prev) => ({
      ...prev,
      [currentUserId]: {
        ...(prev[currentUserId] || {}),
        [matchId]: option,
      },
    }));
  }

  function updateMatchResult(matchId, result) {
    setMatches((prev) => prev.map((m) => (m.id === matchId ? { ...m, result } : m)));
  }

  function updateMatchTeam(matchId, field, value) {
    setMatches((prev) => prev.map((m) => (m.id === matchId ? { ...m, [field]: value } : m)));
  }

  function togglePaid(userId) {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, paid: !u.paid } : u)));
  }

  const tabs = [
    { id: "inicio", label: "Inicio", icon: "Trophy" },
    { id: "registro", label: "Registro", icon: "UserPlus" },
    { id: "pronosticos", label: "Pronósticos", icon: "Goal" },
    { id: "ranking", label: "Ranking", icon: "Medal" },
    { id: "premios", label: "Premios", icon: "Coins" },
    { id: "admin", label: "Admin", icon: "ShieldCheck" },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,#facc15_0%,transparent_24%),radial-gradient(circle_at_bottom_left,#16a34a_0%,transparent_25%),radial-gradient(circle_at_bottom_right,#2563eb_0%,transparent_25%)] opacity-30" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 md:px-8">
        <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-yellow-300">Polla Mundialista</p>
            <h1 className="text-3xl font-black md:text-5xl">Camino a la Copa</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold transition ${
                  activeTab === tab.id
                    ? "bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-500/30"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <Icon name={tab.icon} size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {activeTab === "inicio" && (
          <section className="grid flex-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative flex min-h-[520px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-yellow-300/30 bg-gradient-to-br from-emerald-900/80 via-slate-950 to-blue-950/80 p-8 shadow-2xl">
              <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.45),transparent_70%)]" />
              <div className="absolute top-8 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-yellow-200 backdrop-blur">
                Mundial 2026 · Predice, suma y gana
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.94 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="relative mt-8 flex flex-col items-center text-center"
              >
                <div className="absolute h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="relative flex h-64 w-64 items-center justify-center rounded-full border border-yellow-300/40 bg-gradient-to-b from-yellow-300 via-yellow-500 to-amber-700 shadow-[0_0_80px_rgba(250,204,21,0.45)]"
                >
                  <Icon name="Trophy" size={132} className="drop-shadow-2xl" />
                </motion.div>
                <h2 className="mt-8 text-4xl font-black leading-tight md:text-6xl">La Copa está en juego</h2>
                <p className="mt-4 max-w-xl text-lg text-white/80">
                  Primera fase: todos los pronósticos deben quedar listos antes de iniciar el Mundial.
                  Segunda fase: se habilita cuando ya estén los clasificados.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <button onClick={() => setActiveTab("registro")} className="rounded-2xl bg-yellow-400 px-6 py-3 font-black text-slate-950 shadow-xl shadow-yellow-500/30 hover:bg-yellow-300">
                    Registrarme
                  </button>
                  <button onClick={() => setActiveTab("pronosticos")} className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-black hover:bg-white/20">
                    Hacer pronósticos
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="grid gap-4">
              <StatCard icon="Users" label="Participantes pagos" value={paidUsers.length} />
              <StatCard icon="Coins" label="Bolsa acumulada" value={COP.format(totalPot)} />
              <StatCard icon="Sparkles" label="Valor inscripción" value={COP.format(inscriptionValue)} />
              <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                <h3 className="mb-4 text-xl font-black">Reglas de bloqueo</h3>
                <div className="space-y-3 text-white/80">
                  <p>✅ Acertar ganador o empate suma <strong className="text-yellow-300">3 puntos</strong>.</p>
                  <p>🔒 Primera fase: se bloquea completa antes de iniciar el Mundial.</p>
                  <p>🔓 Segunda fase: se habilita cuando estén los clasificados.</p>
                  <p>🔒 Segunda fase: se bloquea antes del primer partido de esa fase.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "registro" && (
          <section className="mx-auto w-full max-w-2xl rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur md:p-8">
            <h2 className="text-3xl font-black">Registro de participante</h2>
            <p className="mt-2 text-white/70">Ingresa nombre y apellido. El administrador podrá marcar el pago de $100.000 COP.</p>
            <form onSubmit={registerUser} className="mt-6 grid gap-4">
              <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Nombre" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 text-white outline-none ring-yellow-300/0 transition focus:ring-4" />
              <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Apellido" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 text-white outline-none ring-yellow-300/0 transition focus:ring-4" />
              <button className="rounded-2xl bg-yellow-400 px-6 py-4 font-black text-slate-950 shadow-xl shadow-yellow-500/30 hover:bg-yellow-300">Crear mi participación</button>
            </form>
          </section>
        )}

        {activeTab === "pronosticos" && (
          <section className="grid gap-5">
            <div className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur md:flex-row md:items-center">
              <div>
                <h2 className="text-3xl font-black">Tus pronósticos</h2>
                <p className="text-white/70">Participante actual: <strong className="text-yellow-300">{currentUser?.firstName} {currentUser?.lastName}</strong></p>
              </div>
              <select value={currentUserId} onChange={(e) => setCurrentUserId(Number(e.target.value))} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 font-bold text-white">
                {users.map((u) => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
              </select>
            </div>

            <div className="rounded-3xl border border-yellow-300/20 bg-yellow-400/10 p-5">
              <div className="flex items-start gap-3">
                <Icon name="Warning" size={24} />
                <div>
                  <h3 className="font-black text-yellow-200">Regla importante</h3>
                  <p className="text-white/80">
                    En la primera fase debes dejar todos tus pronósticos antes de que inicie el Mundial.
                    Durante la fase inicial no se podrá modificar nada. La segunda fase se abrirá después,
                    cuando ya estén definidos los clasificados.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => setSelectedPhase("fase1")} className={`rounded-2xl px-5 py-3 font-black ${selectedPhase === "fase1" ? "bg-yellow-400 text-slate-950" : "bg-white/10"}`}>
                Primera fase {phaseConfig.fase1Locked ? "🔒" : "🔓"}
              </button>
              <button onClick={() => setSelectedPhase("fase2")} disabled={!phaseConfig.fase2Enabled} className={`rounded-2xl px-5 py-3 font-black disabled:cursor-not-allowed disabled:opacity-40 ${selectedPhase === "fase2" ? "bg-yellow-400 text-slate-950" : "bg-white/10"}`}>
                Segunda fase {!phaseConfig.fase2Enabled ? "No habilitada" : phaseConfig.fase2Locked ? "🔒" : "🔓"}
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredMatches.map((match) => {
                const selected = predictions[currentUserId]?.[match.id];
                const locked = isPhaseLocked(match.phase);
                return (
                  <div key={match.id} className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-white/60">
                      <span className="rounded-full bg-white/10 px-3 py-1 font-bold text-white/80">{match.round}</span>
                      <span className="flex items-center gap-2"><Icon name="CalendarDays" size={16} /> {match.date} · {match.time}</span>
                      {locked && <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-3 py-1 text-red-200"><Icon name="Lock" size={14} /> Bloqueado</span>}
                    </div>
                    <h3 className="text-2xl font-black">{match.home} <span className="text-yellow-300">vs</span> {match.away}</h3>
                    <div className="mt-5 grid gap-3">
                      {["home", "draw", "away"].map((option) => (
                        <button key={option} onClick={() => savePrediction(match.id, option)} disabled={locked} className={`rounded-2xl border px-4 py-3 text-left font-black transition ${selected === option ? "border-yellow-300 bg-yellow-400 text-slate-950" : "border-white/10 bg-slate-950/60 text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"}`}>
                          {optionLabel(match, option)}
                        </button>
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-white/60">Tu elección: <strong className="text-white">{optionLabel(match, selected)}</strong></p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {activeTab === "ranking" && (
          <section className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur md:p-8">
            <h2 className="text-3xl font-black">Tabla general</h2>
            <p className="mt-2 text-white/70">Una sola clasificación para todos los participantes.</p>
            <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead className="bg-yellow-400 text-slate-950">
                  <tr><th className="p-4">Puesto</th><th className="p-4">Participante</th><th className="p-4">Pago</th><th className="p-4">Aciertos</th><th className="p-4">Puntos</th></tr>
                </thead>
                <tbody>
                  {ranking.map((user, index) => (
                    <tr key={user.id} className="border-t border-white/10 bg-slate-950/40">
                      <td className="p-4 font-black">#{index + 1}</td>
                      <td className="p-4 font-bold">{user.firstName} {user.lastName}</td>
                      <td className="p-4">{user.paid ? "✅ Pagado" : "⏳ Pendiente"}</td>
                      <td className="p-4">{user.hits}</td>
                      <td className="p-4 text-xl font-black text-yellow-300">{user.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "premios" && (
          <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[2rem] border border-yellow-300/20 bg-gradient-to-br from-yellow-500/20 to-white/10 p-8 shadow-2xl backdrop-blur">
              <h2 className="text-3xl font-black">Bolsa acumulada</h2>
              <p className="mt-4 text-5xl font-black text-yellow-300">{COP.format(totalPot)}</p>
              <p className="mt-3 text-white/70">{paidUsers.length} participantes pagos × {COP.format(inscriptionValue)}</p>
            </div>
            <div className="grid gap-4">
              {prizes.map((prize) => (
                <div key={prize.place} className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400 text-slate-950"><Icon name={prize.icon} size={32} /></div>
                  <div><h3 className="text-xl font-black">{prize.place}</h3><p className="text-white/70">{prize.percent}% de la bolsa</p></div>
                  <div className="ml-auto text-right text-2xl font-black text-yellow-300">{COP.format(prize.value)}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "admin" && (
          <section className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
              <h2 className="text-3xl font-black">Panel admin</h2>
              <p className="mt-2 text-white/70">Controla pagos, fases, clasificados y resultados.</p>

              <div className="mt-6 rounded-3xl border border-yellow-300/20 bg-slate-950/50 p-5">
                <h3 className="text-xl font-black">Control de fases</h3>
                <div className="mt-4 grid gap-3">
                  <button onClick={() => setPhaseConfig((p) => ({ ...p, fase1Locked: true }))} className="rounded-2xl bg-red-500 px-4 py-3 font-black text-white">
                    Bloquear primera fase antes del Mundial
                  </button>
                  <button onClick={() => setPhaseConfig((p) => ({ ...p, fase2Enabled: true }))} className="rounded-2xl bg-emerald-400 px-4 py-3 font-black text-slate-950">
                    Habilitar segunda fase cuando estén los clasificados
                  </button>
                  <button onClick={() => setPhaseConfig((p) => ({ ...p, fase2Locked: true }))} className="rounded-2xl bg-red-500 px-4 py-3 font-black text-white">
                    Bloquear segunda fase antes del primer partido
                  </button>
                  <button onClick={() => setPhaseConfig({ fase1Locked: false, fase2Enabled: false, fase2Locked: false })} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-black">
                    Reiniciar bloqueos de prueba
                  </button>
                </div>
              </div>

              <h3 className="mt-6 text-xl font-black">Participantes</h3>
              <div className="mt-4 grid gap-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between rounded-2xl bg-slate-950/50 p-4">
                    <span className="font-bold">{user.firstName} {user.lastName}</span>
                    <button onClick={() => togglePaid(user.id)} className={`rounded-xl px-4 py-2 text-sm font-black ${user.paid ? "bg-emerald-400 text-slate-950" : "bg-white/10 text-white"}`}>
                      {user.paid ? "Pagado" : "Pendiente"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
              <h3 className="text-2xl font-black">Resultados y clasificados</h3>
              <select value={adminMatchId} onChange={(e) => setAdminMatchId(Number(e.target.value))} className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 font-bold text-white">
                {visibleMatches.map((m) => <option key={m.id} value={m.id}>{phaseName(m.phase)} · {m.round} · {m.home} vs {m.away}</option>)}
              </select>

              {matches.filter((m) => m.id === adminMatchId).map((match) => (
                <div key={match.id} className="mt-5 rounded-3xl bg-slate-950/50 p-5">
                  <h4 className="text-xl font-black">{match.home} vs {match.away}</h4>
                  <p className="text-white/60">{phaseName(match.phase)} · {match.round}</p>
                  <p className="text-white/60">Resultado actual: {optionLabel(match, match.result)}</p>

                  {match.phase === "fase2" && (
                    <div className="mt-4 grid gap-3">
                      <input value={match.home} onChange={(e) => updateMatchTeam(match.id, "home", e.target.value)} placeholder="Equipo local / clasificado" className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
                      <input value={match.away} onChange={(e) => updateMatchTeam(match.id, "away", e.target.value)} placeholder="Equipo visitante / clasificado" className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white" />
                    </div>
                  )}

                  <div className="mt-4 grid gap-3">
                    {["home", "draw", "away"].map((option) => (
                      <button key={option} onClick={() => updateMatchResult(match.id, option)} className="rounded-2xl bg-yellow-400 px-4 py-3 text-left font-black text-slate-950 hover:bg-yellow-300">
                        Cargar: {optionLabel(match, option)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-slate-950">
          <Icon name={icon} size={28} />
        </div>
        <div>
          <p className="text-sm text-white/60">{label}</p>
          <p className="text-2xl font-black">{value}</p>
        </div>
      </div>
    </div>
  );
}
