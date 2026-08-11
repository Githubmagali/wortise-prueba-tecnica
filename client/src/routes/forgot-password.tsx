import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { Button, Card, Input, TextField, Label, FieldError } from '@heroui/react'
import { forgotPasswordFormSchema } from '@/lib/schemas'
import { requestPasswordReset } from '@/lib/auth-client'


export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const [formError, setFormError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const form = useForm({
    defaultValues: { email: '' },
    onSubmit: async ({ value }) => {
      setFormError(null)
      const { error } = await requestPasswordReset({
        email: value.email,
        redirectTo: '/reset-password',
      })
      if (error) {
        setFormError(error.message || 'No se pudo procesar la solicitud.')
        return
      }
      setSent(true)
    },
  })

  return (
    <div className="flex justify-center pt-28">
      <Card className="w-full max-w-sm ">
        <div className="flex flex-col gap-1.5 pb-0">
          <h2 className="">Olvidé mi contraseña</h2>
          <p className="text-sm text-default-500">
           Ingresá tu email y te mandamos un link para elegir una nueva contraseña.</p>
        </div>
        <Card.Content>
          {sent ? (
            <p className="text-default-500">
              Si el email existe en nuestro sistema, te llegó un mail con las instrucciones. Revisá tu
              bandeja de entrada (y spam, por las dudas).
            </p>
          ) : (
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
                    const result = forgotPasswordFormSchema.shape.email.safeParse(value)
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

              {formError && <p className="text-danger text-sm">{formError}</p>}

              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Button type="submit" isDisabled={!canSubmit} isPending={isSubmitting}>
                    Enviar link
                  </Button>
                )}
              </form.Subscribe>
            </form>
          )}
          <p className="text-sm text-default-500 mt-4 text-center">
            <Link to="/login" className="underline">
              Volver a ingresar
            </Link>
          </p>
        </Card.Content>
      </Card>
    </div>
  )
}
