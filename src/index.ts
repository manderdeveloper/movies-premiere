import { getHtmlContent, sendEmail } from './services/emailService';
import { getScrappedMovies } from './services/scrapperService';

export const handler: any = async (event) => {
    const movies = await getScrappedMovies()
    const htmlMovies = getHtmlContent(movies)
    const response = await sendEmail(htmlMovies);
    return response;
    
};