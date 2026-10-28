import React from 'react';
import { RefreshCw, ExternalLink, LogOut, CheckCircle2, Table, Trophy, Users } from 'lucide-react';

interface HeaderProps {
  lastUpdated: string;
  isSyncing: boolean;
  onSync: () => void;
  onLogout: () => void;
  activeTab: 'table' | 'ranking' | 'supervisores';
  setActiveTab: (tab: 'table' | 'ranking' | 'supervisores') => void;
  filteredCount: number;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  isSyncing,
  onSync,
  onLogout,
  activeTab,
  setActiveTab,
  filteredCount,
  totalCount,
}) => {
  const formattedDate = React.useMemo(() => {
    if (!lastUpdated) return 'Hoje';
    try {
      const d = new Date(lastUpdated);
      return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' de ' + d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    } catch {
      return 'Agora';
    }
  }, [lastUpdated]);

  return (
    <header className="bg-[#0f2744] text-white border-b border-blue-900/60 shadow-md sticky top-0 z-30">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3.5 gap-3">
          {/* Logo & title */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-amber-400 flex items-center justify-center font-black text-slate-950 text-base shadow-md shadow-blue-500/20 shrink-0">
              MP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  Mastter Pet
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/20">
                    Dashboard Comercial
                  </span>
                </h1>
              </div>
              <p className="text-xs text-blue-200/80">
                Acompanhamento de Positivação & Tonelagem • Base Conecta ({filteredCount} de {totalCount} registros)
              </p>
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="flex items-center bg-blue-950/70 p-1 rounded-xl border border-blue-800/40 self-start md:self-auto text-xs font-medium">
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'table'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-blue-200 hover:text-white hover:bg-blue-800/30'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Painel de Clientes</span>
            </button>
            <button
              onClick={() => setActiveTab('ranking')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'ranking'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-blue-200 hover:text-white hover:bg-blue-800/30'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Ranking Representantes</span>
            </button>
            <button
              onClick={() => setActiveTab('supervisores')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'supervisores'
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'text-blue-200 hover:text-white hover:bg-blue-800/30'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Supervisão</span>
            </button>
          </div>

          {/* Actions & sync */}
          <div className="flex items-center gap-2.5 self-end md:self-auto">
            {/* Sync button */}
            <button
              onClick={onSync}
              disabled={isSyncing}
              title="Recarregar dados mais recentes da planilha Google Sheets"
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-800/40 hover:bg-blue-700/50 border border-blue-700/40 text-blue-100 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-300 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sincronizar Planilha</span>
              <span className="text-[10px] text-blue-300 font-normal">({formattedDate})</span>
            </button>

            {/* Link to Google Sheet */}
            <a
              href="https://docs.google.com/spreadsheets/d/1IJHZLEdF2NcKXbhpm-Ft38XqgvHx9Suv/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir planilha no Google Sheets"
              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-blue-900/30 hover:bg-blue-800/40 border border-blue-800/40 text-blue-300 hover:text-blue-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Google Sheets</span>
            </a>

            {/* Logout button */}
            <button
              onClick={onLogout}
              title="Sair do painel"
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 hover:text-rose-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
