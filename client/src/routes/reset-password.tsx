import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { z } from 'zod'
import { Button, Card, Input, TextField, Label, FieldError } from '@heroui/react'
import { resetPassword } from '@/lib/auth-client'

const resetPasswordSearchSchema = z.object({
  token: z.string().catch(''),
})

const newPasswordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')

export const Route = createFileRoute('/reset-password')({
  validateSearch: resetPasswordSearchSchema,
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const { token } = Route.useSearch()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { newPassword: '' },
    onSubmit: async ({ value }) => {
      setFormError(null)
      const { error } = await resetPassword({
        newPassword: value.newPassword,
        token,
      })
      if (error) {
        setFormError(error.message || 'No se pudo cambiar la contraseña. El link puede haber expirado.')
        return
      }
      navigate({ to: '/login' })
    },
  })

  if (!token) {
    return (
      <div className="flex justify-center p-8">
        <Card className="w-full max-w-sm">
          <Card.Content>
            <p className="text-danger text-sm">
              Este link no es válido. Pedí uno nuevo desde{' '}
              <Link to="/forgot-password" className="underline">
                acá
              </Link>
              .
            </p>
          </Card.Content>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex justify-center p-8">
      <Card className="w-full max-w-sm">
        <Card.Header>
          <Card.Title>Elegí una nueva contraseña</Card.Title>
        </Card.Header>
        <Card.Content>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <form.Field
              name="newPassword"
              validators={{
                onChange: ({ value }) => {
                  const result = newPasswordSchema.safeParse(value)
                  return result.success ? undefined : result.error.issues[0]?.message
                },
              }}
            >
              {(field) => (
                <TextField isInvalid={field.state.meta.errors.length > 0} className="flex flex-col gap-1.5">
                  <Label>Nueva contraseña</Label>
                  <Input
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <FieldError>{field.state.meta.errors.join(', ')}</FieldError>
                  )}
                </TextField>
              )}
            </form.Field>

            {formError && <p className="text-danger text-sm">{formError}</p>}

            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" isDisabled={!canSubmit} isPending={isSubmitting}>
                  Cambiar contraseña
                </Button>
              )}
            </form.Subscribe>
          </form>
        </Card.Content>
      </Card>
    </div>
  )
}
