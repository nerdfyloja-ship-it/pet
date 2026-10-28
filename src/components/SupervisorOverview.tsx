import React, { useMemo } from 'react';
import { ClienteRecord } from '../types/dashboard';
import { Users, Filter, CheckCircle2, Weight, MapPin, Building2 } from 'lucide-react';

interface SupervisorOverviewProps {
  records: ClienteRecord[];
  onSelectSupervisor: (supervisor: string) => void;
}

export const SupervisorOverview: React.FC<SupervisorOverviewProps> = ({
  records,
  onSelectSupervisor,
}) => {
  const supervisorData = useMemo(() => {
    const map = new Map<
      string,
      {
        supervisor: string;
        totalClientes: number;
        rcas: Set<string>;
        cidades: Set<string>;
        positivadosSache: number;
        geralPositivados: number;
        toneladaPet: number;
        toneladaSache: number;
      }
    >();

    for (const r of records) {
      const sup = r.supervisor || 'Não Definido';
      let entry = map.get(sup);
      if (!entry) {
        entry = {
          supervisor: sup,
          totalClientes: 0,
          rcas: new Set<string>(),
          cidades: new Set<string>(),
          positivadosSache: 0,
          geralPositivados: 0,
          toneladaPet: 0,
          toneladaSache: 0,
        };
        map.set(sup, entry);
      }

      entry.totalClientes++;
      if (r.rca) entry.rcas.add(r.rca);
      if (r.cidade) entry.cidades.add(r.cidade);
      if (r.positivacao.totalSache > 0) entry.positivadosSache += r.positivacao.totalSache;
      if (r.positivacao.isPositivado) entry.geralPositivados++;
      entry.toneladaPet += r.tonelada.totalPet;
      entry.toneladaSache += r.tonelada.totalSache;
    }

    const list = Array.from(map.values()).map((item) => ({
      ...item,
      rcasCount: item.rcas.size,
      cidadesCount: item.cidades.size,
      taxaPositivacao: item.totalClientes > 0 ? (item.geralPositivados / item.totalClientes) * 100 : 0,
    }));

    list.sort((a, b) => b.toneladaPet - a.toneladaPet);
    return list;
  }, [records]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">
            Visão Geral das Equipes de Supervisão Comercial
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Acompanhamento consolidado por supervisor regional, número de representantes e volume de positivação.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {supervisorData.map((sup) => (
          <div
            key={sup.supervisor}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    SUPERVISÃO
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                    {sup.supervisor}
                  </h3>
                </div>
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-500 block">Clientes</span>
                  <span className="font-bold text-slate-900 text-sm">{sup.totalClientes}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-500 block">Representantes</span>
                  <span className="font-bold text-slate-900 text-sm">{sup.rcasCount}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-500 block">Cidades</span>
                  <span className="font-bold text-slate-900 text-sm">{sup.cidadesCount}</span>
                </div>
              </div>

              {/* Key numbers */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-amber-50/60 border border-amber-200/60">
                  <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                    <Weight className="w-3.5 h-3.5 text-amber-600" />
                    <span>Toneladas Pet:</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {sup.toneladaPet.toFixed(3).replace('.', ',')} t
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-emerald-50/60 border border-emerald-200/60">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Positivação Sachê:</span>
                  </div>
                  <span className="font-bold text-emerald-800 text-sm">
                    {sup.positivadosSache} clientes
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 px-1 pt-1">
                  <span>Taxa geral de positivação:</span>
                  <span className="font-bold text-slate-800">
                    {sup.taxaPositivacao.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Filter button */}
            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => onSelectSupervisor(sup.supervisor)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filtrar clientes deste supervisor</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
