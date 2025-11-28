import { ref } from 'vue';
import axios from 'axios';

export interface OddsEvent {
  id: string;
  home_team: string;
  away_team: string;
  book: string;
  odds_home?: number;
  odds_away?: number;
  draw?: number;
}

function normalizeName(name: string): string {
  return (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function useOdds() {
  const loading = ref(false);
  const error = ref('');
  const events = ref<OddsEvent[]>([]);

  async function fetchOddsBrazil() {
    loading.value = true;
    error.value = '';
    try {
      const url = 'https://sportsbook-api2.p.rapidapi.com/api/Fixtures/GetFixtureOdds';

      const { data } = await axios.get(url, {
        params: {
          fixtureId: 'latest',
          page: '1'
        },
        headers: {
          'X-RapidAPI-Key': '9e0318beb4msh54e542475b62672p14baf3jsnac54414545ff',
          'X-RapidAPI-Host': 'sportsbook-api2.p.rapidapi.com'
        },
      });

      const out: OddsEvent[] = [];

      if (data && data.data) {
        const fixtures = Array.isArray(data.data) ? data.data : [data.data];

        for (const fixture of fixtures) {
          const home = fixture.homeTeam?.name || fixture.home_team;
          const away = fixture.awayTeam?.name || fixture.away_team;
          const odds = fixture.odds || fixture.bookmakers?.[0]?.markets?.[0]?.odds || {};

          out.push({
            id: fixture.id || fixture.fixtureId || String(Math.random()),
            home_team: home,
            away_team: away,
            book: fixture.bookmaker || 'RapidAPI',
            odds_home: odds.home || odds['1'] || undefined,
            draw: odds.draw || odds['X'] || undefined,
            odds_away: odds.away || odds['2'] || undefined,
          });
        }
      }

      events.value = out;
    } catch (e) {
      console.error('Erro ao buscar odds:', e);
      error.value = 'Não foi possível carregar odds agora.';
    } finally {
      loading.value = false;
    }
  }

  function getMatchOdds(homeName: string, awayName: string) {
    const hNorm = normalizeName(homeName);
    const aNorm = normalizeName(awayName);
    return events.value.find(
      (ev) => normalizeName(ev.home_team) === hNorm && normalizeName(ev.away_team) === aNorm,
    );
  }

  return { loading, error, events, fetchOddsBrazil, getMatchOdds };
}
