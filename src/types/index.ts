// User Types
export interface User {
  id: number;
  nome: string;
  email: string;
  perfil: 'user' | 'admin';
  avatar?: string;
  cpf?: string;
  dataNascimento?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Auth Types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  password: string;
  cpf: string;
  dataNascimento: string;
  perfil: 'user' | 'admin';
}

export interface AuthResponse {
  user: User;
  token?: string;
}

// Palpite Types
export interface Palpite {
  id: number;
  titulo?: string;
  linkAposta?: string;
  imagem: string;
  userId: number;
  user?: Pick<User, 'id' | 'nome' | 'avatar'>;
  createdAt: string;
  updatedAt?: string;
}

export interface PalpiteStats extends Palpite {
  total_likes: number;
  total_dislikes: number;
  total_comentarios: number;
  user_reaction: ReactionType | null;
  autor_nome?: string;
  autor_avatar?: string;
}

export interface CreatePalpiteData {
  titulo?: string;
  linkAposta?: string;
  imagem: File;
}

// Reaction Types
export type ReactionType = 'like' | 'dislike';

export interface Reaction {
  id: number;
  user_id: number;
  tipo: ReactionType;
  created_at: string;
}

export interface ReactionResponse {
  action: 'added' | 'removed' | 'changed';
  total_likes: number;
  total_dislikes: number;
}

export interface ReactionRequest {
  tipo: ReactionType;
}

// Comentario Types
export interface Comentario {
  id: number;
  palpite_id: number;
  user_id: number;
  texto: string;
  created_at: string;
  updated_at: string;
  total_likes?: number;
  total_dislikes?: number;
  autor_nome?: string;
  autor_avatar?: string;
  user_reaction?: ReactionType | null;
}

export interface CreateComentarioData {
  palpite_id: number;
  texto: string;
}

export interface UpdateComentarioData {
  texto: string;
}

// API Response Types
export interface ApiError {
  message: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface FormField {
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'file' | 'date';
  rules?: Array<(val: string) => boolean | string>;
  options?: Array<{ label: string; value: string }>;
}

// Component Props Types
export interface BaseComponentProps {
  loading?: boolean;
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface ModalProps extends BaseComponentProps {
  show: boolean;
  persistent?: boolean;
  title?: string;
}

// Router Types
export interface RouteGuardContext {
  isAuthenticated: boolean;
  user?: User;
  requiredRole?: 'user' | 'admin';
}

// Store Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Event Types
export type EventCallback<T = unknown> = (data: T) => void;
export type VoidCallback = () => void;
