export interface PositivacaoData {
  totalSache: number;
  optimumSache: number;
  smallBag: number;
  kitkatChamp: number;
  ct: number;
  isPositivado: boolean;
}

export interface ToneladaData {
  totalPet: number;
  totalSache: number;
  totalPetiscos: number;
  petiscoReset: number;
  smallbag: number;
  ct: number;
  dry: number;
  hasTonelada: boolean;
}

export interface ClienteRecord {
  id: string;
  codSupervisor: string;
  supervisor: string;
  codUsur: string;
  rca: string;
  codCliPrinc: string;
  clienteBase: string;
  cliente: string;
  fantasia: string;
  cnpj: string;
  ramo: string;
  cidade: string;
  positivacao: PositivacaoData;
  tonelada: ToneladaData;
}

export interface FilterState {
  supervisor: string;
  rca: string;
  cidade: string;
  ramo: string;
  searchTerm: string;
  positivacaoFilter: string; // 'todos' | 'positivado' | 'nao_positivado' | 'optimum' | 'smallbag' | 'kitkat' | 'ct'
  toneladaFilter: string; // 'todas' | 'com_tonelada' | 'sem_tonelada' | 'acima_1t'
}

export interface AggregatedStats {
  totalClientes: number;
  totalClientesBase: number;
  totalPositivadosSache: number;
  totalToneladasPet: number;
  cidadesDistintas: number;
  taxaPositivacaoSache: number;
  // Sub product positivation totals
  optimumSacheCount: number;
  smallBagCount: number;
  kitkatChampCount: number;
  ctPositivadoCount: number;
  // Sub ton totals
  toneladaSache: number;
  toneladaPetiscos: number;
  toneladaSmallbag: number;
  toneladaCt: number;
  toneladaDry: number;
}
