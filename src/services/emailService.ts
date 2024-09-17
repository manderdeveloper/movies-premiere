import * as fs from 'fs';
import * as path from "path";
import { Resend } from 'resend';

export function generateMoviesHtml(movie: {day:string, movies:[string]}) {
  const moviesHtml = movie.movies.map((movie:string) => {
      return `<p>${movie}</p>`
  })
  return `
  <div class="movie">
    <div class="movie-info" style="flex: 1; margin-left: 20px;">
      <p class="movie-title" style="font-size: 18px; color: #000; margin: 0;">${movie.day}</p>
      <div>${moviesHtml.join('')}</div>
    </div>
  </div>
`;
}

export function createHtmlWithMovies(template: any, movies: any) {
  const moviesHtml = movies.map((movie:any) => {
      return generateMoviesHtml(movie)
  })
  return template.replace('{{movies}}', moviesHtml);
};

export function getHtmlContent(movies: any) {
  const htmlTemplate = fs.readFileSync(path.join(__dirname, '../assets/email_template.html'), 'utf-8');
  const htmlWithMovies = createHtmlWithMovies(htmlTemplate, movies);
  return htmlWithMovies;
}

export async function sendEmail(html:any): Promise<{statusCode: number, body: string}> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY as string);
    await resend.emails.send({
        from: process.env.EMAIL_FROM || "",
        to: process.env.EMAIL_TO || "",
        subject: process.env.EMAIL_SUBJECT || "",
        html: html
    });
    return {
      statusCode: 200,
      body: JSON.stringify('Correo enviado exitosamente!')
  };
   
} catch (error) {
    console.error('Error al enviar el correo:', error);
    return {
        statusCode: 500,
        body: JSON.stringify('Error al enviar el correo')
    };
}
}