import React from 'react';
import { FilterState } from '../types/dashboard';
import { Search, Download, RotateCcw, Filter, X } from 'lucide-react';

interface FiltersBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  supervisors: string[];
  rcas: string[];
  cidades: string[];
  ramos: string[];
  filteredCount: number;
  totalCount: number;
  onExportCSV: () => void;
  onResetFilters: () => void;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  setFilters,
  supervisors,
  rcas,
  cidades,
  ramos,
  filteredCount,
  totalCount,
  onExportCSV,
  onResetFilters,
}) => {
  const hasActiveFilters =
    filters.supervisor !== '' ||
    filters.rca !== '' ||
    filters.cidade !== '' ||
    filters.ramo !== '' ||
    filters.searchTerm !== '' ||
    filters.positivacaoFilter !== 'todos' ||
    filters.toneladaFilter !== 'todas';

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm space-y-4">
      {/* Title & record counter */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-bold text-slate-800">Filtrar clientes</h2>
          {hasActiveFilters && (
            <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
              Filtros ativos
            </span>
          )}
        </div>
        <span className="text-xs font-semibold text-slate-500">
          <strong className="text-slate-800 font-bold">{filteredCount}</strong> de {totalCount} registros
        </span>
      </div>

      {/* Grid of filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* SUPERVISOR */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            SUPERVISOR
          </label>
          <select
            value={filters.supervisor}
            onChange={(e) => setFilters((prev) => ({ ...prev, supervisor: e.target.value }))}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Todos os supervisores</option>
            {supervisors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* REPRESENTANTE (RCA) */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            REPRESENTANTE (RCA)
          </label>
          <select
            value={filters.rca}
            onChange={(e) => setFilters((prev) => ({ ...prev, rca: e.target.value }))}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Todos os representantes</option>
            {rcas.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* CIDADE */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            CIDADE
          </label>
          <select
            value={filters.cidade}
            onChange={(e) => setFilters((prev) => ({ ...prev, cidade: e.target.value }))}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Todas as cidades</option>
            {cidades.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* RAMO */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            RAMO
          </label>
          <select
            value={filters.ramo}
            onChange={(e) => setFilters((prev) => ({ ...prev, ramo: e.target.value }))}
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors truncate"
          >
            <option value="">Todos os ramos</option>
            {ramos.map((rm) => (
              <option key={rm} value={rm}>
                {rm}
              </option>
            ))}
          </select>
        </div>

        {/* PESQUISAR CLIENTE */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            PESQUISAR CLIENTE
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))}
              placeholder="Nome, fantasia ou CNPJ..."
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-7 py-2 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {filters.searchTerm && (
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, searchTerm: '' }))}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Secondary dropdowns & Action buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-3 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 max-w-xl">
          {/* POSITIVAÇÃO */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              POSITIVAÇÃO
            </label>
            <select
              value={filters.positivacaoFilter}
              onChange={(e) => setFilters((prev) => ({ ...prev, positivacaoFilter: e.target.value }))}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="todos">Todos</option>
              <option value="positivado">Positivado (Total Sachê &gt; 0)</option>
              <option value="nao_positivado">Não positivado (Total Sachê = 0)</option>
              <option value="geral_positivado">Positivado em Qualquer Produto</option>
              <option value="optimum">Positivado Optimum Sachê</option>
              <option value="smallbag">Positivado Small Bag</option>
              <option value="kitkat">Positivado KitKat / Champ</option>
              <option value="ct">Positivado C&amp;T</option>
            </select>
          </div>

          {/* TONELADA */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              TONELADA
            </label>
            <select
              value={filters.toneladaFilter}
              onChange={(e) => setFilters((prev) => ({ ...prev, toneladaFilter: e.target.value }))}
              className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="todas">Todas</option>
              <option value="com_tonelada">Com Tonelada (&gt; 0)</option>
              <option value="sem_tonelada">Sem Tonelada (= 0)</option>
              <option value="acima_1t">Maior que 1 Tonelada (&gt; 1.000 t)</option>
              <option value="acima_500kg">Maior que 500 kg (&gt; 0.500 t)</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={onResetFilters}
            disabled={!hasActiveFilters}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Limpar filtros</span>
          </button>
        </div>
      </div>
    </div>
  );
};
