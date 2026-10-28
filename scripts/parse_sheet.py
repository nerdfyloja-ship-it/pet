import sys
import os
import zipfile
import xml.etree.ElementTree as ET
import json

def clean_num(val):
    if not val:
        return 0.0
    try:
        n = float(val)
        if abs(n) < 1e-6:
            return 0.0
        return round(n, 5)
    except:
        return 0.0

def parse_xlsx(file_path):
    with zipfile.ZipFile(file_path, 'r') as z:
        # Read shared strings
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            sst_xml = z.read('xl/sharedStrings.xml')
            sst_root = ET.fromstring(sst_xml)
            for si in sst_root.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
                t = si.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')
                if t is not None and t.text:
                    shared_strings.append(t.text)
                else:
                    parts = [elem.text for elem in si.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if elem.text]
                    shared_strings.append(''.join(parts))

        sheet_xml = z.read('xl/worksheets/sheet1.xml')
        sheet_root = ET.fromstring(sheet_xml)
        ns = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'

        records = []
        totals = {}

        for row in sheet_root.iter(ns + 'row'):
            r_idx = int(row.get('r'))
            cells = {}
            for c in row.findall(ns + 'c'):
                ref = c.get('r')
                col = ''.join([ch for ch in ref if ch.isalpha()])
                t_attr = c.get('t')
                v_tag = c.find(ns + 'v')
                val = ''
                if v_tag is not None and v_tag.text:
                    val = v_tag.text
                    if t_attr == 's' and int(val) < len(shared_strings):
                        val = shared_strings[int(val)]
                cells[col] = val.strip()

            if r_idx == 2:
                totals = {
                    'totalSachePos': int(clean_num(cells.get('L', '0'))),
                    'optimumSachePos': int(clean_num(cells.get('M', '0'))),
                    'smallBagPos': int(clean_num(cells.get('N', '0'))),
                    'kitkatChampPos': int(clean_num(cells.get('O', '0'))),
                    'ctPos': int(clean_num(cells.get('P', '0'))),
                    'totalPetTon': clean_num(cells.get('R', '0')),
                    'totalSacheTon': clean_num(cells.get('S', '0')),
                    'totalPetiscosTon': clean_num(cells.get('T', '0')),
                    'petiscoResetTon': clean_num(cells.get('U', '0')),
                    'smallbagTon': clean_num(cells.get('V', '0')),
                    'ctTon': clean_num(cells.get('W', '0')),
                    'dryTon': clean_num(cells.get('X', '0')),
                }
            elif r_idx >= 4:
                cod_sup = cells.get('A', '')
                supervisor = cells.get('B', '')
                cod_usur = cells.get('C', '')
                rca = cells.get('D', '')
                cod_cli = cells.get('E', '')
                cli_base = cells.get('F', '')
                cliente = cells.get('G', '')
                fantasia = cells.get('H', '')
                cnpj = cells.get('I', '')
                ramo = cells.get('J', '')
                cidade = cells.get('K', '')

                # Clean any lingering formula error strings if encountered
                if '#ERROR!' in supervisor or '#N/A' in supervisor:
                    supervisor = 'Outros'
                if '#ERROR!' in rca or '#N/A' in rca:
                    rca = 'Outros'
                if '#ERROR!' in cidade or '#N/A' in cidade:
                    cidade = 'Não informada'
                if '#ERROR!' in cnpj or '#N/A' in cnpj:
                    cnpj = '-'
                if '#ERROR!' in ramo or '#N/A' in ramo:
                    ramo = 'Geral'
                if '#ERROR!' in fantasia or '#N/A' in fantasia:
                    fantasia = cliente
                if '#ERROR!' in cod_cli or '#N/A' in cod_cli:
                    cod_cli = cli_base

                total_sache = clean_num(cells.get('L', '0'))
                optimum = clean_num(cells.get('M', '0'))
                small_bag = clean_num(cells.get('N', '0'))
                kitkat = clean_num(cells.get('O', '0'))
                ct_pos = clean_num(cells.get('P', '0'))

                total_pet = clean_num(cells.get('R', '0'))
                total_sache_ton = clean_num(cells.get('S', '0'))
                petiscos = clean_num(cells.get('T', '0'))
                petisco_reset = clean_num(cells.get('U', '0'))
                smallbag = clean_num(cells.get('V', '0'))
                ct_ton = clean_num(cells.get('W', '0'))
                dry = clean_num(cells.get('X', '0'))

                is_positivado = total_sache > 0 or optimum > 0 or small_bag > 0 or kitkat > 0 or ct_pos > 0
                has_tonelada = total_pet > 0 or total_sache_ton > 0

                records.append({
                    'id': f'CLI_{cod_cli or cli_base}_{r_idx}',
                    'codSupervisor': cod_sup,
                    'supervisor': supervisor,
                    'codUsur': cod_usur,
                    'rca': rca,
                    'codCliPrinc': cod_cli or cli_base,
                    'clienteBase': cli_base,
                    'cliente': cliente,
                    'fantasia': fantasia or cliente,
                    'cnpj': cnpj,
                    'ramo': ramo,
                    'cidade': cidade,
                    'positivacao': {
                        'totalSache': total_sache,
                        'optimumSache': optimum,
                        'smallBag': small_bag,
                        'kitkatChamp': kitkat,
                        'ct': ct_pos,
                        'isPositivado': is_positivado
                    },
                    'tonelada': {
                        'totalPet': total_pet,
                        'totalSache': total_sache_ton,
                        'totalPetiscos': petiscos,
                        'petiscoReset': petisco_reset,
                        'smallbag': smallbag,
                        'ct': ct_ton,
                        'dry': dry,
                        'hasTonelada': has_tonelada
                    }
                })

        return {
            'lastUpdated': '2026-10-28T19:05:00.000Z',
            'sheetUrl': 'https://docs.google.com/spreadsheets/d/1IJHZLEdF2NcKXbhpm-Ft38XqgvHx9Suv/edit?usp=sharing',
            'totalRecords': len(records),
            'totals': totals,
            'records': records
        }

if __name__ == '__main__':
    target_file = sys.argv[1] if len(sys.argv) > 1 else 'test.xlsx'
    out_file = sys.argv[2] if len(sys.argv) > 2 else 'src/data/conectaData.json'
    result = parse_xlsx(target_file)
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f'Successfully parsed {len(result[\"records\"])} records into {out_file}')
