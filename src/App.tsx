import React, { useState, useEffect, useMemo, useCallback } from 'react';
import initialJson from './data/conectaData.json';
import { ClienteRecord, FilterState, AggregatedStats } from './types/dashboard';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { FiltersBar } from './components/FiltersBar';
import { CustomerTable } from './components/CustomerTable';
import { ClientDetailModal } from './components/ClientDetailModal';
import { RepresentativeRankings } from './components/RepresentativeRankings';
import { SupervisorOverview } from './components/SupervisorOverview';
import { exportToCSV } from './utils/exportCsv';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  supervisor: '',
  rca: '',
  cidade: '',
  ramo: '',
  searchTerm: '',
  positivacaoFilter: 'todos',
  toneladaFilter: 'todas',
};

export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return (
      Boolean(localStorage.getItem('mastter_auth_token')) ||
      Boolean(sessionStorage.getItem('mastter_auth_token'))
    );
  });

  // Data states
  const [records, setRecords] = useState<ClienteRecord[]>(
    (initialJson.records as unknown as ClienteRecord[]) || []
  );
  const [lastUpdated, setLastUpdated] = useState<string>(
    initialJson.lastUpdated || new Date().toISOString()
  );
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<{ message: string; type: 'success' | 'error' } | null>(
    null
  );

  // View state
  const [activeTab, setActiveTab] = useState<'table' | 'ranking' | 'supervisores'>('table');

  // Filters state
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Selected client for detail modal
  const [selectedClient, setSelectedClient] = useState<ClienteRecord | null>(null);

  // Auto clear toast after 4s
  useEffect(() => {
    if (syncToast) {
      const timer = setTimeout(() => setSyncToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [syncToast]);

  // Initial load from backend API if available
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const res = await fetch('/api/data');
        if (res.ok) {
          const data = await res.json();
          if (data.records && data.records.length > 0) {
            setRecords(data.records);
            if (data.lastUpdated) setLastUpdated(data.lastUpdated);
          }
        }
      } catch {
        // Fall back gracefully to local preloaded json
      }
    };
    fetchInitial();
  }, []);

  // Sync handler to pull fresh data from Google Sheets
  const handleSync = async () => {
    setIsSyncing(true);
    setSyncToast(null);

    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.records && data.records.length > 0) {
          setRecords(data.records);
          setLastUpdated(data.lastUpdated || new Date().toISOString());
          setSyncToast({
            message: `Planilha sincronizada! ${data.records.length} clientes carregados.`,
            type: 'success',
          });
          return;
        }
      }
      setSyncToast({
        message: 'Aviso: usando dados em cache.',
        type: 'success',
      });
    } catch {
      setSyncToast({
        message: 'Não foi possível conectar ao Google Sheets agora. Usando dados locais.',
        type: 'error',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mastter_auth_token');
    sessionStorage.removeItem('mastter_auth_token');
    setIsAuthenticated(false);
  };

  // Distinct Filter Dropdown options
  const { supervisors, rcas, cidades, ramos } = useMemo(() => {
    const supSet = new Set<string>();
    const rcaSet = new Set<string>();
    const cidSet = new Set<string>();
    const ramSet = new Set<string>();

    for (const r of records) {
      if (r.supervisor && !r.supervisor.includes('#')) supSet.add(r.supervisor);
      // Filter RCAs dynamically if a supervisor is selected
      if (!filters.supervisor || r.supervisor === filters.supervisor) {
        if (r.rca && !r.rca.includes('#')) rcaSet.add(r.rca);
      }
      if (r.cidade && !r.cidade.includes('#')) cidSet.add(r.cidade);
      if (r.ramo && !r.ramo.includes('#')) ramSet.add(r.ramo);
    }

    return {
      supervisors: Array.from(supSet).sort((a, b) => a.localeCompare(b, 'pt-BR')),
      rcas: Array.from(rcaSet).sort((a, b) => a.localeCompare(b, 'pt-BR')),
      cidades: Array.from(cidSet).sort((a, b) => a.localeCompare(b, 'pt-BR')),
      ramos: Array.from(ramSet).sort((a, b) => a.localeCompare(b, 'pt-BR')),
    };
  }, [records, filters.supervisor]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    const term = filters.searchTerm.trim().toLowerCase();

    return records.filter((r) => {
      // Supervisor filter
      if (filters.supervisor && r.supervisor !== filters.supervisor) return false;

      // RCA filter
      if (filters.rca && r.rca !== filters.rca) return false;

      // Cidade filter
      if (filters.cidade && r.cidade !== filters.cidade) return false;

      // Ramo filter
      if (filters.ramo && r.ramo !== filters.ramo) return false;

      // Search term filter (searches cliente, fantasia, cnpj, codigo)
      if (term) {
        const matchCliente = r.cliente.toLowerCase().includes(term);
        const matchFantasia = r.fantasia.toLowerCase().includes(term);
        const matchCnpj = r.cnpj.replace(/\D/g, '').includes(term.replace(/\D/g, '')) || r.cnpj.includes(term);
        const matchCod = r.codCliPrinc.includes(term);
        if (!matchCliente && !matchFantasia && !matchCnpj && !matchCod) return false;
      }

      // Positivação filter
      if (filters.positivacaoFilter === 'positivado') {
        if (r.positivacao.totalSache <= 0) return false;
      } else if (filters.positivacaoFilter === 'nao_positivado') {
        if (r.positivacao.totalSache > 0) return false;
      } else if (filters.positivacaoFilter === 'geral_positivado') {
        if (!r.positivacao.isPositivado) return false;
      } else if (filters.positivacaoFilter === 'optimum') {
        if (r.positivacao.optimumSache <= 0) return false;
      } else if (filters.positivacaoFilter === 'smallbag') {
        if (r.positivacao.smallBag <= 0) return false;
      } else if (filters.positivacaoFilter === 'kitkat') {
        if (r.positivacao.kitkatChamp <= 0) return false;
      } else if (filters.positivacaoFilter === 'ct') {
        if (r.positivacao.ct <= 0) return false;
      }

      // Tonelada filter
      if (filters.toneladaFilter === 'com_tonelada') {
        if (r.tonelada.totalPet <= 0) return false;
      } else if (filters.toneladaFilter === 'sem_tonelada') {
        if (r.tonelada.totalPet > 0) return false;
      } else if (filters.toneladaFilter === 'acima_1t') {
        if (r.tonelada.totalPet < 1.0) return false;
      } else if (filters.toneladaFilter === 'acima_500kg') {
        if (r.tonelada.totalPet < 0.5) return false;
      }

      return true;
    });
  }, [records, filters]);

  // Aggregated metrics for current selection
  const aggregatedStats: AggregatedStats = useMemo(() => {
    let sachePosCount = 0;
    let optimumCount = 0;
    let smallBagCount = 0;
    let kitkatCount = 0;
    let ctPosCount = 0;

    let petTonSum = 0;
    let sacheTonSum = 0;
    let petiscosTonSum = 0;
    let petiscoResetTonSum = 0;
    let smallbagTonSum = 0;
    let ctTonSum = 0;
    let dryTonSum = 0;

    const distinctCidades = new Set<string>();

    for (const r of filteredRecords) {
      if (r.positivacao.totalSache > 0) sachePosCount += r.positivacao.totalSache;
      if (r.positivacao.optimumSache > 0) optimumCount += r.positivacao.optimumSache;
      if (r.positivacao.smallBag > 0) smallBagCount += r.positivacao.smallBag;
      if (r.positivacao.kitkatChamp > 0) kitkatCount += r.positivacao.kitkatChamp;
      if (r.positivacao.ct > 0) ctPosCount += r.positivacao.ct;

      petTonSum += r.tonelada.totalPet;
      sacheTonSum += r.tonelada.totalSache;
      petiscosTonSum += r.tonelada.totalPetiscos;
      petiscoResetTonSum += r.tonelada.petiscoReset;
      smallbagTonSum += r.tonelada.smallbag;
      ctTonSum += r.tonelada.ct;
      dryTonSum += r.tonelada.dry;

      if (r.cidade) distinctCidades.add(r.cidade);
    }

    const total = filteredRecords.length;
    const taxaSache = total > 0 ? (sachePosCount / total) * 100 : 0;

    return {
      totalClientes: total,
      totalClientesBase: records.length,
      totalPositivadosSache: sachePosCount,
      totalToneladasPet: petTonSum,
      cidadesDistintas: distinctCidades.size,
      taxaPositivacaoSache: taxaSache,
      optimumSacheCount: optimumCount,
      smallBagCount: smallBagCount,
      kitkatChampCount: kitkatCount,
      ctPositivadoCount: ctPosCount,
      toneladaSache: sacheTonSum,
      toneladaPetiscos: petiscosTonSum,
      toneladaSmallbag: smallbagTonSum,
      toneladaCt: ctTonSum,
      toneladaDry: dryTonSum,
    };
  }, [filteredRecords, records.length]);

  const handleExportCSV = useCallback(() => {
    exportToCSV(filteredRecords, `mastter_pet_clientes_${new Date().toISOString().slice(0, 10)}.csv`);
  }, [filteredRecords]);

  const handleResetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const handleFilterByRCA = useCallback((rca: string) => {
    setFilters((prev) => ({ ...prev, rca }));
    setActiveTab('table');
  }, []);

  const handleFilterBySupervisor = useCallback((supervisor: string) => {
    setFilters((prev) => ({ ...prev, supervisor, rca: '' }));
    setActiveTab('table');
  }, []);

  const handleFilterByCidade = useCallback((cidade: string) => {
    setFilters((prev) => ({ ...prev, cidade }));
    setActiveTab('table');
  }, []);

  // If not authenticated, show password login screen
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 flex flex-col font-sans">
      {/* Toast notification */}
      {syncToast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl border text-xs font-semibold animate-in slide-in-from-bottom duration-200 ${
            syncToast.type === 'success'
              ? 'bg-emerald-900/90 border-emerald-500/40 text-emerald-100'
              : 'bg-rose-900/90 border-rose-500/40 text-rose-100'
          }`}
        >
          {syncToast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{syncToast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        lastUpdated={lastUpdated}
        isSyncing={isSyncing}
        onSync={handleSync}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filteredCount={filteredRecords.length}
        totalCount={records.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
        {/* Metric Cards (always in view for immediate numbers) */}
        <MetricCards stats={aggregatedStats} />

        {/* Filters Bar */}
        <FiltersBar
          filters={filters}
          setFilters={setFilters}
          supervisors={supervisors}
          rcas={rcas}
          cidades={cidades}
          ramos={ramos}
          filteredCount={filteredRecords.length}
          totalCount={records.length}
          onExportCSV={handleExportCSV}
          onResetFilters={handleResetFilters}
        />

        {/* Tab Content */}
        {activeTab === 'table' && (
          <CustomerTable
            records={filteredRecords}
            onSelectClient={(client) => setSelectedClient(client)}
          />
        )}

        {activeTab === 'ranking' && (
          <RepresentativeRankings
            records={filteredRecords}
            onSelectRCA={handleFilterByRCA}
          />
        )}

        {activeTab === 'supervisores' && (
          <SupervisorOverview
            records={filteredRecords}
            onSelectSupervisor={handleFilterBySupervisor}
          />
        )}
      </main>

      {/* Customer Detail Drawer / Modal */}
      <ClientDetailModal
        client={selectedClient}
        onClose={() => setSelectedClient(null)}
        onFilterRCA={handleFilterByRCA}
        onFilterCidade={handleFilterByCidade}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 mt-auto">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Painel Mastter Pet • Conectado à planilha oficial Google Sheets ({records.length} clientes na base)
          </span>
          <span className="font-medium text-slate-600">
            Senha do Portal: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">Mastter@Pet</code>
          </span>
        </div>
      </footer>
    </div>
  );
}
