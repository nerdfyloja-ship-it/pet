import React, { useState } from 'react';
import { AggregatedStats } from '../types/dashboard';
import { Users, CheckCircle2, Weight, MapPin, ChevronDown, ChevronUp, Package, Layers } from 'lucide-react';

interface MetricCardsProps {
  stats: AggregatedStats;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ stats }) => {
  const [showProductBreakdown, setShowProductBreakdown] = useState(false);

  // Format numbers to Brazilian locale
  const formatTons = (val: number) => {
    return val.toLocaleString('pt-BR', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 5,
    });
  };

  const formatCount = (val: number) => {
    return val.toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-3">
      {/* 4 Main Cards matching the original design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: CLIENTES NA SELEÇÃO */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              CLIENTES NA SELEÇÃO
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatCount(stats.totalClientes)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>Clientes visíveis após os filtros</span>
            {stats.totalClientesBase > 0 && (
              <span className="font-medium text-blue-600">
                {((stats.totalClientes / stats.totalClientesBase) * 100).toFixed(1)}% da base
              </span>
            )}
          </div>
        </div>

        {/* Card 2: POSITIVAÇÃO - TOTAL SACHÊ */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              POSITIVAÇÃO · TOTAL SACHÊ
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatCount(stats.totalPositivadosSache)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>Soma dos registros filtrados</span>
            <span className="font-semibold text-emerald-600">
              {stats.taxaPositivacaoSache.toFixed(1)}% positivado
            </span>
          </div>
        </div>

        {/* Card 3: TONELADA - TOTAL PET */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              TONELADA · TOTAL PET
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Weight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatTons(stats.totalToneladasPet)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>Soma dos registros filtrados</span>
            <span className="text-slate-400 text-[11px]">toneladas (t)</span>
          </div>
        </div>

        {/* Card 4: CIDADES */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              CIDADES
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatCount(stats.cidadesDistintas)}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>Cidades distintas na seleção</span>
            <span className="text-indigo-600 text-[11px] font-medium">Municípios atendidos</span>
          </div>
        </div>
      </div>

      {/* Product & category toggle bar */}
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-xs">
        <button
          onClick={() => setShowProductBreakdown(!showProductBreakdown)}
          className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Detalhamento por Linha de Produto (Positivação & Tonelagem)</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <span>{showProductBreakdown ? 'Ocultar detalhes' : 'Ver todos os totais'}</span>
            {showProductBreakdown ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showProductBreakdown && (
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
            {/* Positivation breakdown */}
            <div className="bg-slate-50/80 rounded-lg p-3.5 border border-slate-200/70">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Positivação por Categoria</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">TOTAL SACHÊ</span>
                  <span className="font-bold text-slate-900 text-sm">{formatCount(stats.totalPositivadosSache)}</span>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">OPTIMUM SACHÊ</span>
                  <span className="font-bold text-slate-900 text-sm">{formatCount(stats.optimumSacheCount)}</span>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">SMALL BAG</span>
                  <span className="font-bold text-slate-900 text-sm">{formatCount(stats.smallBagCount)}</span>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">KITKAT / CHAMP</span>
                  <span className="font-bold text-slate-900 text-sm">{formatCount(stats.kitkatChampCount)}</span>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">C&T</span>
                  <span className="font-bold text-slate-900 text-sm">{formatCount(stats.ctPositivadoCount)}</span>
                </div>
              </div>
            </div>

            {/* Toneladas breakdown */}
            <div className="bg-slate-50/80 rounded-lg p-3.5 border border-slate-200/70">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                <Package className="w-3.5 h-3.5 text-amber-600" />
                <span>Toneladas por Categoria</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">TOTAL SACHÊ</span>
                  <span className="font-bold text-slate-900 text-sm">{formatTons(stats.toneladaSache)} t</span>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">TOTAL PETISCOS</span>
                  <span className="font-bold text-slate-900 text-sm">{formatTons(stats.toneladaPetiscos)} t</span>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">SMALLBAG</span>
                  <span className="font-bold text-slate-900 text-sm">{formatTons(stats.toneladaSmallbag)} t</span>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">C&T</span>
                  <span className="font-bold text-slate-900 text-sm">{formatTons(stats.toneladaCt)} t</span>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">DRY</span>
                  <span className="font-bold text-slate-900 text-sm">{formatTons(stats.toneladaDry)} t</span>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px]">TOTAL PET</span>
                  <span className="font-bold text-slate-900 text-sm">{formatTons(stats.totalToneladasPet)} t</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
