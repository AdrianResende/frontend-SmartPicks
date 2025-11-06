<template>
  <div class="reaction-buttons">
    <div class="reaction-item">
      <q-btn flat round dense :icon="userReaction === 'like' ? 'thumb_up' : 'thumb_up_off_alt'"
        :color="userReaction === 'like' ? 'positive' : 'grey-7'" :class="{ 'active-reaction': userReaction === 'like' }"
        :loading="isLoading && pendingType === 'like'" :disable="isLoading" @click="handleLike" size="md"
        class="reaction-btn">
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 8]">
          {{ userReaction === 'like' ? 'Remover curtida' : 'Curtir' }}
        </q-tooltip>
      </q-btn>
      <span class="reaction-count" :class="{ 'active-count': userReaction === 'like' }">
        {{ formatCount(totalLikes) }}
      </span>
    </div>

    <div class="reaction-item">
      <q-btn flat round dense :icon="userReaction === 'dislike' ? 'thumb_down' : 'thumb_down_off_alt'"
        :color="userReaction === 'dislike' ? 'negative' : 'grey-7'"
        :class="{ 'active-reaction': userReaction === 'dislike' }" :loading="isLoading && pendingType === 'dislike'"
        :disable="isLoading" @click="handleDislike" size="md" class="reaction-btn">
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 8]">
          {{ userReaction === 'dislike' ? 'Remover não curtida' : 'Não curtir' }}
        </q-tooltip>
      </q-btn>
      <span class="reaction-count" :class="{ 'active-count': userReaction === 'dislike' }">
        {{ formatCount(totalDislikes) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ReactionType } from 'src/types';

interface Props {
  totalLikes?: number;
  totalDislikes?: number;
  userReaction?: ReactionType | null | undefined;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  totalLikes: 0,
  totalDislikes: 0,
  userReaction: null,
  loading: false,
});

const emit = defineEmits<{
  (e: 'react', tipo: ReactionType): void;
}>();

const pendingType = ref<ReactionType | null>(null);

const isLoading = computed(() => props.loading);

const handleLike = () => {
  pendingType.value = 'like';
  emit('react', 'like');
  setTimeout(() => {
    pendingType.value = null;
  }, 500);
};

const handleDislike = () => {
  pendingType.value = 'dislike';
  emit('react', 'dislike');
  setTimeout(() => {
    pendingType.value = null;
  }, 500);
};

const formatCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};
</script>

<style scoped>
.reaction-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reaction-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.reaction-count {
  font-size: 14px;
  font-weight: 600;
  color: #757575;
  min-width: 20px;
  text-align: left;
  transition: all 0.3s ease;
}

.reaction-count.active-count {
  color: #1976d2;
  font-weight: 700;
}

.reaction-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.reaction-btn:hover {
  transform: scale(1.1);
}

.active-reaction {
  animation: pulse 0.5s ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

/* Animação de hover nos botões */
.reaction-btn:not(:disabled):hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Efeito visual quando está ativo */
.reaction-btn.active-reaction {
  font-weight: bold;
}

/* Responsividade */
@media (max-width: 600px) {
  .reaction-buttons {
    gap: 8px;
  }

  .reaction-item {
    gap: 3px;
  }

  .reaction-count {
    font-size: 12px;
  }
}
</style>
