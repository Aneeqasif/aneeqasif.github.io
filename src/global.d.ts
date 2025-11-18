import type { AstroIntegration } from "@swup/astro";

declare global {
  interface Window {
    // type from '@swup/astro' is incorrect
    swup: AstroIntegration;
    pagefind: {
      search: (query: string) => Promise<{
        results: Array<{
          data: () => Promise<SearchResult>;
        }>;
      }>;
    };
    PondPilot: {
      config: (options: Record<string, unknown>) => Record<string, unknown>;
      init: (
        selector?: string | Element | Element[] | NodeList,
        overrides?: Record<string, unknown>
      ) => void;
      create?: (
        target: string | Element | Element[] | NodeList,
        overrides?: Record<string, unknown>
      ) => unknown;
      registerTheme?: (
        name: string,
        definition: { extends?: string; config: Record<string, unknown> }
      ) => void;
      getConfig?: () => Record<string, unknown>;
      destroy?: (target?: string | Element | Element[] | NodeList) => void;
    };
    PONDPILOT_DB_FILE?: string;
    // Session-scoped PondPilot state (persists across Swup navigations)
    __PONDPILOT_DUCKDB_MODULE__?: Promise<unknown>;
    __PONDPILOT_DUCKDB_INSTANCE__?: Promise<unknown>;
    __PONDPILOT_LAST_DB_PATH__?: string;
  }
}

declare module "https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.31.1-dev1.0/+esm" {
  export function getJsDelivrBundles(): unknown;
  export function selectBundle(bundles: unknown): Promise<{
    mainWorker: string;
    mainModule: string;
    pthreadWorker: string;
  }>;
  export class ConsoleLogger {
    constructor(level: number);
  }
  export const LogLevel: { WARNING: number };
  export class AsyncDuckDB {
    constructor(logger: unknown, worker: Worker);
    instantiate(mainModule: string, pthreadWorker: string): Promise<void>;
    registerFileURL(
      name: string,
      url: string,
      protocol: number,
      force: boolean
    ): Promise<void>;
    open(config: { path: string }): Promise<void>;
    connect(): Promise<unknown>;
  }
  export const DuckDBDataProtocol: { HTTP: number };
}

interface SearchResult {
  url: string;
  meta: {
    title: string;
  };
  excerpt: string;
  content?: string;
  word_count?: number;
  filters?: Record<string, unknown>;
  anchors?: Array<{
    element: string;
    id: string;
    text: string;
    location: number;
  }>;
  weighted_locations?: Array<{
    weight: number;
    balanced_score: number;
    location: number;
  }>;
  locations?: number[];
  raw_content?: string;
  raw_url?: string;
  sub_results?: SearchResult[];
}
