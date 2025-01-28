import * as tf from '@tensorflow/tfjs';

interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TechnicalIndicators {
  rsi: number;
  macd: number;
  ema: number;
  sma: number;
}

export class PredictionService {
  private model: tf.LayersModel | null = null;
  private readonly lookback = 30; // Number of days to look back for predictions
  private readonly featureCount = 5; // OHLCV data points

  async initialize(): Promise<void> {
    this.model = tf.sequential({
      layers: [
        tf.layers.lstm({
          units: 50,
          inputShape: [this.lookback, this.featureCount],
          returnSequences: true
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.lstm({
          units: 50,
          returnSequences: false
        }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 1 })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError'
    });
  }

  private calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period) return 0;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i < period; i++) {
      const difference = prices[i] - prices[i - 1];
      if (difference >= 0) {
        gains += difference;
      } else {
        losses -= difference;
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateMACD(prices: number[]): number {
    if (prices.length < 26) return 0;

    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    return ema12 - ema26;
  }

  private calculateEMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[prices.length - 1];

    const multiplier = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((a, b) => a + b) / period;

    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }

    return ema;
  }

  private calculateTechnicalIndicators(data: StockData[]): TechnicalIndicators {
    const prices = data.map(d => d.close);
    
    return {
      rsi: this.calculateRSI(prices),
      macd: this.calculateMACD(prices),
      ema: this.calculateEMA(prices, 20),
      sma: prices.slice(-20).reduce((a, b) => a + b) / 20
    };
  }

  private normalizeData(data: StockData[]): tf.Tensor3D {
    const normalizedData = data.map(d => [
      d.open,
      d.high,
      d.low,
      d.close,
      d.volume
    ]);

    // Min-max normalization
    const features = tf.tensor2d(normalizedData);
    const min = features.min(0);
    const max = features.max(0);
    const normalized = features.sub(min).div(max.sub(min));

    // Reshape for LSTM input [samples, timesteps, features]
    return normalized.reshape([1, data.length, this.featureCount]);
  }

  async predictReversal(historicalData: StockData[]): Promise<{
    date: string;
    confidence: number;
    direction: 'bullish' | 'bearish';
  }> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    // Prepare data
    const recentData = historicalData.slice(-this.lookback);
    const normalizedData = this.normalizeData(recentData);
    
    // Make prediction
    const prediction = await this.model.predict(normalizedData) as tf.Tensor;
    const predictedValue = (await prediction.data())[0];
    
    // Calculate confidence and direction
    const technicalIndicators = this.calculateTechnicalIndicators(recentData);
    const lastClose = recentData[recentData.length - 1].close;
    const direction = predictedValue > lastClose ? 'bullish' : 'bearish';
    
    // Calculate confidence based on technical indicators and prediction
    const confidence = this.calculateConfidence(technicalIndicators, direction);
    
    // Predict reversal date (5 days from now for demo)
    const reversalDate = new Date();
    reversalDate.setDate(reversalDate.getDate() + 5);

    return {
      date: reversalDate.toISOString().split('T')[0],
      confidence,
      direction
    };
  }

  private calculateConfidence(indicators: TechnicalIndicators, direction: 'bullish' | 'bearish'): number {
    let confidence = 50; // Base confidence

    // RSI signals
    if (direction === 'bullish' && indicators.rsi < 30) confidence += 15;
    if (direction === 'bearish' && indicators.rsi > 70) confidence += 15;

    // MACD signals
    if (direction === 'bullish' && indicators.macd > 0) confidence += 10;
    if (direction === 'bearish' && indicators.macd < 0) confidence += 10;

    // Trend signals
    if (indicators.ema > indicators.sma && direction === 'bullish') confidence += 10;
    if (indicators.ema < indicators.sma && direction === 'bearish') confidence += 10;

    return Math.min(confidence, 100);
  }

  async trainModel(trainingData: StockData[]): Promise<void> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    // Prepare training data
    const normalizedData = this.normalizeData(trainingData);
    const labels = tf.tensor2d(trainingData.map(d => [d.close]));

    // Train model
    await this.model.fit(normalizedData, labels, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs?.loss}`);
        }
      }
    });
  }
} 