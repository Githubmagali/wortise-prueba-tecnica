import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Button, Card, Input, TextField, Label, FieldError } from '@heroui/react'
import { loginFormSchema } from '@/lib/schemas'
import { signIn } from '@/lib/auth-client'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: async ({ value }) => {
      setFormError(null)
      const { error } = await signIn.email({
        email: value.email,
        password: value.password,
      })
      if (error) {
        setFormError(error.message || 'No se pudo iniciar sesión. Revisá tus credenciales.')
        return
      }
      navigate({ to: '/', search: { q: '', page: 1 } })
    },
  })

  return (
    <div className="flex justify-center p-8 pt-28">
      <Card className="w-full max-w-sm ">
        <div className="flex flex-col gap-1.5 pb-0">
          <h2 className="">Ingresar</h2>
          <p className="text-sm text-default-500">Accedé a tu cuenta para gestionar tus artículos.</p>
        </div>
        <Card.Content>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  const result = loginFormSchema.shape.email.safeParse(value)
                  return result.success ? undefined : result.error.issues[0]?.message
                },
              }}
            >
              {(field) => (
                <TextField isInvalid={field.state.meta.errors.length > 0} className="flex flex-col gap-1.5">
                  <Label>Email</Label>
                  <Input
                    type="email"
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

            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => {
                  const result = loginFormSchema.shape.password.safeParse(value)
                  return result.success ? undefined : result.error.issues[0]?.message
                },
              }}
            >
              {(field) => (
                <TextField isInvalid={field.state.meta.errors.length > 0} className="flex flex-col gap-1.5">
                  <Label>Contraseña</Label>
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
                  Ingresar
                </Button>
              )}
            </form.Subscribe>
          </form>
          <p className="text-sm text-default-500 mt-4 text-center">
            ¿No tenés cuenta? <Link to="/register" className="underline">Registrate</Link>
          </p>
          <p className="text-sm text-default-500 mt-2 text-center">
            <Link to="/forgot-password" className="underline link-2">¿Olvidaste tu contraseña?</Link>
          </p>
        </Card.Content>
      </Card>
    </div>
  )
}