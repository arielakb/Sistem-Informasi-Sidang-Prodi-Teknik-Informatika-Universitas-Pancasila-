import { IApiKampusAdapter } from '../../domain/interfaces/IApiKampusAdapter';
import { MockApiKampusAdapter } from '../http/adapters/MockApiKampusAdapter';
import { RealApiKampusAdapter } from '../http/adapters/RealApiKampusAdapter';

// Baca langsung dari process.env tanpa zod validation untuk check ini
const NODE_ENV = process.env.NODE_ENV || 'development';
const API_KEY = process.env.API_KAMPUS_API_KEY || '';

export class DIContainer {
  private static instance: DIContainer;
  private apiKampusAdapter: IApiKampusAdapter;

  private constructor() {
    // Check apakah menggunakan mock (development + key mengandung "placeholder" atau kosong)
    const isMock = NODE_ENV === 'development' && 
                   (API_KEY === '' || 
                    API_KEY.includes('placeholder') || 
                    API_KEY === 'your-api-key' ||
                    API_KEY === 'placeholder-key');
    
    if (isMock) {
      console.log('🧪 Using MockApiKampusAdapter for development');
      this.apiKampusAdapter = new MockApiKampusAdapter();
    } else {
      console.log('🌐 Using RealApiKampusAdapter');
      this.apiKampusAdapter = new RealApiKampusAdapter();
    }
  }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  getApiKampusAdapter(): IApiKampusAdapter {
    return this.apiKampusAdapter;
  }
}

export const diContainer = DIContainer.getInstance();