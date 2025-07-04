import { http, createConfig } from 'wagmi';
import { sepolia, worldchain } from 'wagmi/chains';

export const config = createConfig({
  chains: [worldchain],
  transports: {
    [worldchain.id]: http(process.env.NEXT_PUBLIC_WORLDCHAIN_RPC || ''),
  },
}); 