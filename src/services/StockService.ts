import axios from 'axios';

export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
}

export class StockService {
  private readonly API_KEY = import.meta.env.VITE_STOCK_API_KEY || 'demo_key';
  private readonly BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com/v1';

  async getHistoricalData(symbol: string, days: number = 365): Promise<StockData[]> {
    try {
      const response = await axios.get(`${this.BASE_URL}/historical/${symbol}`, {
        params: {
          days,
          apikey: this.API_KEY
        }
      });

      return response.data.map((item: any) => ({
        date: item.date,
        open: parseFloat(item.open),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        close: parseFloat(item.close),
        volume: parseInt(item.volume)
      }));
    } catch (error) {
      console.error('Error fetching historical data:', error);
      // Return mock data for demonstration
      return this.getMockHistoricalData(days);
    }
  }

  async getQuote(symbol: string): Promise<StockQuote> {
    try {
      const response = await axios.get(`${this.BASE_URL}/quote/${symbol}`, {
        params: {
          apikey: this.API_KEY
        }
      });

      return {
        symbol: response.data.symbol,
        name: response.data.name,
        price: parseFloat(response.data.price),
        change: parseFloat(response.data.change),
        changePercent: parseFloat(response.data.changePercent),
        volume: parseInt(response.data.volume),
        marketCap: parseFloat(response.data.marketCap),
        peRatio: parseFloat(response.data.peRatio)
      };
    } catch (error) {
      console.error('Error fetching quote:', error);
      // Return mock data for demonstration
      return this.getMockQuote(symbol);
    }
  }

  async searchStocks(query: string): Promise<StockQuote[]> {
    try {
      const response = await axios.get(`${this.BASE_URL}/search`, {
        params: {
          q: query,
          apikey: this.API_KEY
        }
      });

      return response.data.map((item: any) => ({
        symbol: item.symbol,
        name: item.name,
        price: parseFloat(item.price),
        change: parseFloat(item.change),
        changePercent: parseFloat(item.changePercent),
        volume: parseInt(item.volume),
        marketCap: parseFloat(item.marketCap),
        peRatio: parseFloat(item.peRatio)
      }));
    } catch (error) {
      console.error('Error searching stocks:', error);
      // Return mock data for demonstration
      return this.getMockSearchResults(query);
    }
  }

  private getMockHistoricalData(days: number): StockData[] {
    const data: StockData[] = [];
    const basePrice = 67.46;
    const date = new Date();
    date.setDate(date.getDate() - days);

    for (let i = 0; i < days; i++) {
      const volatility = 0.02; // 2% daily volatility
      const dailyChange = (Math.random() - 0.5) * volatility * basePrice;
      const open = basePrice + dailyChange;
      const high = open * (1 + Math.random() * 0.01);
      const low = open * (1 - Math.random() * 0.01);
      const close = (high + low) / 2;

      data.push({
        date: new Date(date.getTime() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 1000000) + 500000
      });
    }

    return data;
  }

  private getMockQuote(symbol: string): StockQuote {
    return {
      symbol,
      name: 'Medico Remedies',
      price: 67.46,
      change: 1.94,
      changePercent: 2.96,
      volume: 2115000,
      marketCap: 8245600000,
      peRatio: 22.45
    };
  }

  private getMockSearchResults(query: string): StockQuote[] {
    return [
      {
        symbol: 'MEDICOREM',
        name: 'Medico Remedies',
        price: 67.46,
        change: 1.94,
        changePercent: 2.96,
        volume: 2115000,
        marketCap: 8245600000,
        peRatio: 22.45
      },
      {
        symbol: 'MEFCOM',
        name: 'Mefcom Capital Markets',
        price: 19.95,
        change: 0.24,
        changePercent: 1.22,
        volume: 1876000,
        marketCap: 1245600000,
        peRatio: 18.75
      }
    ].filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );
  }
} 
