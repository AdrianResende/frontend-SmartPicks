<template>
  <q-page class="profile-page">
    <div class="profile-container">
      <q-card>
        <q-card flat square class="profile-header-card">
          <div
            class="profile-banner"
            :style="{ backgroundColor: randomColor, height: '200px', position: 'relative' }"
          >
            <div class="absolute-bottom-right q-pa-md">
              <q-btn
                dense
                flat
                rounded
                icon="photo_camera"
                color="white"
                size="sm"
                class="bg-black-4"
                @click="editBanner"
              >
                <q-tooltip>Alterar cor da capa</q-tooltip>
              </q-btn>
            </div>
          </div>

          <q-card-section class="profile-avatar-section">
            <div class="row items-end">
              <div class="col-auto">
                <UserAvatar :size="'132px'" :editable="false" class="profile-avatar-x" />
              </div>
              <div class="col"></div>
              <div class="col-auto q-gutter-sm row items-center">
                <q-btn
                  outline
                  rounded
                  color="grey-8"
                  icon="more_horiz"
                  dense
                  size="md"
                  padding="xs md"
                  style="border-width: 1.5px"
                >
                  <q-tooltip>Mais opções</q-tooltip>
                </q-btn>
                <q-btn
                  outline
                  rounded
                  color="grey-8"
                  icon="mail_outline"
                  dense
                  size="md"
                  padding="xs md"
                  style="border-width: 1.5px"
                >
                  <q-tooltip>Mensagem</q-tooltip>
                </q-btn>
                <q-btn
                  outline
                  rounded
                  color="grey-8"
                  icon="notifications_none"
                  dense
                  size="md"
                  padding="xs md"
                  style="border-width: 1.5px"
                >
                  <q-tooltip>Notificações</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="!isFollowing"
                  unelevated
                  rounded
                  color="grey-9"
                  text-color="white"
                  label="Seguir"
                  dense
                  size="md"
                  padding="xs xl"
                  no-caps
                  class="text-weight-bold follow-btn"
                  @click="toggleFollow"
                />
                <q-btn
                  v-else
                  outline
                  rounded
                  color="grey-8"
                  text-color="grey-9"
                  label="Seguindo"
                  dense
                  size="md"
                  padding="xs xl"
                  no-caps
                  class="text-weight-bold following-btn"
                  style="border-width: 1.5px"
                  @click="toggleFollow"
                  @mouseenter="hoverFollowing = true"
                  @mouseleave="hoverFollowing = false"
                >
                  <span v-if="!hoverFollowing">Seguindo</span>
                  <span v-else class="text-red">Deixar de seguir</span>
                </q-btn>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-sm q-pb-sm">
            <div class="profile-info-x">
              <div class="text-h5 text-weight-bold text-grey-10">
                {{ authStore.user?.nome || 'Adrian Silva' }}
              </div>
              <div class="text-body1 q-mt-sm text-grey-9" style="line-height: 1.5">
                Desenvolvedor Full Stack 💻 | Apaixonado por tecnologia e inovação 🚀 |
                Compartilhando conhecimento e experiências
              </div>
            </div>
          </q-card-section>

          <q-separator />
          <q-tabs
            v-model="activeTab"
            dense
            class="text-grey-7 profile-tabs"
            active-color="grey-10"
            indicator-color="primary"
            align="left"
            narrow-indicator
          >
            <q-tab
              name="palpites"
              label="Palpites"
              no-caps
              class="text-weight-medium tab-item"
              style="min-width: 100px"
            />
          </q-tabs>
        </q-card>

        <q-tab-panels v-model="activeTab" animated class="bg-transparent">
          <q-tab-panel name="ppalpites" class="q-pa-none">
            <q-list separator class="palpites-list">
              <q-item
                v-for="post in palpites"
                :key="post.id"
                class="q-pa-md post-item"
                clickable
                v-ripple
              >
                <q-item-section avatar top>
                  <UserAvatar :size="'48px'" />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="row items-center q-gutter-xs">
                    <span class="text-weight-bold text-grey-10 hover-underline cursor-pointer">{{
                      authStore.user?.nome || 'Adrian Silva'
                    }}</span>
                    <span class="text-grey-7">@adriansilva</span>
                    <span class="text-grey-7">·</span>
                    <span class="text-grey-7">{{ post.time }}</span>
                  </q-item-label>

                  <q-item-label class="q-mt-xs text-body1 text-grey-10" style="line-height: 1.5">
                    {{ post.content }}
                  </q-item-label>

                  <q-img
                    v-if="post.image"
                    :src="post.image"
                    class="q-mt-sm rounded-borders post-image"
                    style="max-height: 400px; border: 1px solid #eff3f4"
                    fit="cover"
                  />

                  <div class="row q-mt-sm post-actions">
                    <q-btn
                      flat
                      dense
                      round
                      icon="chat_bubble_outline"
                      color="grey-7"
                      size="sm"
                      class="action-btn"
                    >
                      <span class="q-ml-xs text-caption">{{ post.replies }}</span>
                    </q-btn>
                    <q-btn
                      flat
                      dense
                      round
                      icon="repeat"
                      color="grey-7"
                      size="sm"
                      class="action-btn action-retweet"
                    >
                      <span class="q-ml-xs text-caption">{{ post.retweets }}</span>
                    </q-btn>
                    <q-btn
                      flat
                      dense
                      round
                      icon="favorite_border"
                      color="grey-7"
                      size="sm"
                      class="action-btn action-like"
                    >
                      <span class="q-ml-xs text-caption">{{ post.likes }}</span>
                    </q-btn>
                    <q-btn
                      flat
                      dense
                      round
                      icon="bar_chart"
                      color="grey-7"
                      size="sm"
                      class="action-btn"
                    >
                      <span class="q-ml-xs text-caption">{{ post.views }}</span>
                    </q-btn>
                    <q-btn
                      flat
                      dense
                      round
                      icon="share"
                      color="grey-7"
                      size="sm"
                      class="action-btn action-share"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>

          <q-tab-panel name="replies" class="q-pa-none">
            <q-card flat square class="empty-state-card">
              <q-card-section class="text-center q-pa-xl">
                <q-icon name="chat_bubble_outline" size="80px" color="grey-5" />
                <div class="text-h6 text-grey-8 q-mt-md text-weight-bold">
                  Você ainda não tem respostas
                </div>
                <div class="text-body2 text-grey-6 q-mt-sm">
                  Quando você responder palpites, eles aparecerão aqui.
                </div>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <q-tab-panel name="media" class="q-pa-none">
            <q-card flat square class="empty-state-card">
              <q-card-section class="text-center q-pa-xl">
                <q-icon name="photo_library" size="80px" color="grey-5" />
                <div class="text-h6 text-grey-8 q-mt-md text-weight-bold">
                  Luzes, câmera... anexos!
                </div>
                <div class="text-body2 text-grey-6 q-mt-sm">
                  Quando você publicar fotos ou vídeos, eles aparecerão aqui.
                </div>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <q-tab-panel name="likes" class="q-pa-none">
            <q-card flat square class="empty-state-card">
              <q-card-section class="text-center q-pa-xl">
                <q-icon name="favorite_border" size="80px" color="grey-5" />
                <div class="text-h6 text-grey-8 q-mt-md text-weight-bold">
                  Você ainda não curtiu nenhum post
                </div>
                <div class="text-body2 text-grey-6 q-mt-sm">
                  Quando você curtir um post, ele aparecerá aqui.
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
  import { ref } from 'vue';
  import { useAuthStore } from 'src/stores/auth';
  import UserAvatar from 'src/components/UserAvatar.vue';

  const authStore = useAuthStore();
  const activeTab = ref('palpites');
  const isFollowing = ref(false);
  const hoverFollowing = ref(false);
  const backgroundImage = ref(
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1400&h=400&fit=crop'
  );

  const palpites = ref([
    {
      id: 1,
      content:
        'Acabei de lançar um novo projeto! Muito animado para compartilhar com vocês 🚀 #WebDev #VueJS',
      likes: 234,
      retweets: 45,
      replies: 12,
      views: 1523,
      time: '2h',
      image: null,
    },
    {
      id: 2,
      content:
        'A tecnologia está evoluindo cada vez mais rápido. É impressionante como as coisas mudaram nos últimos anos.',
      likes: 189,
      retweets: 32,
      replies: 8,
      views: 892,
      time: '5h',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop',
    },
    {
      id: 3,
      content: 'Café da manhã perfeito ☕️ Nada melhor para começar o dia com energia!',
      likes: 421,
      retweets: 67,
      replies: 23,
      views: 2145,
      time: '1d',
      image: null,
    },
  ]);

  const toggleFollow = () => {
    isFollowing.value = !isFollowing.value;
    hoverFollowing.value = false;
  };

  const editBanner = () => {
    console.log('Editar banner');
  };

  const randomColor = ref<string>('');

  function generateRandomColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
  }
</script>

<style scoped>
  .profile-page {
    background-color: #b9eaef;
  }

  .profile-container {
    max-width: 600px;
    margin: 0 auto;
    background-color: white;
  }

  .profile-header-card {
    border-bottom: 1px solid #eff3f4;
    background-color: white;
  }

  /* Banner */
  .profile-banner {
    border-bottom: 2px solid black !important;
    background-color: #cfd9de;
  }

  .profile-avatar-section {
    margin-top: -66px;
    padding-bottom: 12px;
  }

  .profile-avatar-x {
    border: 4px solid transparent !important;
    box-shadow: none !important;
  }

  .profile-avatar-x :deep(.q-avatar) {
    background-color: transparent !important;
  }
  .profile-info-x {
    padding-top: 4px;
  }

  /* Botões seguir/seguindo */
  .follow-btn {
    min-width: 100px;
  }

  .follow-btn:hover {
    background-color: #1a1a1a !important;
  }

  .following-btn {
    min-width: 100px;
  }

  .following-btn:hover {
    background-color: rgba(244, 33, 46, 0.1) !important;
    border-color: rgba(244, 33, 46, 0.4) !important;
  }

  /* Tabs */
  .profile-tabs {
    height: 53px;
  }

  .tab-item {
    font-size: 15px;
  }

  .tab-item:hover {
    background-color: rgba(15, 20, 25, 0.05);
  }

  /* palpites */
  .palpites-list {
    border: none;
  }

  .post-item {
    background-color: white;
    transition: background-color 0.2s;
    border-bottom: 1px solid #eff3f4;
  }

  .post-item:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }

  .post-image {
    cursor: pointer;
    border-radius: 16px;
    overflow: hidden;
  }

  /* Ações do post */
  .post-actions {
    display: flex;
    justify-content: space-between;
    max-width: 425px;
    margin-top: 12px;
  }

  .action-btn {
    transition: all 0.2s;
  }

  .action-btn:hover {
    background-color: rgba(29, 155, 240, 0.1);
    color: rgb(29, 155, 240);
  }

  .action-retweet:hover {
    background-color: rgba(0, 186, 124, 0.1);
    color: rgb(0, 186, 124);
  }

  .action-like:hover {
    background-color: rgba(249, 24, 128, 0.1);
    color: rgb(249, 24, 128);
  }

  .action-share:hover {
    background-color: rgba(29, 155, 240, 0.1);
    color: rgb(29, 155, 240);
  }

  /* Estado vazio */
  .empty-state-card {
    border: none;
    border-bottom: 1px solid #eff3f4;
  }

  /* Links e hover */
  .hover-underline:hover {
    text-decoration: underline;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  /* Responsividade Desktop */
  @media (min-width: 1024px) {
    .profile-container {
      width: 92%;
      max-width: 1300px;
    }
  }

  /* Responsividade Mobile */
  @media (max-width: 599px) {
    .profile-container {
      width: 100%;
      padding: 0 8px;
    }

    .profile-banner-wrapper {
      height: 200px;
    }

    .profile-banner {
      height: 200px !important;
    }

    .profile-avatar-wrapper {
      margin-top: -50px;
    }

    .profile-avatar-x {
      border-width: 3px;
    }

    .post-actions {
      max-width: 100%;
    }
  }
</style>
