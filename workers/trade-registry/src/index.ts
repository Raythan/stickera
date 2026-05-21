export { TradeRegistryDO } from './registry';

export interface Env {
  REGISTRY: DurableObjectNamespace;
  ALLOWED_ORIGINS?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const id = env.REGISTRY.idFromName('global');
    const stub = env.REGISTRY.get(id);
    return stub.fetch(request);
  },
};
