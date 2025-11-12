<template>
  <q-layout view="lHh Lpr lFf">
    <q-header v-if="authStore.isAuthenticated" elevated class="bg-white text-dark" height-hint="80">
      <div class="full-width q-ma-md">
        <q-toolbar class="q-px-md">
          <div
            class="row items-center no-wrap"
            style="min-width: 200px; cursor: pointer"
            @click="dashboard"
          >
            <img
              src="/icons/LogoSmart.png"
              alt="SmartPicks Logo"
              class="q-mr-sm"
              style="width: 180px; height: 60px; object-fit: contain"
            />
            <img
              src="/icons/NameSmart.png"
              alt="SmartPicks Nome"
              class="gt-xs"
              style="width: 180px; height: 60px; object-fit: contain; margin-left: -4.5em"
            />
          </div>

          <q-space />
          <div class="gt-sm q-mx-md" style="max-width: 400px; width: 100%">
            <q-input
              dense
              rounded
              outlined
              debounce="300"
              v-model="searchQuery"
              placeholder="Buscar..."
              bg-color="grey-1"
              class="transition-all"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="primary" />
              </template>
            </q-input>
          </div>

          <q-space />

          <div class="row items-center q-gutter-xs">
            <q-btn
              class="lt-md"
              flat
              round
              color="primary"
              icon="search"
              @click="showSearchModal = true"
            >
              <q-tooltip>Buscar</q-tooltip>
            </q-btn>

            <div class="gt-sm row items-center q-gutter-sm q-mx-sm">
              <UserAvatar :size="'36px'" :editable="true" />
              <span class="text-weight-medium text-body2"> Olá, {{ userName }}! </span>
            </div>

            <q-btn
              class="gt-sm q-mx-sm"
              rounded
              unelevated
              color="primary"
              label="Novo Palpite"
              icon="add"
              no-caps
              @click="dialog = true"
            />

            <q-btn class="lt-md" flat round color="primary" icon="add" @click="dialog = true">
              <q-tooltip>Novo Palpite</q-tooltip>
            </q-btn>

            <div class="lt-md">
              <UserAvatar :size="'32px'" :editable="true" />
            </div>
            <q-btn
              class="gt-xs q-mx-sm"
              unelevated
              rounded
              color="negative"
              icon="logout"
              label="Sair"
              no-caps
              :loading="loggingOut"
              @click="onLogout"
            />
            <q-btn
              class="lt-sm"
              flat
              round
              color="negative"
              icon="logout"
              :loading="loggingOut"
              @click="onLogout"
            >
              <q-tooltip>Sair</q-tooltip>
            </q-btn>
          </div>
        </q-toolbar>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>

  <q-dialog v-model="showSearchModal" position="top">
    <q-card style="width: 90vw; max-width: 400px" class="rounded-borders">
      <q-card-section>
        <q-input
          v-model="mobileSearchQuery"
          placeholder="Buscar..."
          autofocus
          outlined
          rounded
          dense
          @keyup.enter="performSearch"
          @keyup.esc="showSearchModal = false"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="primary" />
          </template>
          <template v-slot:append>
            <q-btn flat round dense icon="close" @click="showSearchModal = false" />
          </template>
        </q-input>
      </q-card-section>
    </q-card>
  </q-dialog>

  <ModalPalpite
    v-model:show="dialog"
    @close="dialog = false"
    @novo-palpite="onNovoPalpite"
    @palpite-criado="handlePalpiteCriado"
  />
</template>

<script setup lang="ts">
  import { computed, ref, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from 'src/stores/auth';
  import ModalPalpite from 'src/components/ModalPalpite.vue';
  import UserAvatar from 'src/components/UserAvatar.vue';

  const router = useRouter();
  const authStore = useAuthStore();
  const loggingOut = ref(false);
  const searchQuery = ref('');
  const userName = computed(() => authStore.user?.nome || 'Usuário');
  const dialog = ref(false);
  const showSearchModal = ref(false);
  const mobileSearchQuery = ref('');
  const showAvatar = ref(false);

  const emit = defineEmits<{
    (e: 'palpite-criado'): void;
  }>();

  const canShowAvatar = () => {
    return window.scrollY > 150;
  };

  const handleScroll = () => {
    showAvatar.value = canShowAvatar();
  };

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  const dashboard = async () => {
    try {
      await router.push({ name: 'dashboard' });
    } catch (err) {
      console.error('Erro ao navegar para o dashboard:', err);
    }
  };

  const handlePalpiteCriado = () => {
    emit('palpite-criado');
  };

  const onLogout = async () => {
    loggingOut.value = true;
    try {
      await authStore.logout();
      await router.replace({ name: 'login' }).catch(() => {});
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      loggingOut.value = false;
    }
  };

  const onNovoPalpite = (dados: { titulo: string; linkAposta: string; imagem: File | null }) => {
    console.log('Novo palpite recebido:', dados);
  };

  const performSearch = () => {
    if (mobileSearchQuery.value.trim()) {
      console.log('Pesquisando por:', mobileSearchQuery.value);
      showSearchModal.value = false;
      mobileSearchQuery.value = '';
    }
  };
</script>

<style scoped>
  .transition-all {
    transition: all 0.25s ease-in-out;
  }

  .q-btn {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .q-btn:hover {
    transform: translateY(-1px);
  }
</style>
