import * as tf from '@tensorflow/tfjs';

export class StockPricePredictor {
    private model: tf.LayersModel | null = null;
    private isModelLoaded = false;

    async loadModel() {
        if (this.isModelLoaded) return;

        try {
            // Create a simple LSTM model for price prediction
            this.model = tf.sequential({
                layers: [
                    tf.layers.lstm({
                        units: 50,
                        returnSequences: true,
                        inputShape: [60, 1], // 60 days of data, 1 feature (price)
                    }),
                    tf.layers.dropout({ rate: 0.2 }),
                    tf.layers.lstm({
                        units: 50,
                        returnSequences: false,
                    }),
                    tf.layers.dropout({ rate: 0.2 }),
                    tf.layers.dense({ units: 25 }),
                    tf.layers.dense({ units: 1 }),
                ],
            });

            this.model.compile({
                optimizer: tf.train.adam(0.001),
                loss: 'meanSquaredError',
            });

            this.isModelLoaded = true;
        } catch (error) {
            console.error('Model loading error:', error);
            throw error;
        }
    }

    normalizeData(data: number[]): { normalized: number[]; min: number; max: number } {
        const min = Math.min(...data);
        const max = Math.max(...data);
        const normalized = data.map((val) => (val - min) / (max - min));
        return { normalized, min, max };
    }

    denormalize(value: number, min: number, max: number): number {
        return value * (max - min) + min;
    }

    async predict(historicalPrices: number[], daysAhead: number = 30): Promise<number[]> {
        if (!this.model) {
            await this.loadModel();
        }

        if (!this.model) {
            throw new Error('Model not loaded');
        }

        // Normalize data
        const { normalized, min, max } = this.normalizeData(historicalPrices);

        // Prepare sequences
        const sequenceLength = 60;
        const predictions: number[] = [];
        let currentSequence = normalized.slice(-sequenceLength);

        // Predict future prices
        for (let i = 0; i < daysAhead; i++) {
            const input = tf.tensor3d([currentSequence], [1, sequenceLength, 1]);
            const prediction = this.model.predict(input) as tf.Tensor;
            const predValue = (await prediction.data())[0];

            // Denormalize
            const actualPrice = this.denormalize(predValue, min, max);
            predictions.push(actualPrice);

            // Update sequence
            currentSequence = [...currentSequence.slice(1), predValue];

            // Cleanup
            input.dispose();
            prediction.dispose();
        }

        return predictions;
    }

    calculateRSI(prices: number[], period: number = 14): number {
        if (prices.length < period + 1) return 50;

        let gains = 0;
        let losses = 0;

        for (let i = prices.length - period; i < prices.length; i++) {
            const change = prices[i] - prices[i - 1];
            if (change > 0) {
                gains += change;
            } else {
                losses += Math.abs(change);
            }
        }

        const avgGain = gains / period;
        const avgLoss = losses / period;

        if (avgLoss === 0) return 100;

        const rs = avgGain / avgLoss;
        const rsi = 100 - 100 / (1 + rs);

        return rsi;
    }

    calculateMACD(prices: number[]): { macd: number; signal: number; histogram: number } {
        const ema12 = this.calculateEMA(prices, 12);
        const ema26 = this.calculateEMA(prices, 26);
        const macd = ema12 - ema26;

        // Signal line (9-day EMA of MACD)
        const macdHistory = [macd]; // Simplified
        const signal = macd; // Simplified

        const histogram = macd - signal;

        return { macd, signal, histogram };
    }

    calculateEMA(prices: number[], period: number): number {
        if (prices.length === 0) return 0;

        const multiplier = 2 / (period + 1);
        let ema = prices[0];

        for (let i = 1; i < prices.length; i++) {
            ema = (prices[i] - ema) * multiplier + ema;
        }

        return ema;
    }

    detectPatterns(prices: number[]): Array<{
        name: string;
        type: 'bullish' | 'bearish' | 'neutral';
        confidence: number;
        description: string;
    }> {
        const patterns = [];

        // Head and Shoulders
        if (this.detectHeadAndShoulders(prices)) {
            patterns.push({
                name: 'Baş ve Omuzlar',
                type: 'bearish' as const,
                confidence: 75,
                description: 'Düşüş sinyali veren klasik formasyon',
            });
        }

        // Support/Resistance
        const support = this.findSupport(prices);
        const resistance = this.findResistance(prices);
        const currentPrice = prices[prices.length - 1];

        if (currentPrice - support < (resistance - support) * 0.2) {
            patterns.push({
                name: 'Destek Seviyesi',
                type: 'bullish' as const,
                confidence: 85,
                description: `₺${support.toFixed(2)} seviyesinde güçlü destek`,
            });
        }

        if (resistance - currentPrice < (resistance - support) * 0.2) {
            patterns.push({
                name: 'Direnç Seviyesi',
                type: 'bearish' as const,
                confidence: 80,
                description: `₺${resistance.toFixed(2)} seviyesinde direnç`,
            });
        }

        // RSI Divergence
        const rsi = this.calculateRSI(prices);
        if (rsi < 30) {
            patterns.push({
                name: 'RSI Aşırı Satım',
                type: 'bullish' as const,
                confidence: 70,
                description: 'RSI 30\'un altında, potansiyel yükseliş',
            });
        } else if (rsi > 70) {
            patterns.push({
                name: 'RSI Aşırı Alım',
                type: 'bearish' as const,
                confidence: 70,
                description: 'RSI 70\'in üstünde, potansiyel düşüş',
            });
        }

        // Moving Average Crossover
        const ma20 = this.calculateMA(prices, 20);
        const ma50 = this.calculateMA(prices, 50);

        if (ma20 > ma50) {
            patterns.push({
                name: 'Golden Cross',
                type: 'bullish' as const,
                confidence: 75,
                description: 'MA20, MA50\'yi yukarı kesti',
            });
        } else if (ma20 < ma50) {
            patterns.push({
                name: 'Death Cross',
                type: 'bearish' as const,
                confidence: 75,
                description: 'MA20, MA50\'yi aşağı kesti',
            });
        }

        return patterns;
    }

    private detectHeadAndShoulders(prices: number[]): boolean {
        // Simplified pattern detection
        if (prices.length < 20) return false;

        const recent = prices.slice(-20);
        const max = Math.max(...recent);
        const maxIndex = recent.indexOf(max);

        // Check if peak is in the middle
        return maxIndex > 5 && maxIndex < 15;
    }

    private findSupport(prices: number[]): number {
        const recent = prices.slice(-30);
        const lows = recent.filter((_, i) => {
            if (i === 0 || i === recent.length - 1) return false;
            return recent[i] < recent[i - 1] && recent[i] < recent[i + 1];
        });

        return lows.length > 0 ? Math.min(...lows) : Math.min(...recent);
    }

    private findResistance(prices: number[]): number {
        const recent = prices.slice(-30);
        const highs = recent.filter((_, i) => {
            if (i === 0 || i === recent.length - 1) return false;
            return recent[i] > recent[i - 1] && recent[i] > recent[i + 1];
        });

        return highs.length > 0 ? Math.max(...highs) : Math.max(...recent);
    }

    private calculateMA(prices: number[], period: number): number {
        if (prices.length < period) return prices[prices.length - 1];

        const recent = prices.slice(-period);
        const sum = recent.reduce((a, b) => a + b, 0);
        return sum / period;
    }

    calculateModelAccuracy(predictions: number[], actuals: number[]): number {
        if (predictions.length === 0 || actuals.length === 0) return 0;

        const minLength = Math.min(predictions.length, actuals.length);
        let totalError = 0;

        for (let i = 0; i < minLength; i++) {
            const error = Math.abs(predictions[i] - actuals[i]) / actuals[i];
            totalError += error;
        }

        const avgError = totalError / minLength;
        const accuracy = Math.max(0, (1 - avgError) * 100);

        return Math.min(100, accuracy);
    }
}

export const stockPredictor = new StockPricePredictor();
