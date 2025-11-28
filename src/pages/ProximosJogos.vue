<template>
  <q-page class="q-pa-md" style="background-color: #ffffff; min-height: 100vh">
    <div class="row justify-center">
      <div class="col-12 col-md-11">
        <div
          class="text-h5 text-center text-primary text-weight-bold q-mb-lg row items-center justify-center q-gutter-sm"
        >
          <img
            src="/icons/brasileirao.png"
            alt="Brasileirão Logo"
            style="height: 48px; width: auto"
          />
          <span>Brasileirão Série A</span>
        </div>

        <div v-if="!loading" class="row q-col-gutter-md">
          <div v-for="p in partidas" :key="p.partida_id" class="col-12 col-sm-6 col-md-4 col-lg-3">
            <q-card
              class="shadow-4 match-card"
              style="border-radius: 14px; border: 1px solid #808080"
            >
              <q-card-section class="q-pa-sm">
                <div class="row items-center justify-between">
                  <div class="text-center">
                    <q-avatar size="32px" class="avatar-logo bg-white shadow-2">
                      <img :src="p.clube_casa?.escudo || ''" />
                    </q-avatar>
                    <div class="text-caption text-weight-bold">
                      {{ p.clube_casa?.nome }}
                    </div>
                  </div>

                  <div class="text-center text-bold">VS</div>

                  <div class="text-center">
                    <q-avatar size="32px" class="avatar-logo bg-white shadow-2">
                      <img :src="p.clube_visitante?.escudo || ''" />
                    </q-avatar>
                    <div class="text-caption text-weight-bold">
                      {{ p.clube_visitante?.nome }}
                    </div>
                  </div>
                </div>

                <div class="q-mt-sm text-center">
                  <q-icon name="event" color="primary" size="18px" />
                  <span class="text-caption">{{ formatarDataHora(p.partida_data) }}</span>
                </div>

                <div class="text-center">
                  <q-icon name="place" color="primary" size="18px" />
                  <span class="text-caption">{{ p.local }}</span>
                </div>
                <div
                  v-if="formatOdds(p.clube_casa?.nome ?? '', p.clube_visitante?.nome ?? '')"
                  class="q-mt-sm"
                >
                  <q-badge color="blue-3" text-color="primary" class="full-width q-pa-xs">
                    {{ formatOdds(p.clube_casa?.nome ?? '', p.clube_visitante?.nome ?? '') }}
                  </q-badge>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div
          class="text-h5 q-mt-md text-center text-primary text-weight-bold q-mb-lg row items-center justify-center q-gutter-sm"
        >
          <img
            src="/icons/champions.png"
            alt="Champions League Logo"
            style="height: 48px; width: auto"
          />
          <span>Champions League</span>
        </div>

        <q-banner rounded class="bg-white text-indigo-10 shadow-3 q-pa-md">
          <div class="row items-center">
            <q-icon name="construction" size="30px" class="q-mr-md text-indigo-8" />
            <div class="text-body1">
              🚧 API da Champions League está em desenvolvimento. Logo você poderá ver partidas,
              estatísticas e odds aqui!
            </div>
          </div>
        </q-banner>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useBrasileirao } from 'src/composables/useBrasileirao';
  import { useOdds } from 'src/composables/useOdds';

  const { partidas, loading, error, fetchProximasPartidas, formatarDataHora } = useBrasileirao();
  const { fetchOddsBrazil, getMatchOdds, error: oddsError } = useOdds();

  function reload() {
    void fetchProximasPartidas();
    void fetchOddsBrazil();
  }

  function formatOdds(home: string, away: string): string | null {
    const ev = getMatchOdds(home, away);
    if (!ev) return null;
    const partes: string[] = [];
    const oddsHome = (ev as any).odds_home ?? (ev as any).oddsHome;
    const oddsAway = (ev as any).odds_away ?? (ev as any).oddsAway;
    const oddsDraw = (ev as any).odds_draw ?? (ev as any).draw;
    if (typeof oddsHome === 'number') partes.push(`Casa ${oddsHome.toFixed(2)}`);
    if (typeof oddsDraw === 'number') partes.push(`Empate ${oddsDraw.toFixed(2)}`);
    if (typeof oddsAway === 'number') partes.push(`Fora ${oddsAway.toFixed(2)}`);
    const book =
      (ev as any).bookmaker || (ev as any).book
        ? ` (${(ev as any).bookmaker || (ev as any).book})`
        : '';
    return partes.length ? `Odds: ${partes.join(' | ')}${book}` : null;
  }

  onMounted(() => {
    void fetchProximasPartidas();
    void fetchOddsBrazil();
  });
</script>

<style scoped>
  .match-card {
    transition: 0.3s ease;
    padding: 1rem;
  }

  .avatar-logo img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
</style>
