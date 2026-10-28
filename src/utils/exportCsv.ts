import { ClienteRecord } from '../types/dashboard';

export function exportToCSV(records: ClienteRecord[], filename = 'painel_mastter_pet_clientes.csv') {
  if (!records || records.length === 0) return;

  const headers = [
    'CODSUPERVISOR',
    'SUPERVISOR',
    'CODUSUR',
    'RCA',
    'CÓDIGO CLIENTE',
    'CLIENTE (RAZÃO SOCIAL)',
    'NOME FANTASIA',
    'CNPJ',
    'RAMO',
    'CIDADE',
    // Positivação
    'POS_TOTAL_SACHE',
    'POS_OPTIMUM_SACHE',
    'POS_SMALL_BAG',
    'POS_KITKAT_CHAMP',
    'POS_CT',
    'STATUS_POSITIVADO',
    // Toneladas
    'TON_TOTAL_PET',
    'TON_TOTAL_SACHE',
    'TON_TOTAL_PETISCOS',
    'TON_PETISCO_RESET',
    'TON_SMALLBAG',
    'TON_CT',
    'TON_DRY'
  ];

  const rows = records.map((r) => [
    `"${r.codSupervisor || ''}"`,
    `"${(r.supervisor || '').replace(/"/g, '""')}"`,
    `"${r.codUsur || ''}"`,
    `"${(r.rca || '').replace(/"/g, '""')}"`,
    `"${r.codCliPrinc || ''}"`,
    `"${(r.cliente || '').replace(/"/g, '""')}"`,
    `"${(r.fantasia || '').replace(/"/g, '""')}"`,
    `"${(r.cnpj || '').replace(/"/g, '""')}"`,
    `"${(r.ramo || '').replace(/"/g, '""')}"`,
    `"${(r.cidade || '').replace(/"/g, '""')}"`,
    r.positivacao.totalSache.toString().replace('.', ','),
    r.positivacao.optimumSache.toString().replace('.', ','),
    r.positivacao.smallBag.toString().replace('.', ','),
    r.positivacao.kitkatChamp.toString().replace('.', ','),
    r.positivacao.ct.toString().replace('.', ','),
    r.positivacao.isPositivado ? '"POSITIVADO"' : '"NÃO POSITIVADO"',
    r.tonelada.totalPet.toFixed(5).replace('.', ','),
    r.tonelada.totalSache.toFixed(5).replace('.', ','),
    r.tonelada.totalPetiscos.toFixed(5).replace('.', ','),
    r.tonelada.petiscoReset.toFixed(5).replace('.', ','),
    r.tonelada.smallbag.toFixed(5).replace('.', ','),
    r.tonelada.ct.toFixed(5).replace('.', ','),
    r.tonelada.dry.toFixed(5).replace('.', ',')
  ]);

  const csvContent = [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\r\n');
  // UTF-8 BOM
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
