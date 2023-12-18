import NodeGeocoder, { Options } from 'node-geocoder';
import { config } from 'dotenv';

config({ path: './config/config.env' });

const options: Options = {
  provider: 'mapquest',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

export const geocoder = NodeGeocoder(options);
