import Document, { Head, Html, Main, NextScript } from "next/document";
import { MOUNT_ELE_ID } from "@components/general/modal/Modal";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />

        <body>
          <Main />

          <NextScript />

          <div id={MOUNT_ELE_ID} />
        </body>
      </Html>
    );
  }
}
