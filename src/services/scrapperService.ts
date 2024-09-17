import { chromium } from "playwright";

export async function getScrappedMovies() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const date = getDateToUrl()
  await page.goto(`${process.env.MOVIES_URL}${date}` ?? "");

  const movies = await page.evaluate(() => {
    const premiereDays = Array.from(document.querySelectorAll('.movie-agenda-month'));
    const scrappedMovies = premiereDays.map(premiereDay => {
        const movies = Array.from(premiereDay.querySelectorAll('a')).map(movie => movie && movie.textContent ? movie.textContent.trim(): "");
        const day = premiereDay.querySelector('h2')?.textContent?.trim();
        if (day) {
          return { day, movies };
        }
        
    });
    return scrappedMovies;
  });

  await browser.close();
  return movies;
}

export function getDateToUrl() {
  const date = new Date();
  let month = date.getMonth() + 1;
  let year = month === 12 ? date.getFullYear() +1 : date.getFullYear();
  month = (month % 12) + 1;
  const formattedMonth = month.toString().padStart(2, '0');
  return `${year}-${formattedMonth}`;
}
