<template>
  <q-page class="profile-page">
    <div class="profile-container">
      <q-card flat bordered class="profile-card q-mt-lg q-mb-md">
        <div class="profile-banner" :style="{ backgroundColor: randomColor }"></div>

        <div class="profile-content q-pa-md">
          <div class="profile-header-section">
            <div class="avatar-actions-row">
              <div>
                <UserAvatar :size="'132px'" :editable="false" class="profile-avatar" />
              </div>
              <div class="action-buttons">
                <q-btn
                  v-if="!isOwnProfile && !isFollowing"
                  unelevated
                  rounded
                  color="teal"
                  text-color="white"
                  label="Seguir"
                  size="md"
                  padding="sm xl"
                  no-caps
                  class="text-weight-bold follow-btn"
                  @click="toggleFollow"
                />
                <q-btn
                  v-else-if="!isOwnProfile"
                  outline
                  rounded
                  color="grey-8"
                  text-color="grey-9"
                  :label="hoverFollowing ? 'Deixar de seguir' : 'Seguindo'"
                  size="md"
                  padding="sm xl"
                  no-caps
                  class="text-weight-bold following-btn"
                  @click="toggleFollow"
                  @mouseenter="hoverFollowing = true"
                  @mouseleave="hoverFollowing = false"
                />
                <q-btn
                  v-if="!isOwnProfile"
                  outline
                  rounded
                  color="grey-8"
                  label="Mensagem"
                  size="md"
                  padding="sm md"
                  no-caps
                />
              </div>
            </div>

            <div class="profile-info">
              <div class="row items-center q-gutter-sm q-mb-sm">
                <div class="text-h5 text-weight-bold text-grey-10">
                  {{ profileUser?.nome || 'Gustavo' }}
                </div>
                <q-badge
                  color="warning"
                  text-color="grey-10"
                  label="#3 no Ranking"
                  class="text-weight-bold ranking-badge"
                />
              </div>

              <div class="stats-row q-mb-md">
                <div class="stat-item">
                  <div class="text-h6 text-weight-bold text-grey-10">79.5%</div>
                  <div class="text-caption text-grey-7">Precisão</div>
                </div>
                <div class="stat-item">
                  <div class="text-h6 text-weight-bold text-grey-10">5.1k</div>
                  <div class="text-caption text-grey-7">Seguidores</div>
                </div>
                <div class="stat-item">
                  <div class="text-h6 text-weight-bold text-grey-10">200</div>
                  <div class="text-caption text-grey-7">Seguindo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card>
      <q-card flat bordered class="tabs-card q-mb-lg">
        <q-tabs
          v-model="activeTab"
          dense
          class="text-grey-7 profile-tabs"
          active-color="grey-10"
          indicator-color="primary"
          align="left"
          narrow-indicator
        >
          <q-tab name="palpites" label="Palpites" no-caps class="text-weight-medium tab-item" />
          <q-tab
            name="estatisticas"
            label="Estatísticas"
            no-caps
            class="text-weight-medium tab-item"
          />
          <q-tab name="seguidores" label="Seguidores" no-caps class="text-weight-medium tab-item" />
          <q-tab name="seguindo" label="Seguindo" no-caps class="text-weight-medium tab-item" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="activeTab" animated class="bg-transparent">
          <q-tab-panel name="palpites" class="q-pa-none">
            <div class="content-layout">
              <q-card flat bordered class="statistics-card">
                <q-card-section>
                  <div class="text-h6 text-weight-bold q-mb-md">Estatísticas</div>
                  <div class="q-gutter-sm">
                    <div class="stat-row">
                      <span class="text-grey-8">Total de Palpites:</span>
                      <span class="text-weight-bold">{{ totalPalpites }}</span>
                    </div>
                    <div class="stat-row">
                      <span class="text-grey-8">Palpites Vencidos:</span>
                      <span class="text-weight-bold text-green">248</span>
                    </div>
                    <div class="stat-row">
                      <span class="text-grey-8">Palpites Perdidos:</span>
                      <span class="text-weight-bold text-red">64</span>
                    </div>
                    <div class="stat-row">
                      <span class="text-grey-8">ROI (Retorno):</span>
                      <span class="text-weight-bold text-green">+25.8%</span>
                    </div>
                    <div class="stat-row">
                      <span class="text-grey-8">Média de Odd:</span>
                      <span class="text-weight-bold">1.85</span>
                    </div>
                    <div class="stat-row">
                      <span class="text-grey-8">Membro desde:</span>
                      <span class="text-weight-bold">15/09/2025</span>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <div class="palpites-section">
                <q-card v-if="loading" flat bordered class="q-pa-xl text-center">
                  <q-spinner color="primary" size="50px" />
                  <div class="text-grey-7 q-mt-md">Carregando palpites...</div>
                </q-card>

                <q-card v-else-if="palpites.length === 0" flat bordered class="empty-state-card">
                  <q-card-section class="text-center q-pa-xl">
                    <q-icon name="dashboard" size="80px" color="grey-5" />
                    <div class="text-h6 text-grey-8 q-mt-md text-weight-bold">
                      Nenhum palpite ainda
                    </div>
                    <div class="text-body2 text-grey-6 q-mt-sm">
                      Quando houver palpites, eles aparecerão aqui.
                    </div>
                  </q-card-section>
                </q-card>

                <q-card
                  v-for="palpite in palpites"
                  :key="palpite.id"
                  flat
                  bordered
                  class="palpite-card q-mb-md"
                >
                  <q-card-section class="q-pa-md">
                    <div class="row items-center q-mb-sm">
                      <UserAvatar
                        :size="'40px'"
                        :editable="false"
                        :userId="palpite.user?.id || profileUser?.id || 0"
                      />
                      <div class="q-ml-sm">
                        <div
                          class="text-weight-bold text-grey-10 cursor-pointer"
                          @click="goToUserProfile(palpite.user?.id || profileUser?.id)"
                        >
                          {{ palpite.user?.nome || profileUser?.nome || 'Gustavo' }}
                        </div>
                        <div class="text-caption text-grey-7">
                          {{ new Date(palpite.createdAt).toLocaleDateString('pt-BR') }}
                        </div>
                      </div>
                    </div>

                    <div v-if="palpite.titulo" class="text-body1 text-grey-10 q-mb-sm">
                      {{ palpite.titulo }}
                    </div>

                    <q-img
                      v-if="palpite.imagem"
                      :src="palpite.imagem"
                      class="rounded-borders palpite-image"
                      fit="cover"
                    />
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="estatisticas" class="q-pa-md">
            <q-card flat bordered class="statistics-card">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-md">Estatísticas Detalhadas</div>
                <div class="text-grey-7 text-center q-pa-xl">
                  Estatísticas detalhadas em breve...
                </div>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <q-tab-panel name="seguidores" class="q-pa-none">
            <q-card flat bordered class="empty-state-card">
              <q-card-section class="text-center q-pa-xl">
                <q-icon name="people_outline" size="80px" color="grey-5" />
                <div class="text-h6 text-grey-8 q-mt-md text-weight-bold">
                  Nenhum seguidor ainda
                </div>
                <div class="text-body2 text-grey-6 q-mt-sm">
                  Quando alguém começar a te seguir, aparecerá aqui.
                </div>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <q-tab-panel name="seguindo" class="q-pa-none">
            <q-card flat bordered class="empty-state-card">
              <q-card-section class="text-center q-pa-xl">
                <q-icon name="person_add" size="80px" color="grey-5" />
                <div class="text-h6 text-grey-8 q-mt-md text-weight-bold">
                  Não está seguindo ninguém ainda
                </div>
                <div class="text-body2 text-grey-6 q-mt-sm">
                  Quando começar a seguir alguém, aparecerá aqui.
                </div>
              </q-card-section>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  defineOptions({ name: 'PerfilPage' });
  import { ref, onMounted, computed, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAuthStore } from 'src/stores/auth';
  import { useApi } from 'src/composables/useApi';
  import UserAvatar from 'src/components/UserAvatar.vue';
  import type { Palpite, User } from 'src/types';

  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  const { get } = useApi();

  const activeTab = ref('palpites');
  const isFollowing = ref(false);
  const hoverFollowing = ref(false);
  const randomColor = ref<string>('');
  const profileUser = ref<User | null>(null);
  interface DisplayPalpite extends Omit<Palpite, 'user'> {
    user?: { id: number; nome: string; avatar?: string };
    total_likes?: number;
    total_dislikes?: number;
    total_comentarios?: number;
  }
  const palpites = ref<DisplayPalpite[]>([]);
  const loading = ref(false);
  const totalPalpites = ref<number>(0);

  const isOwnProfile = computed(() => {
    const profileId = route.params.id;
    if (!profileId) return true;
    return Number(profileId) === authStore.user?.id;
  });

  function generateRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 70%)`;
  }

  const toggleFollow = () => {
    isFollowing.value = !isFollowing.value;
    hoverFollowing.value = false;
  };

  const goToUserProfile = async (userId?: number | null) => {
    if (!userId) return;
    await router.push({ name: 'perfil', params: { id: userId } });
  };

  async function fetchUserProfile() {
    const userId = route.params.id;
    if (!userId) {
      profileUser.value = authStore.user;
      return;
    }

    try {
      const userIdStr = Array.isArray(userId) ? userId[0] : userId;
      const response = await get<User>(`/users/${userIdStr}`);
      if (response.success && response.data) {
        profileUser.value = response.data;
      }
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      profileUser.value = authStore.user;
    }
  }

  type ApiPalpite = {
    id: number;
    user_id: number;
    user_name?: string;
    titulo?: string;
    img_url?: string;
    link?: string;
    created_at: string;
    updated_at?: string;
    avatar?: string;
    total_likes?: number;
    total_dislikes?: number;
    total_comentarios?: number;
  };

  interface ApiPalpitesResponse {
    palpites: ApiPalpite[];
    total: number;
    user_id: number;
  }

  async function fetchPalpites() {
    loading.value = true;
    try {
      const userId = route.params.id || authStore.user?.id;
      if (!userId) return;

      const userIdStr = Array.isArray(userId) ? userId[0] : String(userId);
      const response = await get<ApiPalpitesResponse>(`/users/${userIdStr}/palpites`);
      if (response.success && response.data) {
        const apiData = response.data;
        totalPalpites.value = apiData.total ?? apiData.palpites?.length ?? 0;

        const nome = profileUser.value?.nome;
        const userIdNum = profileUser.value?.id ?? Number(userIdStr);
        const avatarDefault = profileUser.value?.avatar;

        palpites.value = (apiData.palpites || []).map((p: ApiPalpite & { user_name?: string }) => {
          const avatarUrl = p.avatar || avatarDefault;
          const userName = p.user_name || nome || 'Usuário';
          const userVal: { id: number; nome: string; avatar?: string } = {
            id: p.user_id ?? userIdNum,
            nome: String(userName),
          };
          if (avatarUrl) userVal.avatar = avatarUrl;

          const base: DisplayPalpite = {
            id: p.id,
            imagem: p.img_url || '',
            user: userVal,
            userId: p.user_id,
            createdAt: p.created_at,
          };
          if (p.updated_at) base.updatedAt = p.updated_at;
          if (p.titulo) base.titulo = p.titulo;
          if (typeof p.total_likes === 'number') base.total_likes = p.total_likes;
          if (typeof p.total_dislikes === 'number') base.total_dislikes = p.total_dislikes;
          if (typeof p.total_comentarios === 'number') base.total_comentarios = p.total_comentarios;
          return base;
        });
      } else {
        totalPalpites.value = 0;
        palpites.value = [];
      }
    } catch (error) {
      console.error('Erro ao buscar palpites:', error);
      totalPalpites.value = 0;
    } finally {
      loading.value = false;
    }
  }

  onMounted(async () => {
    randomColor.value = generateRandomColor();
    await fetchUserProfile();
    await fetchPalpites();
  });

  watch(
    () => route.params.id,
    async () => {
      await fetchUserProfile();
      await fetchPalpites();
    }
  );
</script>
<style scoped>
  .profile-page {
    background-color: #b9eaef;
    min-height: 100vh;
    padding: 16px;
  }

  .profile-container {
    max-width: 1200px;
    margin: 0 auto;
    background: transparent;
  }

  .profile-card,
  .tabs-card {
    border-radius: 16px;
    overflow: hidden;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .profile-card {
    margin-top: 24px;
    margin-bottom: 24px;
  }

  .tabs-card {
    margin-bottom: 40px;
  }

  .profile-banner {
    height: 200px;
    position: relative;
    border-bottom: 1px solid #eff3f4;
  }

  .banner-overlay {
    position: absolute;
    top: 12px;
    left: 12px;
  }

  .profile-content {
    background-color: transparent;
    padding: 0 16px 16px;
  }

  .profile-header-section {
    padding: 0 8px;
  }
  .avatar-actions-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: -66px;
    margin-bottom: 16px;
    background-color: transparent;
  }

  .profile-avatar {
    border: 4px solid transparent !important;
    background-color: transparent !important;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
  }

  .follow-btn {
    background-color: #009688 !important;
  }

  .follow-btn:hover {
    background-color: #00796b !important;
  }

  .following-btn:hover {
    background-color: rgba(244, 33, 46, 0.1) !important;
    border-color: rgba(244, 33, 46, 0.4) !important;
    color: #f4212e !important;
  }

  .profile-info {
    padding-bottom: 16px;
  }

  .ranking-badge {
    padding: 4px 12px;
    font-size: 12px;
  }

  .stats-row {
    display: flex;
    gap: 32px;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .profile-tabs {
    border-bottom: 1px solid #eff3f4;
    height: 53px;
    background-color: white;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }

  .tab-item {
    font-size: 15px;
    min-width: 100px;
  }

  .tab-item:hover {
    background-color: rgba(15, 20, 25, 0.05);
  }

  .content-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 16px;
    padding: 16px;
  }

  .statistics-card {
    border-radius: 12px;
    height: fit-content;
    position: sticky;
    top: 16px;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #eff3f4;
  }

  .stat-row:last-child {
    border-bottom: none;
  }

  .palpites-section {
    display: flex;
    flex-direction: column;
  }

  .palpite-card {
    border-radius: 12px;
    transition: box-shadow 0.2s;
  }

  .palpite-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .palpite-image {
    border-radius: 12px;
    max-height: 400px;
    border: 1px solid #eff3f4;
  }

  .empty-state-card {
    border-radius: 12px;
  }

  @media (max-width: 768px) {
    .content-layout {
      grid-template-columns: 1fr;
    }

    .statistics-card {
      position: static;
    }

    .avatar-actions-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .action-buttons {
      width: 100%;
      justify-content: flex-end;
    }

    .stats-row {
      flex-wrap: wrap;
      gap: 16px;
    }

    .profile-banner {
      height: 150px;
    }

    .profile-card,
    .tabs-card {
      border-radius: 12px;
    }
  }

  @media (max-width: 599px) {
    .profile-container {
      width: 100%;
    }

    .content-layout {
      padding: 8px;
      gap: 12px;
    }

    .stat-item .text-h6 {
      font-size: 1.2rem;
    }
  }
</style>
