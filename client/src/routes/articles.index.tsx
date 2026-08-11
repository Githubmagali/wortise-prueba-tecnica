import { createFileRoute, Link, useNavigate} from '@tanstack/react-router'
import { Button } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { z } from 'zod'

const searchParamsSchema = z.object({
  page: z.number().catch(1),
})

export const Route = createFileRoute('/articles/')({
  validateSearch: searchParamsSchema,
  component: MyArticlesPage,
})

function MyArticlesPage() {
  const { page } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-articles', page],
    queryFn: () => api.listMyArticles(page),
  })

  if (isLoading) {
    return <p className="p-8 text-default-500">Cargando tus artículos...</p>
  }

  if (isError) {
    return <p className="p-8 text-danger">No se pudieron cargar tus artículos.</p>
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="p-8 flex flex-col sm:flex-row items-center justify-center gap-8">
        <div>
          <p className="text-default-500 text-lg pb-5">Todavía no creaste ningún artículo.</p>
          <Link to="/articles/new" className="button-3 ">Crear mi primer artículo</Link>
        </div>
        <img src="/img.png" alt="img-article" className="img-articles shrink-0" />
      </div>
    )
  }

  return (
    <>
      <div className="sm:p-8 pt-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold flex ">Mis <div className="color-2 pl-2">artículos</div></h1>
          <Link to="/articles/new" className="underline">Nuevo artículo</Link>
        </div>
        <div className="flex flex-col gap-3">
          {data.items.map((article) => (
            <Link
              key={article.id}
              to="/articles/$id"
              params={{ id: article.id }}
              className="container-2 border border-default-200 rounded-md p-4 hover:border-default-400"
            >
              <h2 className="font-semibold">{article.title}</h2>
              <p className="text-sm text-default-500 line-clamp-1 pt-4">{article.content}</p>
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