const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export class ApiError extends Error {
  status: number
  details?: unknown
  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.status = status
    this.details = details
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const body = isJson ? await res.json().catch(() => null) : null

  if (!res.ok) {
    throw new ApiError(body?.error || 'Ocurrió un error inesperado', res.status, body?.details)
  }

  return body as T
}
export interface Article {
  id: string
  title: string
  content: string
  coverImageUrl: string | null
  authorId: string
  authorName: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedResult<T> {
  items: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ArticleInput {
  title: string
  content: string
  coverImageUrl?: string
}

export const api = {
  listMyArticles: (page: number, limit = 10) =>
    request<PaginatedResult<Article>>(`/api/articles?page=${page}&limit=${limit}`),

  createArticle: (input: ArticleInput) =>
    request<{ item: Article }>('/api/articles', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  getMyArticle: (id: string) =>
    request<{ item: Article }>(`/api/articles/${id}`),

  deleteArticle: (id: string) =>
    request<{ ok: true }>(`/api/articles/${id}`, {
      method: 'DELETE',
    }),
  updateArticle: (id: string, input: ArticleInput) =>
    request<{ item: Article }>(`/api/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    }),
  listAuthors: () =>
    request<{ items: { authorId: string; authorName: string; articleCount: number }[] }>('/api/public/authors'),

  searchArticles: (q: string, page: number, limit = 10) =>
    request<PaginatedResult<Article>>(
      `/api/public/articles/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`
    ),  
  getPublicArticle: (id: string) =>
    request<{ item: Article }>(`/api/public/articles/${id}`),  
}

