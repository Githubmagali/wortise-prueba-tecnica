import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Button } from '@heroui/react'
import { api, ApiError } from '@/lib/api'
import { useDocumentTitle } from '@/lib/useDocumentTitle'

export const Route = createFileRoute('/articles/$id')({
  component: ArticleDetailPage,
})

function ArticleDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-article', id],
    queryFn: () => api.getMyArticle(id),
  })

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-articles'] })
      navigate({ to: '/articles', search: { page: 1 } })
    },
    onError: (error) => {
      setDeleteError(error instanceof ApiError ? error.message : 'No se pudo eliminar el artículo.')
    },
  })


  if (isLoading) {
    return <p className="p-8 text-default-500">Cargando artículo...</p>
  }

  if (isError || !data) {
    return <p className="p-8 text-danger">No se pudo cargar el artículo.</p>
  }

  const article = data.item

  useDocumentTitle(`${article.title} · Artículos`)


  return (
    <div className="sm:p-8  max-w-3xl mx-auto flex flex-col gap-4">
      <Link
        to="/articles"
        search={{ page: 1 }}
        className="pt-4 sm:pt-0 text-sm text-default-500 underline w-fit"
      >
        ← Volver a mis artículos
      </Link>

      <div className="container flex items-center flex-col gap-4">
        {article.coverImageUrl && (
          <img src={article.coverImageUrl} 
          alt={article.coverImageUrl} 
          loading="lazy"
          className="w-full max-h-96 object-cover rounded-md" />
        )}
        <h1 className="text-3xl font-semibold">{article.title}</h1>
        <p className="text-sm text-default-500">
          Por {article.authorName} · {new Date(article.createdAt).toLocaleDateString('es-AR')}
        </p>
        <p className="whitespace-pre-wrap leading-relaxed">{article.content}</p>

        <div className="flex gap-3">
          <Link to="/articles/$id/edit" params={{ id }} className="button link-button">
            Editar
          </Link>
          <button aria-label='Eliminar'
            onClick={() => setIsDeleteOpen(true)} className="button text-danger">
            Eliminar
          </button>
        </div>

        {isDeleteOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title">
            <div className="bg-background rounded-md p-6 max-w-sm w-full flex flex-col gap-4">
              <h2 className="text-lg font-semibold" id="delete-dialog-title">Eliminar artículo</h2>
              <p className="text-sm text-default-500">
                ¿Seguro que querés eliminar "{article.title}"? Esta acción no se puede deshacer.
              </p>
              {deleteError && <p className="text-danger text-sm">{deleteError}</p>}
              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  onPress={() => {
                    setIsDeleteOpen(false)
                    setDeleteError(null)
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  isPending={deleteMutation.isPending}
                  onPress={() => deleteMutation.mutate()}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
