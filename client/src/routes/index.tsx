import { createFileRoute, Link, useNavigate, stripSearchParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Input, Chip, Spinner } from '@heroui/react'
import { z } from 'zod'
import { api } from '@/lib/api'
import { useDocumentTitle } from '@/lib/useDocumentTitle'
import { AlertCircle } from 'lucide-react'

const searchParamsSchema = z.object({
  q: z.string().catch(''),
  page: z.number().catch(1),
})

const defaultSearch = { q: '', page: 1 }

export const Route = createFileRoute('/')({
  validateSearch: searchParamsSchema,
  search: {
    middlewares: [stripSearchParams(defaultSearch)],
  },
  component: HomePage,
})


function HomePage() {
  useDocumentTitle('Artículos')

  const { q, page } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const [term, setTerm] = useState(q)

  const authorsQuery = useQuery({
    queryKey: ['authors'],
    queryFn: () => api.listAuthors(),
  })

  const searchQuery = useQuery({
    queryKey: ['search', q, page],
    queryFn: () => api.searchArticles(q, page),
  })



  //Buscador
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate({ search: { q: term, page: 1 }, replace: true })
    }, 400)
    return () => clearTimeout(timer)
  }, [term])

  return (
    <div className="sm:p-8 flex flex-col gap-10">
      <section>
        <h1 className="text-2xl font-semibold mb-4">Autores</h1>
        {authorsQuery.isLoading && (
          <div className="flex items-center gap-2 text-default-500">
            <Spinner size="sm" />
            <span>Cargando autores...</span>
          </div>
        )}
        {authorsQuery.isError && (
          <div className="flex items-center gap-2 text-danger">
            <AlertCircle size={18} />
            <span>No se pudieron cargar los autores.</span>
            <button onClick={() => authorsQuery.refetch()} className="underline text-sm">
              Reintentar
            </button>
          </div>
        )}
        {authorsQuery.data && authorsQuery.data.items.length === 0 && (
          <p className="text-default-500">Todavía no hay autores registrados.</p>
        )}
        {authorsQuery.data && authorsQuery.data.items.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {authorsQuery.data && authorsQuery.data.items.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Chip
                  variant="secondary"
                  size="lg"
                  className="cursor-pointer"
                  onClick={() => {
                    setTerm('')
                    navigate({ search: { q: '', page: 1 }, replace: true })
                  }}
                >
                  Ver todos
                </Chip>
                {authorsQuery.data.items.map((a) => (
                  <Chip
                    key={a.authorId}
                    variant="secondary"
                    size="lg"
                    className="cursor-pointer"
                    onClick={() => {
                      setTerm(a.authorName)
                      navigate({ search: { q: a.authorName, page: 1 }, replace: true })
                    }}
                  >
                    {a.authorName} · {a.articleCount}
                  </Chip>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Buscar artículos</h2>
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Buscar por título, contenido o autor..."
          className="max-w-md mb-6 input-2"
        />

        {searchQuery.isLoading && (
          <div className="flex items-center gap-2 text-default-500">
            <Spinner size="sm" />
            <span>Buscando...</span>
          </div>
        )}
        {searchQuery.isError && (
          <div className="flex items-center gap-2 text-danger">
            <AlertCircle size={18} />
            <span>No se pudo realizar la búsqueda.</span>
            <button onClick={() => searchQuery.refetch()} className="underline text-sm">
              Reintentar
            </button>
          </div>
        )}
        {searchQuery.data && searchQuery.data.items.length === 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-8">
            <div className="text-center sm:text-left">
              <p className="text-default-500 text-lg pb-2">
                {q ? `No encontramos artículos para "${q}".` : 'Todavía no hay artículos publicados.'}
              </p>
              {q && (
                <button
                  onClick={() => {
                    setTerm('')
                    navigate({ search: { q: '', page: 1 }, replace: true })
                  }}
                  className="text-sm text-default-500"
                >
                  Ver todos los artículos
                </button>
              )}
            </div>
            <img src="/img.png" alt="Sin resultados" className="img-articles shrink-0" />
          </div>
        )}
        {searchQuery.data && searchQuery.data.items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {searchQuery.data.items.map((article) => (
              <Link
                key={article.id}
                to="/public/articles/$id"
                params={{ id: article.id }}
                className="border border-default-200 rounded-md overflow-hidden hover:border-default-400 flex flex-col"
              >
                {article.coverImageUrl && (
                  <img
                    src={article.coverImageUrl}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4 flex flex-col gap-1">
                  <h3 className="font-semibold title-1">{article.title}</h3>
                  <p className="text-sm text-default-500">{article.authorName}</p>
                  <p className="text-sm text-default-500 line-clamp-2 pt-2">{article.content}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}  
