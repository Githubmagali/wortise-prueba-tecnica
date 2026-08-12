import { createFileRoute, Link, useNavigate, stripSearchParams } from '@tanstack/react-router'
import { Button, Spinner } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { z } from 'zod'
import { useDocumentTitle } from '@/lib/useDocumentTitle'
import { AlertCircle } from 'lucide-react'

const defaultSearch = { page: 1 }

const searchParamsSchema = z.object({
  page: z.number().catch(1),
})

export const Route = createFileRoute('/articles/')({
  validateSearch: searchParamsSchema,
  search: {
    middlewares: [stripSearchParams(defaultSearch)],
  },
  component: MyArticlesPage,
})

function MyArticlesPage() {
  useDocumentTitle('Mis artículos · Artículos')
  const { page } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-articles', page],
    queryFn: () => api.listMyArticles(page),
  })

  if (isLoading) {
    if (isLoading) {
      return (
        <div className="p-8 flex items-center gap-2 text-default-500">
          <Spinner size="sm" />
          <span>Cargando tus artículos...</span>
        </div>
      )
    }
  }

  if (isError) {
    return (
      <div className="p-8 flex items-center gap-2 text-danger">
        <AlertCircle size={18} />
        <span>No se pudieron cargar tus artículos.</span>
        <button onClick={() => refetch()} className="button-error text-sm">
          Reintentar
        </button>
      </div>
    )
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="p-8 flex flex-col sm:flex-row items-center justify-center gap-8">
        <div>
          <p className="text-default-500 text-lg pb-5">Todavía no creaste ningún artículo.</p>
          <Link to="/articles/new" className="button-3 ">Crear mi primer artículo</Link>
        </div>
        <img src="/img.png" alt="img-article" loading="lazy" className="img-articles shrink-0" />
      </div>
    )
  }

  return (
    <>
      <div className="sm:p-8 pt-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold flex ">Hace click para editar <div className="color-2 pl-2">artículos</div></h1>
          <Link to="/articles/new" className="link-3 color-3">Nuevo artículo</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.items.map((article) => (
            <Link
              key={article.id}
              to="/articles/$id"
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
              <div className="p-4 flex flex-col gap-1 bg-white">
                <h3 className="font-semibold title-1">{article.title}</h3>
                <p className="text-sm text-default-500">{article.authorName}</p>
                <p className="text-sm text-default-500 pt-2">{article.content}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 pt-4">
        <Button
          variant="secondary"
          isDisabled={page <= 1}
          onPress={() => navigate({ search: { page: page - 1 } })}
        >
          Anterior
        </Button>
        <span className="text-sm text-default-500">
          Página {page} de {data.totalPages}
        </span>
        <Button
          variant="secondary"
          isDisabled={page >= data.totalPages}
          onPress={() => navigate({ search: { page: page + 1 } })}
        >
          Siguiente
        </Button>
      </div>
    </>
  )
}