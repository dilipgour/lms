import { createEdgeStoreExpressHandler } from '@edgestore/server/adapters/express';
import { initEdgeStore } from '@edgestore/server';
import { initEdgeStoreClient } from '@edgestore/server/core';

const es = initEdgeStore.create();
const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket(),
});

export const handler = createEdgeStoreExpressHandler({
  router: edgeStoreRouter,
});
export const backendClient = initEdgeStoreClient({
  router: edgeStoreRouter,
});



