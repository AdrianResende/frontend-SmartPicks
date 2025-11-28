import { ref } from 'vue';
import axios from 'axios';

export interface PartidaCartola {
    partida_id: number;
    clube_casa_id: number;
    clube_visitante_id: number;
    partida_data: string; // ISO ou com timezone
    local: string | null;
    placar_oficial_mandante?: number | null;
    placar_oficial_visitante?: number | null;
    clube_casa_nome?: string;
    clube_visitante_nome?: string;
    clube_casa?: { nome: string; escudo?: string };
    clube_visitante?: { nome: string; escudo?: string };
}

export function useBrasileirao() {
    const loading = ref(false);
    const error = ref('');
    const partidas = ref<PartidaCartola[]>([]);
    const clubesMap = ref<Record<number, { nome: string; escudo: string }>>({});

    async function fetchClubes() {
        try {
            const urlClubes = 'https://api.cartola.globo.com/clubes';
            const { data } = await axios.get(urlClubes, { headers: { Accept: 'application/json' } });
            const mapa: Record<number, { nome: string; escudo: string }> = {};
            // API retorna objeto com chaves numéricas (como string). Ex.: { "262": { nome, escudos } }
            if (data && typeof data === 'object') {
                for (const key of Object.keys(data)) {
                    const id = Number(key);
                    const clube = data[key] || {};
                    const nome: string = clube?.nome || clube?.apelido || 'Clube';
                    // campos possíveis: clube.escudos['60x60'] ou clube.escudo_url
                    const escudos = clube?.escudos || {};
                    const escudo: string = escudos['60x60'] || escudos['45x45'] || clube?.escudo_url || '';
                    mapa[id] = { nome, escudo };
                }
            }
            clubesMap.value = mapa;
        } catch (e) {
            console.warn('Falha ao buscar clubes do Cartola. Segue sem escudos:', e);
        }
    }

    async function fetchProximasPartidas() {
        loading.value = true;
        error.value = '';
        try {
            // API pública do Cartola FC: lista partidas da rodada
            const url = 'https://api.cartola.globo.com/partidas';
            const { data } = await axios.get(url, { headers: { 'Accept': 'application/json' } });
            const lista: PartidaCartola[] = Array.isArray(data?.partidas) ? data.partidas : [];

            // garante mapa de clubes carregado
            if (!Object.keys(clubesMap.value).length) {
                await fetchClubes();
            }

            const hoje = new Date();
            // Filtra partidas futuras com base em data
            const futuras = lista.filter((p) => {
                const dt = new Date(p.partida_data?.replace(' ', 'T'));
                return !isNaN(dt.getTime()) && dt.getTime() >= hoje.getTime();
            });

            // Ordena por data
            futuras.sort((a, b) => {
                const da = new Date(a.partida_data?.replace(' ', 'T')).getTime();
                const db = new Date(b.partida_data?.replace(' ', 'T')).getTime();
                return da - db;
            });

            const enriquecidas = futuras.map((p) => {
                const casa = clubesMap.value[p.clube_casa_id] || { nome: p.clube_casa_nome || 'Mandante', escudo: '' };
                const visitante = clubesMap.value[p.clube_visitante_id] || { nome: p.clube_visitante_nome || 'Visitante', escudo: '' };
                return {
                    ...p,
                    clube_casa: { nome: casa.nome, escudo: casa.escudo },
                    clube_visitante: { nome: visitante.nome, escudo: visitante.escudo },
                } as PartidaCartola;
            });

            partidas.value = enriquecidas.slice(0, 12);
        } catch (e) {
            console.error('Erro ao buscar partidas do Brasileirão:', e);
            error.value = 'Não foi possível carregar os próximos jogos.';
        } finally {
            loading.value = false;
        }
    }

    function formatarDataHora(isoLike: string): string {
        if (!isoLike) return '';
        const dt = new Date(isoLike.replace(' ', 'T'));
        if (isNaN(dt.getTime())) return '';
        // Formato simples: dd/MM HH:mm
        const dd = String(dt.getDate()).padStart(2, '0');
        const mm = String(dt.getMonth() + 1).padStart(2, '0');
        const hh = String(dt.getHours()).padStart(2, '0');
        const min = String(dt.getMinutes()).padStart(2, '0');
        return `${dd}/${mm} ${hh}:${min}`;
    }

    return { partidas, loading, error, fetchProximasPartidas, formatarDataHora, clubesMap };
}
