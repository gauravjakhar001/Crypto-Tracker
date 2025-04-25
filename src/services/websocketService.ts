import { CryptoAsset } from '../types/crypto';

class WebSocketService {
  private static instance: WebSocketService;
  private interval: NodeJS.Timeout | null = null;
  private subscribers: ((assets: CryptoAsset[]) => void)[] = [];

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  subscribe(callback: (assets: CryptoAsset[]) => void) {
    this.subscribers.push(callback);
  }

  unsubscribe(callback: (assets: CryptoAsset[]) => void) {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
  }

  start(initialAssets: CryptoAsset[]) {
    if (this.interval) return;

    this.interval = setInterval(() => {
      const updatedAssets = initialAssets.map(asset => ({
        ...asset,
        price: this.getRandomPrice(asset.price),
        change1h: this.getRandomChange(),
        change24h: this.getRandomChange(),
        change7d: this.getRandomChange(),
        volume24h: this.getRandomVolume(asset.volume24h),
      }));

      this.subscribers.forEach(callback => callback(updatedAssets));
    }, 2000);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private getRandomPrice(currentPrice: number): number {
    const change = (Math.random() - 0.5) * 0.02; // ±2% change
    return currentPrice * (1 + change);
  }

  private getRandomChange(): number {
    return (Math.random() - 0.5) * 10; // ±5% change
  }

  private getRandomVolume(currentVolume: number): number {
    const change = (Math.random() - 0.5) * 0.1; // ±10% change
    return currentVolume * (1 + change);
  }
}

export default WebSocketService; 