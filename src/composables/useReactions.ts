import { ref } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';
import type { ReactionType, ReactionResponse } from 'src/types';

export function useReactions() {
  const authStore = useAuthStore();
  const $q = useQuasar();
  const isLoading = ref(false);

  const reactToPalpite = async (
    palpiteId: number,
    tipo: ReactionType
  ): Promise<ReactionResponse | null> => {
    isLoading.value = true;
    try {
      const response = await authStore.reactToPalpite(palpiteId, tipo);

      if (response.action === 'added') {
        $q.notify({
          type: 'positive',
          message: tipo === 'like' ? '👍 Curtiu!' : '👎 Não curtiu!',
          position: 'top',
          timeout: 1000
        });
      } else if (response.action === 'removed') {
        $q.notify({
          type: 'info',
          message: 'Reação removida',
          position: 'top',
          timeout: 1000
        });
      } else if (response.action === 'changed') {
        $q.notify({
          type: 'info',
          message: tipo === 'like' ? '👍 Mudou para curtir!' : '👎 Mudou para não curtir!',
          position: 'top',
          timeout: 1000
        });
      }

      return response;
    } catch (error) {
      console.error('Erro ao reagir ao palpite:', error);
      $q.notify({
        type: 'negative',
        message: 'Erro ao reagir. Tente novamente.',
        position: 'top'
      });
      return null;
    } finally {
      isLoading.value = false;
    }
  };
  const reactToComentario = async (
    comentarioId: number,
    tipo: ReactionType
  ): Promise<ReactionResponse | null> => {
    isLoading.value = true;
    try {
      const response = await authStore.reactToComentario(comentarioId, tipo);

      if (response.action === 'added') {
        $q.notify({
          type: 'positive',
          message: tipo === 'like' ? '👍' : '👎',
          position: 'top',
          timeout: 800
        });
      }

      return response;
    } catch (error) {
      console.error('Erro ao reagir ao comentário:', error);
      $q.notify({
        type: 'negative',
        message: 'Erro ao reagir. Tente novamente.',
        position: 'top'
      });
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const toggleLike = async (palpiteId: number): Promise<ReactionResponse | null> => {
    return await reactToPalpite(palpiteId, 'like');
  };


  const toggleDislike = async (palpiteId: number): Promise<ReactionResponse | null> => {
    return await reactToPalpite(palpiteId, 'dislike');
  };

  const toggleComentarioLike = async (comentarioId: number): Promise<ReactionResponse | null> => {
    return await reactToComentario(comentarioId, 'like');
  };

  const toggleComentarioDislike = async (comentarioId: number): Promise<ReactionResponse | null> => {
    return await reactToComentario(comentarioId, 'dislike');
  };

  return {
    isLoading,
    reactToPalpite,
    reactToComentario,
    toggleLike,
    toggleDislike,
    toggleComentarioLike,
    toggleComentarioDislike
  };
}
