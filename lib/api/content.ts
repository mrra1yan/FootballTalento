// lib/api/content.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://docstec.site/wp-json/footballtalento/v1';
const FT_API_KEY = process.env.NEXT_PUBLIC_FT_API_KEY || 'ft_secret_key_2024_01_25';

export interface HomeContent {
    slides: {
        id: number;
        image: string;
        title: string;
        description: string;
        highlights: string[];
        badges: string[];
        cta1: { text: string; link: string };
        cta2: { text: string; link: string };
    }[];
    reviews: {
        id: number;
        name: string;
        role: string;
        location: string;
        message: string;
        badge: string;
        rating: number;
    }[];
    clubs: {
        id: number;
        name: string;
        logo: string;
    }[];
}

export const getHomeContent = async (lang: string = 'en'): Promise<HomeContent> => {
    try {
        const response = await axios.get(`${API_URL}/home-content`, {
            params: { lang },
            headers: {
                'X-FT-API-Key': FT_API_KEY
            }
        });

        if (response.data.success) {
            return response.data.data;
        }
        throw new Error('Failed to fetch home content');
    } catch (error) {
        console.error('Error fetching home content:', error);
        throw error;
    }
};
