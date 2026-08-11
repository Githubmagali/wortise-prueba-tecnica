import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetPasswordEmail(to: string, url: string) {
  await resend.emails.send({
    from: "notificaciones@impulsanube.com",
    to,
    subject: "Recuperar contraseña",
    html: `
      <p>Recibimos una solicitud para restablecer tu contraseña.</p>
      <p><a href="${url}">Hacé click acá para elegir una nueva contraseña</a></p>
      <p>Si no pediste esto, podés ignorar este mail.</p>
    `,
  });
}