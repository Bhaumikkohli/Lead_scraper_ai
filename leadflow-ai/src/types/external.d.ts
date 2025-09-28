declare module "react-simple-maps";
declare module "react-grid-layout/css/styles.css";
declare module "react-resizable/css/styles.css";

declare module "swr" {
  export default function useSWR(key: string, fetcher: (key: string) => Promise<any>, opts?: any): { data?: any; error?: any; mutate: any };
}

