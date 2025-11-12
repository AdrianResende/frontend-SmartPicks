<template>
  <q-page class="q-pa-md flex full-height full-width text-white" style="background-color: #b9eaef">
    <div class="row justify-center full-width" style="max-width: 1200px; width: 100%">
      <div class="col-12 col-md-3 q-pr-md q-mb-md">
        <q-card class="q-pa-md text-center shadow-2 bg-white text-dark sidebar-card">
          <div class="text-h6 text-weight-bold q-mb-sm">Seu Perfil</div>
          <UserAvatar :size="'96px'" :editable="true" class="q-mb-sm" @click.stop />
          <div class="text-body1 q-mb-xs cursor-pointer" @click="goToProfile">
            {{ authStore.user?.nome || 'Usuário' }}
          </div>
          <div class="text-grey-7 text-caption">2 Apostas • 90% Precisão</div>
          <q-btn
            flat
            dense
            color="primary"
            label="Ver Perfil"
            class="q-mt-sm"
            @click="goToProfile"
          />
        </q-card>
        <q-card class="q-pa-md q-mt-md shadow-2 bg-white text-dark sidebar-card">
          <div class="text-h6 q-mb-sm align-center justify-center flex">🏆 Top Apostadores</div>
          <q-separator spaced />
          <q-list dense>
            <q-item v-for="(bettor, idx) in topBettors" :key="bettor.user">
              <q-item-section>
                <q-avatar size="32px" class="q-mr-sm rounded-circle overflow-hidden">
                  <img v-if="idx === 0" src="/icons/coroaOuro.png" alt="Coroa Ouro" />
                  <img v-else-if="idx === 1" src="/icons/coroaPrata.png" alt="Coroa Prata" />
                  <img v-else src="/icons/coroaBronze.png" alt="Coroa Cinza" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <div class="text-subtitle2">{{ bettor.user }}</div>
              </q-item-section>
              <q-item-section side>
                <div class="text-grey">{{ bettor.precision }}</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card
          v-for="palpite in palpites"
          :key="palpite.id"
          class="q-pa-md q-mb-md shadow-2 rounded-xl hover-border bg-white text-dark"
        >
          <div class="row items-center no-wrap q-mb-sm">
            <UserAvatar
              :size="'56px'"
              :editable="false"
              :userId="palpite.user_id"
              class="q-mr-sm"
            />
            <div>
              <div
                class="text-weight-medium cursor-pointer"
                @click="goToUserProfile(palpite.user_id)"
              >
                {{ palpite.user_name }}
              </div>
              <div class="text-grey-7 text-caption">{{ tempoDecorrido(palpite.created_at) }}</div>
            </div>
          </div>

          <div class="text-body1 q-mb-sm">
            {{ palpite.text }}
          </div>
          <div class="image-container">
            <q-img
              :src="palpite.img_url"
              class="post-image"
              spinner-color="primary"
              fit="contain"
              @error="onImageError"
              loading="lazy"
              crossorigin="anonymous"
            />
          </div>

          <div class="row items-center justify-end q-pl-xl q-gutter-xs">
            <div class="actions-section row q-gutter-sm items-center">
              <ReactionButtons
                :total-likes="palpite.total_likes || 0"
                :total-dislikes="palpite.total_dislikes || 0"
                :user-reaction="palpite.user_reaction"
                :loading="reactingPalpiteId === palpite.id"
                @react="tipo => handleReaction(palpite.id, tipo)"
              />

              <div class="comment-action">
                <q-btn
                  flat
                  round
                  dense
                  icon="comment"
                  color="grey-7"
                  size="md"
                  class="action-btn"
                  @click="openCommentsDialog(palpite)"
                >
                  <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 8]">
                    Comentários
                  </q-tooltip>
                </q-btn>
                <span class="action-count">{{ palpite.total_comentarios || 0 }}</span>
              </div>

              <q-btn flat round dense icon="share" color="grey-7" size="md" class="action-btn">
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 8]">
                  Compartilhar
                </q-tooltip>
              </q-btn>

              <q-btn
                flat
                round
                dense
                icon="content_copy"
                :color="palpite.link ? 'primary' : 'grey-7'"
                :disable="!palpite.link"
                size="md"
                class="action-btn"
                @click="copiarLink(palpite)"
              >
                <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 8]">
                  {{ palpite.link ? 'Copiar Link' : 'Link não disponível' }}
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-card>

        <q-dialog v-model="showCommentsDialog" position="bottom">
          <q-card style="width: 100%; max-width: 600px">
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">Comentários</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-separator />

            <q-card-section style="max-height: 400px; overflow-y: auto">
              <div
                v-if="selectedPalpite?.comments && selectedPalpite.comments.length"
                class="q-gutter-sm"
              >
                <div
                  v-for="comment in selectedPalpite.comments"
                  :key="comment.id"
                  class="comment-item q-pa-sm bg-grey-1 rounded-borders"
                >
                  <div class="row items-center q-mb-xs">
                    <q-avatar size="32px" class="q-mr-sm">
                      <img
                        :src="
                          comment.autor_avatar || 'https://i.pravatar.cc/150?u=' + comment.user_id
                        "
                        style="object-fit: cover"
                      />
                    </q-avatar>
                    <div class="text-weight-bold text-primary">
                      {{ comment.autor_nome || 'Usuário' }}
                    </div>
                  </div>
                  <div class="q-mt-xs q-ml-md">{{ comment.texto }}</div>
                  <div
                    class="row items-center q-mt-sm q-ml-md"
                    v-if="comment.total_likes || comment.total_dislikes"
                  >
                    <span class="text-caption text-grey-7">
                      <q-icon name="thumb_up" size="14px" /> {{ comment.total_likes || 0 }}
                      <q-icon name="thumb_down" size="14px" class="q-ml-sm" />
                      {{ comment.total_dislikes || 0 }}
                    </span>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-grey-6 q-pa-md">
                Nenhum comentário ainda. Seja o primeiro!
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section v-if="selectedPalpite" class="q-pt-sm">
              <q-input
                dense
                v-model="selectedPalpite.newComment"
                placeholder="Escreva um comentário..."
                @keyup.enter="addComment"
                outlined
                autofocus
              >
                <template v-slot:append>
                  <q-btn flat round dense icon="send" color="primary" @click="addComment" />
                </template>
              </q-input>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from 'src/stores/auth';
  import { toast } from 'vue3-toastify';
  import UserAvatar from 'src/components/UserAvatar.vue';
  import ReactionButtons from 'src/components/ReactionButtons.vue';
  import { useEventBus } from 'src/composables/useEventBus';
  import { useReactions } from 'src/composables/useReactions';
  import type { ReactionType, Comentario } from 'src/types';

  interface Palpite {
    id: number;
    user_id: number;
    user_name: string;
    user?: string;
    avatar: string;
    titulo: string;
    text: string;
    img_url: string;
    link?: string;
    created_at: string;
    comments: Comentario[];
    comentarios?: Comentario[];
    newComment: string;
    total_likes?: number;
    total_dislikes?: number;
    total_comentarios?: number;
    user_reaction?: ReactionType | null;
  }

  interface Response {
    palpites: Palpite[];
  }

  const { on, off } = useEventBus();
  const { toggleLike, toggleDislike } = useReactions();
  const router = useRouter();
  const authStore = useAuthStore();
  const showCommentsDialog = ref(false);
  const selectedPalpite = ref<Palpite | null>(null);
  const reactingPalpiteId = ref<number | null>(null);

  const palpites = ref<Palpite[]>([]);

  const goToProfile = async () => {
    await router.push('/perfil');
  };

  const goToUserProfile = async (userId: number) => {
    await router.push({ name: 'perfil', params: { id: userId } });
  };

  async function openCommentsDialog(palpite: Palpite) {
    selectedPalpite.value = palpite;

    try {
      const [stats, listaComentarios] = await Promise.all([
        authStore.getPalpiteStats(palpite.id),
        authStore.getComentarios(palpite.id),
      ]);
      if (stats) {
        palpite.total_likes = stats.total_likes ?? 0;
        palpite.total_dislikes = stats.total_dislikes ?? 0;
        palpite.total_comentarios = stats.total_comentarios ?? 0;
        palpite.user_reaction = stats.user_reaction ?? null;
      }
      if (listaComentarios) {
        palpite.comments = listaComentarios;
      }

      showCommentsDialog.value = true;
    } catch (e) {
      console.error('Erro ao buscar dados do palpite', e);
      toast.error('Não foi possível carregar os comentários.');
      selectedPalpite.value = null;
    }
  }

  const handleReaction = async (palpiteId: number, tipo: ReactionType) => {
    reactingPalpiteId.value = palpiteId;

    try {
      const response =
        tipo === 'like' ? await toggleLike(palpiteId) : await toggleDislike(palpiteId);

      if (response) {
        const palpite = palpites.value.find(p => p.id === palpiteId);
        if (palpite) {
          palpite.total_likes = response.total_likes;
          palpite.total_dislikes = response.total_dislikes;

          if (response.action === 'removed') {
            palpite.user_reaction = null;
          } else {
            palpite.user_reaction = tipo;
          }
        }
      }
    } finally {
      reactingPalpiteId.value = null;
    }
  };
  async function carregarPalpites() {
    try {
      const response: Response = await authStore.getPalpites();
      const list = Array.isArray(response?.palpites) ? response.palpites : [];

      const palpitesBase = list.map((p: Palpite) => ({
        id: p.id,
        user_id: p.user_id,
        user_name: p.user_name ?? 'Usuário',
        user: p.user_name ?? p.user ?? 'Usuário',
        avatar: p.avatar ?? 'https://i.pravatar.cc/150?u=' + p.user_id,
        titulo: p.titulo ?? '',
        text: p.text ?? p.titulo ?? '',
        img_url: p.img_url?.startsWith('http')
          ? p.img_url
          : `${import.meta.env.VITE_API_BASE_URL || ''}${p.img_url}`,
        link: p.link ?? '',
        created_at: p.created_at ?? '',
        comments: [],
        newComment: '',
        total_likes: 0,
        total_dislikes: 0,
        total_comentarios: 0,
        user_reaction: null,
      }));

      palpites.value = palpitesBase;

      for (const palpite of palpites.value) {
        await atualizarStatsPalpite(palpite.id);
      }

      console.log('✅ Palpites carregados e stats atualizados:', palpites.value);
    } catch (e) {
      console.error('❌ Erro ao carregar palpites:', e);
      toast.error('Erro ao carregar palpites.');
    }
  }

  async function atualizarStatsPalpite(palpiteId: number) {
    try {
      const stats = await authStore.getPalpiteStats(palpiteId);
      const palpite = palpites.value.find(p => p.id === palpiteId);

      if (palpite && stats) {
        palpite.total_likes = stats.total_likes ?? 0;
        palpite.total_dislikes = stats.total_dislikes ?? 0;
        palpite.total_comentarios = stats.total_comentarios ?? 0;
        palpite.user_reaction = stats.user_reaction ?? null;
      }
    } catch (e) {
      console.error('Erro ao atualizar estatísticas do palpite', e);
    }
  }

  const recarregarPalpitesListener = () => {
    void carregarPalpites().then(() => {
      toast.success('Palpite criado com sucesso!');
    });
  };

  function tempoDecorrido(timestamp: string): string {
    const agora = new Date();

    let dataPost: Date;

    if (timestamp.includes('+')) {
      const timestampFormatado = timestamp.replace(' ', 'T');
      dataPost = new Date(timestampFormatado);
    } else {
      const timestampLimpo =
        timestamp.split('.')[0] + '.' + (timestamp.split('.')[1]?.substring(0, 3) || '000');
      const timestampFormatado = timestampLimpo.replace(' ', 'T');
      dataPost = new Date(timestampFormatado);
    }
    if (isNaN(dataPost.getTime())) {
      return 'Data inválida';
    }

    const diffMs = agora.getTime() - dataPost.getTime();

    if (diffMs < 0) {
      return 'agora mesmo';
    }

    const diffSeg = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSeg / 60);
    const diffHoras = Math.floor(diffMin / 60);
    const diffDias = Math.floor(diffHoras / 24);
    const diffMeses = Math.floor(diffDias / 30);
    const diffAnos = Math.floor(diffMeses / 12);

    if (diffSeg < 60) return 'agora mesmo';
    if (diffMin < 60) return `há ${diffMin} min`;
    if (diffHoras < 24) return `há ${diffHoras}h`;
    if (diffDias < 30) return `há ${diffDias}d`;
    if (diffMeses < 12) return `há ${diffMeses} ${diffMeses > 1 ? 'meses' : 'mês'}`;
    return `há ${diffAnos} ${diffAnos > 1 ? 'anos' : 'ano'}`;
  }

  async function addComment() {
    if (!selectedPalpite.value) return;

    const palpite = selectedPalpite.value;
    if (palpite.newComment && palpite.newComment.trim().length > 0) {
      try {
        const novoComentario = await authStore.createComentario(palpite.id, palpite.newComment);
        await atualizarStatsPalpite(palpite.id);
        palpite.comments.push({
          id: novoComentario?.id || Date.now(),
          palpite_id: palpite.id,
          user_id: authStore.user?.id || 0,
          texto: palpite.newComment,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          total_likes: 0,
          total_dislikes: 0,
          autor_nome: authStore.user?.nome || 'Você',
          autor_avatar: authStore.user?.avatar || '',
          user_reaction: null,
        });

        palpite.newComment = '';
        toast.success('Comentário adicionado!');
      } catch (error) {
        console.error('Erro ao adicionar comentário:', error);
        toast.error('Erro ao adicionar comentário.');
      }
    }
  }

  async function copiarLink(palpite: Palpite) {
    if (!palpite.link) {
      toast.warning('Este palpite não possui um link disponível.');
      return;
    }

    try {
      await navigator.clipboard.writeText(palpite.link);
      toast.success('Link copiado para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar link:', error);

      try {
        const textArea = document.createElement('textarea');
        textArea.value = palpite.link;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast.success('Link copiado!');
      } catch (fallbackError) {
        console.error('Erro no fallback:', fallbackError);
        toast.error('Não foi possível copiar o link.');
      }
    }
  }

  function onImageError(event: Event) {
    console.error('Erro ao carregar imagem:', event);
    const img = event.target as HTMLImageElement;
    console.log('URL da imagem com erro:', img?.src);
  }

  const topBettors = ref([
    { user: '@RafaGol', precision: '100%' },
    { user: '@MariTips', precision: '90%' },
    { user: '@ZecaBets', precision: '80%' },
  ]);

  onMounted(async () => {
    if (!authStore.isAuthenticated) {
      try {
        const isValid = await authStore.validateToken();
        if (!isValid) {
          toast.error('Sessão expirada. Faça login novamente.');
          await router.push('/');
          return;
        }
      } catch {
        toast.error('Erro ao validar sessão. Faça login novamente.');
        await router.push('/');
        return;
      }
    }
    await carregarPalpites();
    on('palpite-criado', recarregarPalpitesListener);
  });

  onBeforeUnmount(() => {
    off('palpite-criado', recarregarPalpitesListener);
  });
</script>

<style scoped>
  .actions-section {
    padding: 4px 0;
  }

  .comment-action {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .action-count {
    font-size: 14px;
    font-weight: 600;
    color: #757575;
    min-width: 20px;
    text-align: left;
  }

  .action-btn {
    transition: all 0.2s ease;
  }

  .action-btn:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--q-primary) !important;
    transform: scale(1.1);
  }

  .action-btn .q-icon {
    font-size: 20px;
  }

  .image-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fafafa;
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 12px;
    overflow: hidden;
  }

  .post-image {
    width: 100%;
    height: auto;
    min-height: 300px;
    max-height: 600px;
    border-radius: 8px;
    object-fit: contain;
  }

  .col-12.col-md-6 {
    min-width: 0;
  }

  .actions-section {
    display: flex;
    align-items: center;
  }

  .comments-section {
    min-width: 250px;
    max-width: 300px;
    text-align: left;
  }

  .comment-input {
    margin-bottom: 4px;
    background: #f9f9f9;
    border-radius: 20px;
    padding: 4px 12px;
  }

  .comments-list {
    max-height: 170px;
    overflow-y: auto;
    font-size: 0.85em;
    margin-top: 4px;
    width: 100%;
  }

  .comment-item {
    margin-bottom: 8px;
    color: #000000;
    line-height: 1.4;
    word-wrap: break-word;
    padding: 4px 0;
    border-bottom: 1px solid #e0e0e0;
  }

  .comment-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  .comment-user {
    font-weight: 600;
    margin-right: 6px;
    font-size: 0.9em;
    display: inline;
    white-space: normal;
  }

  .comment-text {
    font-weight: 500;
    font-size: 0.9em;
    display: inline;
    white-space: normal;
    word-break: break-word;
    line-height: 1.4;
  }

  /* Garantir que o texto quebre corretamente */
  .comment-item {
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .q-avatar.rounded-circle img,
  .q-avatar.rounded-circle {
    border-radius: 50% !important;
    overflow: hidden;
  }

  .q-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  .sidebar-card {
    max-width: 260px;
    margin-left: auto;
    margin-right: auto;
    border-radius: 18px;
    transition:
      border 0.2s,
      border-radius 0.2s;
  }

  @media (max-width: 768px) {
    .row.justify-between.items-start {
      flex-direction: column;
    }

    .image-container {
      padding: 8px;
      margin-bottom: 8px;
    }

    .post-image {
      min-height: 200px;
      max-height: 400px;
    }

    .comments-section {
      max-width: 100%;
      margin-top: 12px;
    }

    .actions-section {
      width: 100%;
      justify-content: center;
      margin-bottom: 8px;
    }

    .comment-item {
      margin-bottom: 6px;
      padding: 3px 0;
    }
  }

  @media (max-width: 480px) {
    .post-image {
      min-height: 150px;
      max-height: 300px;
    }

    .image-container {
      padding: 6px;
    }
  }
</style>
