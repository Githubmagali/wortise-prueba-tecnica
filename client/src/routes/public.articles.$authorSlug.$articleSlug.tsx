import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle } from 'lucide-react'
import { Spinner } from '@heroui/react'
import { api } from '@/lib/api'
import { useSession } from '@/lib/auth-client'
import { useDocumentTitle } from '@/lib/useDocumentTitle'

export const Route = createFileRoute('/public/articles/$authorSlug/$articleSlug')({
  component: PublicArticleDetailPage,
})

function PublicArticleDetailPage() {
  const { authorSlug, articleSlug } = Route.useParams()
  const { data: session } = useSession()

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['public-article-by-slug', authorSlug, articleSlug],
    queryFn: () => api.getPublicArticleBySlug(authorSlug, articleSlug),
  })

  useDocumentTitle(data?.item.title ? `${data.item.title} · Artículos` : 'Artículos')

  if (isLoading) {
    return (
      <div className="p-8 flex items-center gap-2 text-default-500">
        <Spinner size="sm" />
        <span>Cargando artículo...</span>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="p-8 flex items-center gap-2 text-danger">
        <AlertCircle size={18} />
        <span>No se pudo cargar el artículo.</span>
        <button onClick={() => refetch()} className="button-error text-sm">
          Reintentar
        </button>
      </div>
    )
  }

  const article = data.item

  return (
    <div className="relative p-2 sm:p-8">
      <div className="flex flex-col gap-4 mb-6 lg:mb-0 lg:absolute lg:left-8 lg:top-8">
        {session?.user ? (
          <>
            <Link
              to="/"
              search={{ q: '', page: 1 }}
              className="text-sm text-default-500 underline w-fit flex items-center gap-2 link"
            >
              ← Volver a la página de inicio
            </Link>
            <Link
              to="/articles"
              search={{ page: 1 }}
              className="text-sm text-default-500 underline w-fit flex items-center gap-2 link"
            >
              ← Ver mis artículos y editarlos
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/"
              search={{ q: '', page: 1 }}
              className="text-sm text-default-500 underline w-fit flex items-center gap-2 link"
            >
              ← Volver a la búsqueda
            </Link>
            <Link
              to="/"
              search={{ q: article.authorName, page: 1 }}
              className="text-sm text-default-500 underline w-fit flex items-center gap-2 link"
            >
              ← Ver más de {article.authorName}
            </Link>
          </>
        )}
      </div>

      <div className="container max-w-3xl flex flex-col gap-4 mx-auto">
        {article.coverImageUrl && (
          <img
            src={article.coverImageUrl}
            alt={article.title}
            loading="lazy"
            className="w-full max-h-96 object-cover rounded-md"
          />
        )}
        <h1 className="font-semibold">{article.title}</h1>
        <p className="text-sm text-default-500">
          Por {article.authorName} · {new Date(article.createdAt).toLocaleDateString('es-AR')}
        </p>
        <p className="whitespace-pre-wrap leading-relaxed">{article.content}</p>
      </div>
    </div>
  )
}

