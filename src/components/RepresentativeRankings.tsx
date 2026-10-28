import React, { useMemo, useState } from 'react';
import { ClienteRecord } from '../types/dashboard';
import { Trophy, ArrowUpDown, Filter, Award, TrendingUp, Users, Weight, CheckCircle2 } from 'lucide-react';

interface RepresentativeRankingsProps {
  records: ClienteRecord[];
  onSelectRCA: (rca: string) => void;
}

export const RepresentativeRankings: React.FC<RepresentativeRankingsProps> = ({
  records,
  onSelectRCA,
}) => {
  const [sortBy, setSortBy] = useState<'tonelada' | 'positivados' | 'taxa' | 'clientes'>('tonelada');

  const rcaData = useMemo(() => {
    const map = new Map<
      string,
      {
        rca: string;
        supervisor: string;
        totalClientes: number;
        positivadosSache: number;
        geralPositivados: number;
        toneladaPet: number;
        toneladaSache: number;
        cidades: Set<string>;
      }
    >();

    for (const r of records) {
      const rcaName = r.rca || 'Não Atribuído';
      let entry = map.get(rcaName);
      if (!entry) {
        entry = {
          rca: rcaName,
          supervisor: r.supervisor,
          totalClientes: 0,
          positivadosSache: 0,
          geralPositivados: 0,
          toneladaPet: 0,
          toneladaSache: 0,
          cidades: new Set<string>(),
        };
        map.set(rcaName, entry);
      }

      entry.totalClientes++;
      if (r.positivacao.totalSache > 0) entry.positivadosSache += r.positivacao.totalSache;
      if (r.positivacao.isPositivado) entry.geralPositivados++;
      entry.toneladaPet += r.tonelada.totalPet;
      entry.toneladaSache += r.tonelada.totalSache;
      if (r.cidade) entry.cidades.add(r.cidade);
    }

    const list = Array.from(map.values()).map((item) => ({
      ...item,
      cidadesCount: item.cidades.size,
      taxaPositivacao: item.totalClientes > 0 ? (item.geralPositivados / item.totalClientes) * 100 : 0,
    }));

    list.sort((a, b) => {
      if (sortBy === 'tonelada') return b.toneladaPet - a.toneladaPet;
      if (sortBy === 'positivados') return b.positivadosSache - a.positivadosSache;
      if (sortBy === 'taxa') return b.taxaPositivacao - a.taxaPositivacao;
      if (sortBy === 'clientes') return b.totalClientes - a.totalClientes;
      return 0;
    });

    return list;
  }, [records, sortBy]);

  return (
    <div className="space-y-4">
      {/* Header with Sort Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900">
              Ranking de Desempenho por Representante (RCA)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Compare positivação, toneladas entregues e base de clientes de cada representante comercial.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Ordenar por:</span>
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setSortBy('tonelada')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                sortBy === 'tonelada' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Toneladas Pet
            </button>
            <button
              onClick={() => setSortBy('positivados')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                sortBy === 'positivados' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Positivação Sachê
            </button>
            <button
              onClick={() => setSortBy('taxa')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                sortBy === 'taxa' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Taxa de Conversão
            </button>
            <button
              onClick={() => setSortBy('clientes')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                sortBy === 'clientes' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Qtd Clientes
            </button>
          </div>
        </div>
      </div>

      {/* Ranking Cards / Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 text-center w-14">#</th>
                <th className="py-3 px-4">REPRESENTANTE (RCA)</th>
                <th className="py-3 px-4">SUPERVISOR</th>
                <th className="py-3 px-4 text-center">BASE CLIENTES</th>
                <th className="py-3 px-4 text-center">CIDADES</th>
                <th className="py-3 px-4 text-center">POSITIVAÇÃO SACHÊ</th>
                <th className="py-3 px-4 text-center">TAXA DE POSITIVAÇÃO</th>
                <th className="py-3 px-4 text-right">TONELADAS PET</th>
                <th className="py-3 px-4 text-center">AÇÃO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rcaData.map((item, index) => {
                const isTop3 = index < 3;
                return (
                  <tr
                    key={item.rca}
                    className={`hover:bg-blue-50/60 transition-colors ${
                      isTop3 ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3 px-4 text-center font-bold">
                      {index === 0 && (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black shadow-xs">
                          1
                        </span>
                      )}
                      {index === 1 && (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-black shadow-xs">
                          2
                        </span>
                      )}
                      {index === 2 && (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white font-black shadow-xs">
                          3
                        </span>
                      )}
                      {index > 2 && (
                        <span className="text-slate-400 font-semibold">{index + 1}</span>
                      )}
                    </td>

                    {/* RCA Name */}
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {item.rca}
                    </td>

                    {/* Supervisor */}
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {item.supervisor}
                    </td>

                    {/* Clientes */}
                    <td className="py-3 px-4 text-center font-semibold text-slate-800">
                      {item.totalClientes}
                    </td>

                    {/* Cidades */}
                    <td className="py-3 px-4 text-center text-slate-600">
                      {item.cidadesCount}
                    </td>

                    {/* Positivação Sachê */}
                    <td className="py-3 px-4 text-center font-bold text-emerald-700">
                      {item.positivadosSache}
                    </td>

                    {/* Taxa de Positivação */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, item.taxaPositivacao)}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-700 text-[11px] w-10 text-right">
                          {item.taxaPositivacao.toFixed(1)}%
                        </span>
                      </div>
                    </td>

                    {/* Toneladas Pet */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-blue-900 text-sm">
                      {item.toneladaPet.toFixed(3).replace('.', ',')} t
                    </td>

                    {/* Filter Action */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onSelectRCA(item.rca)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] transition-colors cursor-pointer"
                        title="Ver clientes deste RCA no painel principal"
                      >
                        <Filter className="w-3 h-3" />
                        <span>Ver clientes</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
