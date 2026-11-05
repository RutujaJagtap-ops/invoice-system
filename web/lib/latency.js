import "server-only";

const LATENCY_MS = Number(process.env.API_DELAY_MS) || 0;

export const simulateLatency = () =>
  LATENCY_MS ? new Promise((resolve) => setTimeout(resolve, LATENCY_MS)) : Promise.resolve();