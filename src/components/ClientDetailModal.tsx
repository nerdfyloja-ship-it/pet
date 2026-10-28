import React, { useState } from 'react';
import { ClienteRecord } from '../types/dashboard';
import { X, Building2, MapPin, User, CheckCircle2, XCircle, Weight, Copy, Check, Briefcase } from 'lucide-react';

interface ClientDetailModalProps {
  client: ClienteRecord | null;
  onClose: () => void;
  onFilterRCA?: (rca: string) => void;
  onFilterCidade?: (cidade: string) => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  client,
  onClose,
  onFilterRCA,
  onFilterCidade,
}) => {
  const [copied, setCopied] = useState(false);

  if (!client) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#0f2744] text-white p-5 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-600/60 text-blue-100 font-mono">
                  Cód: {client.codCliPrinc}
                </span>
                <span className="text-xs text-blue-300">{client.cidade}</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1 leading-snug">
                {client.cliente}
              </h3>
              <p className="text-xs text-blue-200/90 font-medium">
                Fantasia: {client.fantasia || 'Não informado'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* General Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 text-[11px] block font-medium">CNPJ</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {!client.cnpj || client.cnpj.includes('#') ? 'Não informado' : client.cnpj}
                </span>
                {client.cnpj && !client.cnpj.includes('#') && (
                  <button
                    onClick={() => copyToClipboard(client.cnpj)}
                    className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors cursor-pointer"
                    title="Copiar CNPJ"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>

            <div>
              <span className="text-slate-500 text-[11px] block font-medium">RAMO DE ATIVIDADE</span>
              <span className="font-semibold text-slate-800 block mt-0.5">
                {!client.ramo || client.ramo.includes('#') ? 'Geral' : client.ramo}
              </span>
            </div>

            <div>
              <span className="text-slate-500 text-[11px] block font-medium">SUPERVISOR</span>
              <span className="font-semibold text-slate-800 block mt-0.5">
                {!client.supervisor || client.supervisor.includes('#') ? 'Outros' : client.supervisor}
              </span>
            </div>

            <div>
              <span className="text-slate-500 text-[11px] block font-medium">REPRESENTANTE (RCA)</span>
              <span className="font-semibold text-slate-800 block mt-0.5">
                {!client.rca || client.rca.includes('#') ? 'Geral' : client.rca}
              </span>
            </div>
          </div>

          {/* Positivação Section */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Positivação por Categoria</span>
              </h4>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  client.positivacao.isPositivado
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {client.positivacao.isPositivado ? 'Cliente Positivado' : 'Sem Positivação'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { label: 'TOTAL SACHÊ', value: client.positivacao.totalSache },
                { label: 'OPTIMUM SACHÊ', value: client.positivacao.optimumSache },
                { label: 'SMALL BAG', value: client.positivacao.smallBag },
                { label: 'KITKAT / CHAMP', value: client.positivacao.kitkatChamp },
                { label: 'C&T', value: client.positivacao.ct },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    item.value > 0
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 block">{item.label}</span>
                    <span className="font-extrabold text-sm">{item.value.toFixed(0)}</span>
                  </div>
                  {item.value > 0 ? (
                    <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                  ) : (
                    <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-200" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tonelagem Section */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <Weight className="w-4 h-4 text-amber-600" />
              <span>Tonelagem Detalhada (em toneladas)</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { label: 'TOTAL PET', value: client.tonelada.totalPet, highlight: true },
                { label: 'TOTAL SACHÊ', value: client.tonelada.totalSache },
                { label: 'TOTAL PETISCOS', value: client.tonelada.totalPetiscos },
                { label: 'PETISCO RESET', value: client.tonelada.petiscoReset },
                { label: 'SMALLBAG', value: client.tonelada.smallbag },
                { label: 'C&T', value: client.tonelada.ct },
                { label: 'DRY', value: client.tonelada.dry },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`p-2.5 rounded-lg border ${
                    item.highlight
                      ? 'bg-amber-50/70 border-amber-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-bold text-slate-500 block">{item.label}</span>
                  <span
                    className={`font-mono text-sm block mt-0.5 ${
                      item.value > 0 ? 'font-bold text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {item.value.toFixed(5)} t
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onFilterRCA && (
              <button
                onClick={() => {
                  onFilterRCA(client.rca);
                  onClose();
                }}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                Filtrar por este Representante
              </button>
            )}
            {onFilterCidade && (
              <>
                <span className="text-slate-300">•</span>
                <button
                  onClick={() => {
                    onFilterCidade(client.cidade);
                    onClose();
                  }}
                  className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  Filtrar por {client.cidade}
                </button>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
