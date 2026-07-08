import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Nfc, QrCode, Info } from "lucide-react";
import { Nav } from "@/components/Nav";
import { QRScanner } from "@/components/scan/QRScanner";
import "@/styles/app.css";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Escanear máquina — LavTudo" },
      {
        name: "description",
        content:
          "Escaneie o QR Code ou aproxime o NFC para acompanhar sua lavagem em tempo real.",
      },
      { property: "og:title", content: "Escanear máquina — LavTudo" },
      {
        property: "og:description",
        content: "Aproxime o NFC ou escaneie o QR Code para abrir sua máquina.",
      },
    ],
  }),
  component: ScanPage,
});

const VALID_IDS = new Set(["maq1", "maq2", "sec1", "sec2"]);

function extractMachineId(text: string): string | null {
  const t = text.trim();
  if (VALID_IDS.has(t)) return t;
  try {
    const u = new URL(t);
    const seg = u.pathname.split("/").filter(Boolean).pop() ?? "";
    if (VALID_IDS.has(seg)) return seg;
  } catch {
    // not a URL
  }
  const match = t.match(/(maq[12]|sec[12])/i);
  if (match) return match[1].toLowerCase();
  return null;
}

function ScanPage() {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [nfcState, setNfcState] = useState<
    { kind: "idle" } | { kind: "info"; msg: string } | { kind: "error"; msg: string }
  >({ kind: "idle" });
  const [scanError, setScanError] = useState<string | null>(null);
  const [nfcBusy, setNfcBusy] = useState(false);

  const goToMachine = (id: string) => {
    navigate({ to: "/$machineId", params: { machineId: id } });
  };

  const handleNfc = async () => {
    setScanError(null);
    setNfcState({ kind: "idle" });
    const hasNfc = typeof window !== "undefined" && "NDEFReader" in window;
    if (!hasNfc) {
      setNfcState({
        kind: "info",
        msg: "Seu navegador não suporta Web NFC. Para demonstração, simulando leitura da maq1…",
      });
      setTimeout(() => goToMachine("maq1"), 1200);
      return;
    }
    try {
      setNfcBusy(true);
      // @ts-expect-error - NDEFReader is not in default lib types
      const reader = new window.NDEFReader();
      await reader.scan();
      setNfcState({
        kind: "info",
        msg: "Aproxime o cartão NFC do celular…",
      });
      reader.onreading = (event: { message: { records: Array<{ data?: BufferSource }> } }) => {
        try {
          const record = event.message.records[0];
          const decoder = new TextDecoder();
          const text = record?.data ? decoder.decode(record.data) : "";
          const id = extractMachineId(text);
          if (id) {
            goToMachine(id);
          } else {
            setNfcState({ kind: "error", msg: "Cartão NFC não reconhecido." });
          }
        } catch {
          setNfcState({ kind: "error", msg: "Falha ao ler o cartão NFC." });
        } finally {
          setNfcBusy(false);
        }
      };
    } catch (e) {
      setNfcBusy(false);
      setNfcState({
        kind: "error",
        msg:
          e instanceof Error
            ? `Permissão negada ou NFC indisponível: ${e.message}`
            : "NFC indisponível.",
      });
    }
  };

  return (
    <div className="lav-shell">
      <Nav />
      <div className="container-page">
        <div className="scan-hero">
          <h1>Escaneie sua máquina</h1>
          <p>
            Aproxime seu celular do cartão NFC ou escaneie o QR Code fixado na
            máquina para acompanhar seu ciclo em tempo real.
          </p>
        </div>

        <motion.div
          className="glass scan-card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="scan-icons">
            <div className="scan-icon-tile">
              <Nfc size={44} color="#e6dcff" />
              <span>NFC</span>
            </div>
            <div className="scan-icon-tile">
              <QrCode size={44} color="#e6dcff" />
              <span>QR Code</span>
            </div>
          </div>

          <div className="scan-actions">
            <button
              className="btn-primary"
              onClick={handleNfc}
              disabled={nfcBusy}
            >
              {nfcBusy ? "Aguardando NFC…" : "Escanear NFC"}
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                setScanError(null);
                setShowScanner((v) => !v);
              }}
            >
              {showScanner ? "Fechar câmera" : "Escanear QR Code"}
            </button>
          </div>

          {nfcState.kind !== "idle" && (
            <div
              className={`scan-msg ${nfcState.kind === "error" ? "error" : ""}`}
            >
              {nfcState.msg}
            </div>
          )}

          {showScanner && (
            <>
              <QRScanner
                onResult={(text) => {
                  const id = extractMachineId(text);
                  if (id) {
                    setShowScanner(false);
                    goToMachine(id);
                  } else {
                    setScanError(`QR não reconhecido: ${text.slice(0, 40)}`);
                  }
                }}
                onError={(err) => setScanError(err)}
              />
              {scanError && (
                <div className="scan-msg error">{scanError}</div>
              )}
            </>
          )}

          <div className="scan-msg" style={{ display: "flex", gap: 8 }}>
            <Info size={16} color="#e6dcff" />
            <span>
              Sem cartão físico? Use as opções abaixo para simular a leitura
              (demonstração TCC).
            </span>
          </div>
          <div className="demo-picker">
            {["maq1", "maq2", "sec1", "sec2"].map((id) => (
              <button
                key={id}
                className="demo-pill"
                onClick={() => goToMachine(id)}
              >
                Abrir /{id}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
