export type MachineType = "washer" | "dryer";

export type MachineStatus =
  | "available"
  | "waiting"
  | "filling"
  | "washing"
  | "rinsing"
  | "spinning"
  | "drying"
  | "cooling"
  | "finished"
  | "paused";

export type Machine = {
  id: string;
  name: string;
  type: MachineType;
  status: MachineStatus;
  process: string;
  totalSeconds: number;
  remainingSeconds: number;
  cycleNumber: number;
  waterTempC: number;
  spinRpm: number;
  waterLiters: number;
  energyKwh: number;
  startedAt: number | null; // epoch ms
  available: boolean;
};

export const DEFAULT_MACHINES: Machine[] = [
  {
    id: "maq1",
    name: "Lavadora 01",
    type: "washer",
    status: "washing",
    process: "Lavagem principal",
    totalSeconds: 45 * 60,
    remainingSeconds: 27 * 60,
    cycleNumber: 128,
    waterTempC: 40,
    spinRpm: 800,
    waterLiters: 48,
    energyKwh: 0.9,
    startedAt: Date.now() - 18 * 60 * 1000,
    available: false,
  },
  {
    id: "maq2",
    name: "Lavadora 02",
    type: "washer",
    status: "available",
    process: "Aguardando",
    totalSeconds: 45 * 60,
    remainingSeconds: 45 * 60,
    cycleNumber: 87,
    waterTempC: 30,
    spinRpm: 1000,
    waterLiters: 52,
    energyKwh: 1.1,
    startedAt: null,
    available: true,
  },
  {
    id: "sec1",
    name: "Secadora 01",
    type: "dryer",
    status: "drying",
    process: "Secagem intensa",
    totalSeconds: 30 * 60,
    remainingSeconds: 12 * 60,
    cycleNumber: 54,
    waterTempC: 60,
    spinRpm: 0,
    waterLiters: 0,
    energyKwh: 1.6,
    startedAt: Date.now() - 18 * 60 * 1000,
    available: false,
  },
  {
    id: "sec2",
    name: "Secadora 02",
    type: "dryer",
    status: "available",
    process: "Aguardando",
    totalSeconds: 30 * 60,
    remainingSeconds: 30 * 60,
    cycleNumber: 31,
    waterTempC: 55,
    spinRpm: 0,
    waterLiters: 0,
    energyKwh: 1.4,
    startedAt: null,
    available: true,
  },
];

export const STORAGE_KEY = "lavtudo.machines.v1";
export const CHANNEL_NAME = "lavtudo-sync";

export const STATUS_LABEL: Record<MachineStatus, string> = {
  available: "Disponível",
  waiting: "Aguardando",
  filling: "Enchendo",
  washing: "Lavando",
  rinsing: "Enxaguando",
  spinning: "Centrifugando",
  drying: "Secando",
  cooling: "Resfriando",
  finished: "Finalizado",
  paused: "Pausado",
};

export const WASHER_STAGES: MachineStatus[] = [
  "waiting",
  "filling",
  "washing",
  "rinsing",
  "spinning",
  "finished",
];

export const DRYER_STAGES: MachineStatus[] = [
  "waiting",
  "drying",
  "cooling",
  "finished",
];

export function stagesFor(type: MachineType): MachineStatus[] {
  return type === "washer" ? WASHER_STAGES : DRYER_STAGES;
}

/** Pick the current stage from progress %, excluding "waiting" and "finished". */
export function stageFromProgress(m: Machine): MachineStatus {
  const stages = stagesFor(m.type).filter(
    (s) => s !== "waiting" && s !== "finished",
  );
  const p = progressPercent(m);
  const idx = Math.min(
    stages.length - 1,
    Math.floor((p / 100) * stages.length),
  );
  return stages[idx];
}

export function progressPercent(m: Machine): number {
  if (m.totalSeconds <= 0) return 0;
  const p = 100 - (m.remainingSeconds / m.totalSeconds) * 100;
  return Math.max(0, Math.min(100, p));
}

export function formatDuration(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function formatClock(ts: number | null): string {
  if (!ts) return "--:--";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
