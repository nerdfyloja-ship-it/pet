import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GOOGLE_SHEET_XLSX_URL =
  'https://docs.google.com/spreadsheets/d/1IJHZLEdF2NcKXbhpm-Ft38XqgvHx9Suv/export?format=xlsx';
const CORRECT_PASSWORD = 'Mastter@Pet';

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
  positivacao: {
    totalSache: number;
    optimumSache: number;
    smallBag: number;
    kitkatChamp: number;
    ct: number;
    isPositivado: boolean;
  };
  tonelada: {
    totalPet: number;
    totalSache: number;
    totalPetiscos: number;
    petiscoReset: number;
    smallbag: number;
    ct: number;
    dry: number;
    hasTonelada: boolean;
  };
}

let cachedData: {
  lastUpdated: string;
  records: ClienteRecord[];
  totals?: Record<string, number>;
} | null = null;

// Pre-load from local file
function loadLocalSnapshot() {
  try {
    const jsonPath = path.resolve(__dirname, 'src/data/conectaData.json');
    if (fs.existsSync(jsonPath)) {
      const content = fs.readFileSync(jsonPath, 'utf8');
      const parsed = JSON.parse(content);
      cachedData = {
        lastUpdated: parsed.lastUpdated || new Date().toISOString(),
        records: parsed.records || [],
        totals: parsed.totals,
      };
      console.log(`[Init] Loaded ${cachedData.records.length} records from local snapshot.`);
    }
  } catch (err) {
    console.error('[Init] Failed to load local snapshot:', err);
  }
}

async function fetchFromGoogleSheet(): Promise<boolean> {
  try {
    const res = await fetch(GOOGLE_SHEET_XLSX_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) MastterPetDashboard/1.0',
      },
    });
    if (!res.ok) {
      console.warn(`[Sync] Google Sheets returned status ${res.status}`);
      return false;
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (!buffer || buffer.length < 5000) {
      console.warn('[Sync] Response buffer too short for xlsx');
      return false;
    }

    const tmpXlsx = path.resolve(__dirname, 'temp_conecta.xlsx');
    const jsonOut = path.resolve(__dirname, 'src/data/conectaData.json');
    fs.writeFileSync(tmpXlsx, buffer);

    // Run python script to extract all calculated values cleanly
    execSync(`python3 scripts/parse_sheet.py "${tmpXlsx}" "${jsonOut}"`);

    if (fs.existsSync(tmpXlsx)) fs.unlinkSync(tmpXlsx);

    loadLocalSnapshot();
    console.log(`[Sync] Successfully updated ${cachedData?.records.length} records without errors.`);
    return true;
  } catch (err) {
    console.error('[Sync] Error fetching xlsx sheet data:', err);
    return false;
  }
}

loadLocalSnapshot();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.post('/api/auth/login', (req, res) => {
    const { password } = req.body;
    if (password === CORRECT_PASSWORD) {
      const token = Buffer.from(
        JSON.stringify({ authenticated: true, timestamp: Date.now() })
      ).toString('base64');
      return res.json({
        success: true,
        token,
        message: 'Acesso autorizado.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Senha incorreta. Verifique e tente novamente.',
    });
  });

  app.get('/api/data', async (req, res) => {
    if (!cachedData || cachedData.records.length === 0) {
      loadLocalSnapshot();
    }
    if (!cachedData) {
      return res.status(500).json({ error: 'Nenhum dado disponível' });
    }
    return res.json(cachedData);
  });

  app.post('/api/sync', async (req, res) => {
    const success = await fetchFromGoogleSheet();
    if (success && cachedData) {
      return res.json({
        success: true,
        lastUpdated: cachedData.lastUpdated,
        totalRecords: cachedData.records.length,
        records: cachedData.records,
        totals: cachedData.totals,
      });
    }
    // Fall back to current cache
    if (cachedData) {
      return res.json({
        success: false,
        warning: 'Não foi possível buscar a planilha agora, usando dados em cache.',
        lastUpdated: cachedData.lastUpdated,
        totalRecords: cachedData.records.length,
        records: cachedData.records,
        totals: cachedData.totals,
      });
    }
    return res.status(500).json({ success: false, error: 'Falha ao sincronizar' });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
