import React, { useState, useMemo } from 'react';
import { ClienteRecord } from '../types/dashboard';
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Info } from 'lucide-react';

interface CustomerTableProps {
  records: ClienteRecord[];
  onSelectClient: (client: ClienteRecord) => void;
}

type SortField =
  | 'supervisor'
  | 'rca'
  | 'codCliPrinc'
  | 'cliente'
  | 'fantasia'
  | 'cnpj'
  | 'ramo'
  | 'cidade'
  | 'posTotalSache'
  | 'posOptimum'
  | 'posSmallbag'
  | 'posKitkat'
  | 'posCt'
  | 'tonTotalPet'
  | 'tonTotalSache';

export const CustomerTable: React.FC<CustomerTableProps> = ({ records, onSelectClient }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [sortField, setSortField] = useState<SortField>('codCliPrinc');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handle header sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedRecords = useMemo(() => {
    const list = [...records];
    list.sort((a, b) => {
      let valA: string | number = '';
      let valB: string | number = '';

      switch (sortField) {
        case 'supervisor':
          valA = a.supervisor.toLowerCase();
          valB = b.supervisor.toLowerCase();
          break;
        case 'rca':
          valA = a.rca.toLowerCase();
          valB = b.rca.toLowerCase();
          break;
        case 'codCliPrinc':
          valA = parseInt(a.codCliPrinc, 10) || 0;
          valB = parseInt(b.codCliPrinc, 10) || 0;
          break;
        case 'cliente':
          valA = a.cliente.toLowerCase();
          valB = b.cliente.toLowerCase();
          break;
        case 'fantasia':
          valA = a.fantasia.toLowerCase();
          valB = b.fantasia.toLowerCase();
          break;
        case 'cnpj':
          valA = a.cnpj;
          valB = b.cnpj;
          break;
        case 'ramo':
          valA = a.ramo.toLowerCase();
          valB = b.ramo.toLowerCase();
          break;
        case 'cidade':
          valA = a.cidade.toLowerCase();
          valB = b.cidade.toLowerCase();
          break;
        case 'posTotalSache':
          valA = a.positivacao.totalSache;
          valB = b.positivacao.totalSache;
          break;
        case 'posOptimum':
          valA = a.positivacao.optimumSache;
          valB = b.positivacao.optimumSache;
          break;
        case 'posSmallbag':
          valA = a.positivacao.smallBag;
          valB = b.positivacao.smallBag;
          break;
        case 'posKitkat':
          valA = a.positivacao.kitkatChamp;
          valB = b.positivacao.kitkatChamp;
          break;
        case 'posCt':
          valA = a.positivacao.ct;
          valB = b.positivacao.ct;
          break;
        case 'tonTotalPet':
          valA = a.tonelada.totalPet;
          valB = b.tonelada.totalPet;
          break;
        case 'tonTotalSache':
          valA = a.tonelada.totalSache;
          valB = b.tonelada.totalSache;
          break;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [records, sortField, sortDirection]);

  // Pagination logic
  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  // Reset to page 1 if record list size shrinks
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-300 ml-1 inline opacity-0 group-hover:opacity-100" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-blue-600 ml-1 inline" />
    ) : (
      <ArrowDown className="w-3 h-3 text-blue-600 ml-1 inline" />
    );
  };

  const renderDot = (value: number, label: string) => {
    const isPos = value > 0;
    return (
      <div className="flex justify-center items-center py-0.5" title={`${label}: ${isPos ? 'Positivado' : 'Não positivado'}`}>
        <span
          className={`w-3.5 h-3.5 rounded-full inline-block shadow-xs transition-transform hover:scale-125 ${
            isPos
              ? 'bg-[#22c55e] ring-2 ring-emerald-200'
              : 'bg-[#ef4444] ring-2 ring-rose-200'
          }`}
        />
      </div>
    );
  };

  const formatTonCell = (val: number) => {
    return (
      <span className={val > 0 ? 'font-semibold text-slate-900' : 'text-slate-400'}>
        {val.toFixed(5)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Table Header top bar with Legend */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900">Detalhe por cliente</h3>
          <span className="text-xs text-slate-500 font-medium">
            (Clique em uma linha para ver a ficha completa)
          </span>
        </div>

        {/* Legend from user screenshot */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
            <span>Positivado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
            <span>Não positivado</span>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left text-xs border-collapse">
          {/* Grouped Header Tier 1 */}
          <thead>
            <tr className="bg-[#e8f1f8] border-b border-slate-300 text-slate-700 text-center font-bold tracking-wider uppercase text-[11px]">
              <th colSpan={8} className="py-2.5 px-3 border-r border-slate-300/80">
                DADOS DO CLIENTE
              </th>
              <th colSpan={5} className="py-2.5 px-3 border-r border-slate-300/80 text-blue-900 bg-[#deecf7]">
                POSITIVAÇÃO
              </th>
              <th colSpan={7} className="py-2.5 px-3 text-slate-800 bg-[#e3ecf5]">
                TONELADA
              </th>
            </tr>

            {/* Subheader Tier 2 */}
            <tr className="bg-[#f1f6fa] border-b border-slate-200 text-slate-600 font-bold text-[10.5px] uppercase tracking-wider">
              {/* Client Info columns */}
              <th
                onClick={() => handleSort('supervisor')}
                className="py-2.5 px-3 cursor-pointer group hover:bg-slate-200/60 transition-colors whitespace-nowrap"
              >
                SUPERVISOR {renderSortIcon('supervisor')}
              </th>
              <th
                onClick={() => handleSort('rca')}
                className="py-2.5 px-3 cursor-pointer group hover:bg-slate-200/60 transition-colors whitespace-nowrap"
              >
                REPRESENTANTE / RCA {renderSortIcon('rca')}
              </th>
              <th
                onClick={() => handleSort('codCliPrinc')}
                className="py-2.5 px-3 cursor-pointer group hover:bg-slate-200/60 transition-colors whitespace-nowrap text-center"
              >
                CÓDIGO {renderSortIcon('codCliPrinc')}
              </th>
              <th
                onClick={() => handleSort('cliente')}
                className="py-2.5 px-3 cursor-pointer group hover:bg-slate-200/60 transition-colors whitespace-nowrap min-w-[180px]"
              >
                CLIENTE {renderSortIcon('cliente')}
              </th>
              <th
                onClick={() => handleSort('fantasia')}
                className="py-2.5 px-3 cursor-pointer group hover:bg-slate-200/60 transition-colors whitespace-nowrap min-w-[160px]"
              >
                NOME FANTASIA {renderSortIcon('fantasia')}
              </th>
              <th
                onClick={() => handleSort('cnpj')}
                className="py-2.5 px-3 cursor-pointer group hover:bg-slate-200/60 transition-colors whitespace-nowrap"
              >
                CNPJ {renderSortIcon('cnpj')}
              </th>
              <th
                onClick={() => handleSort('ramo')}
                className="py-2.5 px-3 cursor-pointer group hover:bg-slate-200/60 transition-colors whitespace-nowrap max-w-[160px]"
              >
                RAMO {renderSortIcon('ramo')}
              </th>
              <th
                onClick={() => handleSort('cidade')}
                className="py-2.5 px-3 border-r border-slate-300/80 cursor-pointer group hover:bg-slate-200/60 transition-colors whitespace-nowrap"
              >
                CIDADE {renderSortIcon('cidade')}
              </th>

              {/* Positivação columns */}
              <th
                onClick={() => handleSort('posTotalSache')}
                className="py-2.5 px-2 text-center bg-[#e7f0f7] border-r border-slate-200 cursor-pointer group hover:bg-blue-100/60 whitespace-nowrap"
              >
                TOTAL SACHÊ {renderSortIcon('posTotalSache')}
              </th>
              <th
                onClick={() => handleSort('posOptimum')}
                className="py-2.5 px-2 text-center bg-[#e7f0f7] border-r border-slate-200 cursor-pointer group hover:bg-blue-100/60 whitespace-nowrap"
              >
                OPTIMUM SACHÊ {renderSortIcon('posOptimum')}
              </th>
              <th
                onClick={() => handleSort('posSmallbag')}
                className="py-2.5 px-2 text-center bg-[#e7f0f7] border-r border-slate-200 cursor-pointer group hover:bg-blue-100/60 whitespace-nowrap"
              >
                SMALL BAG {renderSortIcon('posSmallbag')}
              </th>
              <th
                onClick={() => handleSort('posKitkat')}
                className="py-2.5 px-2 text-center bg-[#e7f0f7] border-r border-slate-200 cursor-pointer group hover:bg-blue-100/60 whitespace-nowrap"
              >
                KITKAT / CHAMP {renderSortIcon('posKitkat')}
              </th>
              <th
                onClick={() => handleSort('posCt')}
                className="py-2.5 px-2 text-center bg-[#e7f0f7] border-r border-slate-300/80 cursor-pointer group hover:bg-blue-100/60 whitespace-nowrap"
              >
                C&amp;T {renderSortIcon('posCt')}
              </th>

              {/* Tonelada columns */}
              <th
                onClick={() => handleSort('tonTotalPet')}
                className="py-2.5 px-2.5 text-right bg-[#ebf2f8] border-r border-slate-200 cursor-pointer group hover:bg-slate-200/60 whitespace-nowrap"
              >
                TOTAL PET {renderSortIcon('tonTotalPet')}
              </th>
              <th
                onClick={() => handleSort('tonTotalSache')}
                className="py-2.5 px-2.5 text-right bg-[#ebf2f8] border-r border-slate-200 cursor-pointer group hover:bg-slate-200/60 whitespace-nowrap"
              >
                TOTAL SACHÊ {renderSortIcon('tonTotalSache')}
              </th>
              <th className="py-2.5 px-2.5 text-right bg-[#ebf2f8] border-r border-slate-200 whitespace-nowrap">
                TOTAL PETISCOS
              </th>
              <th className="py-2.5 px-2.5 text-right bg-[#ebf2f8] border-r border-slate-200 whitespace-nowrap">
                PETISCO RESET
              </th>
              <th className="py-2.5 px-2.5 text-right bg-[#ebf2f8] border-r border-slate-200 whitespace-nowrap">
                SMALLBAG
              </th>
              <th className="py-2.5 px-2.5 text-right bg-[#ebf2f8] border-r border-slate-200 whitespace-nowrap">
                C&amp;T
              </th>
              <th className="py-2.5 px-2.5 text-right bg-[#ebf2f8] whitespace-nowrap">
                DRY
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 text-[11.5px]">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={20} className="py-12 text-center text-slate-400">
                  <Info className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="font-semibold text-slate-600 text-sm">Nenhum cliente encontrado</p>
                  <p className="text-xs text-slate-400 mt-0.5">Tente ajustar ou limpar os filtros de busca.</p>
                </td>
              </tr>
            ) : (
              paginatedRecords.map((r, idx) => (
                <tr
                  key={r.id || idx}
                  onClick={() => onSelectClient(r)}
                  className="hover:bg-blue-50/70 transition-colors cursor-pointer group"
                >
                  {/* Supervisor */}
                  <td className="py-2 px-3 text-slate-700 whitespace-nowrap font-medium">
                    {!r.supervisor || r.supervisor.includes('#') ? 'Outros' : r.supervisor}
                  </td>
                  {/* RCA */}
                  <td className="py-2 px-3 text-slate-700 whitespace-nowrap">
                    {!r.rca || r.rca.includes('#') ? 'Geral' : r.rca}
                  </td>
                  {/* Código */}
                  <td className="py-2 px-3 text-center font-mono font-semibold text-slate-900 bg-slate-50/50 group-hover:bg-transparent">
                    {!r.codCliPrinc || r.codCliPrinc.includes('#') ? (r.clienteBase || '-') : r.codCliPrinc}
                  </td>
                  {/* Cliente */}
                  <td className="py-2 px-3 font-semibold text-slate-900 max-w-[220px] truncate" title={r.cliente}>
                    {r.cliente}
                  </td>
                  {/* Fantasia */}
                  <td className="py-2 px-3 text-slate-700 max-w-[200px] truncate" title={r.fantasia}>
                    {!r.fantasia || r.fantasia.includes('#') ? r.cliente : r.fantasia}
                  </td>
                  {/* CNPJ */}
                  <td className="py-2 px-3 font-mono text-slate-600 whitespace-nowrap">
                    {!r.cnpj || r.cnpj.includes('#') ? '-' : r.cnpj}
                  </td>
                  {/* Ramo */}
                  <td className="py-2 px-3 text-slate-600 max-w-[170px] truncate" title={r.ramo}>
                    {!r.ramo || r.ramo.includes('#') ? 'Geral' : r.ramo}
                  </td>
                  {/* Cidade */}
                  <td className="py-2 px-3 text-slate-700 border-r border-slate-200 whitespace-nowrap">
                    {!r.cidade || r.cidade.includes('#') ? '-' : r.cidade}
                  </td>

                  {/* Positivação Dots */}
                  <td className="py-2 px-2 text-center bg-[#f8fbfe] border-r border-slate-100 group-hover:bg-transparent">
                    {renderDot(r.positivacao.totalSache, 'Total Sachê')}
                  </td>
                  <td className="py-2 px-2 text-center bg-[#f8fbfe] border-r border-slate-100 group-hover:bg-transparent">
                    {renderDot(r.positivacao.optimumSache, 'Optimum Sachê')}
                  </td>
                  <td className="py-2 px-2 text-center bg-[#f8fbfe] border-r border-slate-100 group-hover:bg-transparent">
                    {renderDot(r.positivacao.smallBag, 'Small Bag')}
                  </td>
                  <td className="py-2 px-2 text-center bg-[#f8fbfe] border-r border-slate-100 group-hover:bg-transparent">
                    {renderDot(r.positivacao.kitkatChamp, 'KitKat / Champ')}
                  </td>
                  <td className="py-2 px-2 text-center bg-[#f8fbfe] border-r border-slate-200 group-hover:bg-transparent">
                    {renderDot(r.positivacao.ct, 'C&T')}
                  </td>

                  {/* Tonelada Columns */}
                  <td className="py-2 px-2.5 text-right font-mono bg-slate-50/30 border-r border-slate-100 group-hover:bg-transparent">
                    {formatTonCell(r.tonelada.totalPet)}
                  </td>
                  <td className="py-2 px-2.5 text-right font-mono bg-slate-50/30 border-r border-slate-100 group-hover:bg-transparent">
                    {formatTonCell(r.tonelada.totalSache)}
                  </td>
                  <td className="py-2 px-2.5 text-right font-mono bg-slate-50/30 border-r border-slate-100 group-hover:bg-transparent">
                    {formatTonCell(r.tonelada.totalPetiscos)}
                  </td>
                  <td className="py-2 px-2.5 text-right font-mono bg-slate-50/30 border-r border-slate-100 group-hover:bg-transparent">
                    {formatTonCell(r.tonelada.petiscoReset)}
                  </td>
                  <td className="py-2 px-2.5 text-right font-mono bg-slate-50/30 border-r border-slate-100 group-hover:bg-transparent">
                    {formatTonCell(r.tonelada.smallbag)}
                  </td>
                  <td className="py-2 px-2.5 text-right font-mono bg-slate-50/30 border-r border-slate-100 group-hover:bg-transparent">
                    {formatTonCell(r.tonelada.ct)}
                  </td>
                  <td className="py-2 px-2.5 text-right font-mono bg-slate-50/30 group-hover:bg-transparent">
                    {formatTonCell(r.tonelada.dry)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="px-5 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/80 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>Linhas por página:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={250}>250</option>
            <option value={1000}>1000</option>
          </select>
          <span className="text-slate-500 pl-2">
            Mostrando {Math.min((currentPage - 1) * pageSize + 1, sortedRecords.length)} a{' '}
            {Math.min(currentPage * pageSize, sortedRecords.length)} de {sortedRecords.length} clientes
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Primeira página"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-3 font-medium">
            Página <strong className="text-slate-900">{currentPage}</strong> de {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Próxima página"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Última página"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
