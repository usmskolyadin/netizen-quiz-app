export interface Quiz {
    id: number,
    title: string;
    description: string;
    image_url: string;
    is_popular?: boolean; 
    is_new?: boolean; 
    maxScore: number;
    collaboratorName?: string;
    collaboratorLogo?: string;
    collaboratorLink?: string;
}
