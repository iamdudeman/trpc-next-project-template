import type { AppType } from "next/app";
import { trpc } from "@trpc";
import { AppPropsType } from "next/dist/shared/lib/utils";

const MyApp: AppType = ({ Component, pageProps }: AppPropsType) => {
  return <Component {...pageProps} />;
};

export default trpc.withTRPC(MyApp);
