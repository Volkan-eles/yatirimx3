
import { supabase } from '../utils/supabase';

export interface PortfolioItem {
    id: string;
    code: string;
    quantity: number;
    average_cost: number;
    current_price?: number; // Fetched from API
}

export const PortfolioService = {
    // Get all assets for a user
    async getPortfolio(userId: string) {
        const { data, error } = await supabase
            .from('portfolio')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Add a new asset
    async addAsset(userId: string, code: string, quantity: number, cost: number) {
        const { data, error } = await supabase
            .from('portfolio')
            .insert([
                { user_id: userId, code: code.toUpperCase(), quantity, average_cost: cost }
            ])
            .select();

        if (error) throw error;
        return data;
    },

    // Delete an asset
    async deleteAsset(id: string) {
        const { error } = await supabase
            .from('portfolio')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
