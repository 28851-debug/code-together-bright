import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogOut, RefreshCw } from "lucide-react";
import { Nav } from "@/components/Nav";
import { useMachines } from "@/context/MachineContext";
import { STATUS_LABEL, type MachineStatus } from "@/lib/machines";
import "@/styles/app.css";

const AUTH_KEY = "lavtudo.admin.session";
const ADMIN_USER = "admin";
const ADMIN_PASS = "123456";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel admin — LavTudo" },
      { name: "description", content: "Painel administrativo do LavTudo." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAuthed(sessionStorage.getItem(AUTH_KEY) === "1");
    setChecked(true);
  }, []);

  return (
    <div className="lav-shell">
      <Nav />
      {!checked ? null : authed ? (
        <AdminDashboard
          onLogout={() => {
            sessionStorage.removeItem(AUTH_KEY);
            setAuthed(false);
          }}
        />
      ) : (
        <LoginForm
          onOk={() => {
            sessionStorage.setItem(AUTH_KEY, "1");
            setAuthed(true);
          }}
        />
      )}
    </div>
  );
}

function LoginForm({ onOk }: { onOk: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      setErr("");
      onOk();
    } else {
      setErr("Usuário ou senha incorretos.");
    }
  };

  return (
    <div className="login-wrap">
      <motion.form
        onSubmit={submit}
        className="glass login-card"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Entrar no admin</h1>
        <p>Acesse o painel de gerenciamento das máquinas.</p>
        <div className="admin-fields" style={{ marginTop: 6 }}>
          <div className="field">
            <label>Usuário</label>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </div>
          <div className="field">
            <label>Senha</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
            />
          </div>
        </div>
        {err && (
          <div className="scan-msg error" style={{ marginTop: 10 }}>
            {err}
          </div>
        )}
        <div style={{ marginTop: 14 }}>
          <button className="btn-primary" type="submit">
            Entrar
          </button>
        </div>
        <div className="login-hint">
          Dica TCC: <b>admin</b> / <b>123456</b>
        </div>
      </motion.form>
    </div>
  );
}

const ALL_STATUSES: MachineStatus[] = [
  "available",
  "waiting",
  "filling",
  "washing",
  "rinsing",
  "spinning",
  "drying",
  "cooling",
  "finished",
  "paused",
];

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { machines, updateMachine, action, resetAll } = useMachines();

  return (
    <div className="container-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.6rem", textShadow: "1px 1px 3px #000" }}>
            Painel Administrativo
          </h1>
          <p style={{ color: "#d5ccff", fontSize: "0.9rem" }}>
            Alterações refletem em tempo real nas páginas públicas das máquinas.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="chip-btn" onClick={resetAll} title="Restaurar padrões">
            <RefreshCw size={14} style={{ marginRight: 6 }} />
            Restaurar
          </button>
          <button className="chip-btn danger" onClick={onLogout}>
            <LogOut size={14} style={{ marginRight: 6 }} />
            Sair
          </button>
        </div>
      </div>

      <div className="admin-list">
        {machines.map((m) => (
          <motion.div
            key={m.id}
            className="glass admin-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="admin-card-head">
              <div>
                <div className="admin-card-title">{m.name}</div>
                <div style={{ color: "#d5ccff", fontSize: "0.8rem" }}>
                  /{m.id} • {m.type === "washer" ? "Lavadora" : "Secadora"}
                </div>
              </div>
              <div className="admin-actions">
                <button className="chip-btn primary" onClick={() => action(m.id, "start")}>
                  Iniciar
                </button>
                <button className="chip-btn warn" onClick={() => action(m.id, "pause")}>
                  Pausar
                </button>
                <button className="chip-btn" onClick={() => action(m.id, "resume")}>
                  Retomar
                </button>
                <button className="chip-btn" onClick={() => action(m.id, "finish")}>
                  Finalizar
                </button>
                <button className="chip-btn danger" onClick={() => action(m.id, "reset")}>
                  Reset
                </button>
              </div>
            </div>

            <div className="admin-fields">
              <div className="field">
                <label>Nome</label>
                <input
                  value={m.name}
                  onChange={(e) => updateMachine(m.id, { name: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Processo atual</label>
                <input
                  value={m.process}
                  onChange={(e) =>
                    updateMachine(m.id, { process: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label>Status</label>
                <select
                  value={m.status}
                  onChange={(e) =>
                    updateMachine(m.id, {
                      status: e.target.value as MachineStatus,
                    })
                  }
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </div>
              <NumField
                label="Restante (s)"
                value={m.remainingSeconds}
                onChange={(v) =>
                  updateMachine(m.id, { remainingSeconds: Math.max(0, v) })
                }
              />
              <NumField
                label="Total (s)"
                value={m.totalSeconds}
                onChange={(v) =>
                  updateMachine(m.id, { totalSeconds: Math.max(1, v) })
                }
              />
              <NumField
                label="Ciclo #"
                value={m.cycleNumber}
                onChange={(v) => updateMachine(m.id, { cycleNumber: v })}
              />
              <NumField
                label="Temperatura °C"
                value={m.waterTempC}
                onChange={(v) => updateMachine(m.id, { waterTempC: v })}
              />
              <NumField
                label="Rotação (rpm)"
                value={m.spinRpm}
                onChange={(v) => updateMachine(m.id, { spinRpm: v })}
              />
              <NumField
                label="Água (L)"
                value={m.waterLiters}
                onChange={(v) => updateMachine(m.id, { waterLiters: v })}
              />
              <NumField
                label="Energia (kWh)"
                value={m.energyKwh}
                step={0.1}
                onChange={(v) => updateMachine(m.id, { energyKwh: v })}
              />
              <div className="field">
                <label>Disponível</label>
                <select
                  value={m.available ? "1" : "0"}
                  onChange={(e) =>
                    updateMachine(m.id, { available: e.target.value === "1" })
                  }
                >
                  <option value="1">Sim</option>
                  <option value="0">Não</option>
                </select>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          onChange(Number.isFinite(n) ? n : 0);
        }}
      />
    </div>
  );
}
