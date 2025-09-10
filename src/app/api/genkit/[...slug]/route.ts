import {createApp} from '@genkit-ai/next';

// Make sure to import this to register your flows.
import '@/ai/dev'; 

export const {GET, POST} = createApp();
