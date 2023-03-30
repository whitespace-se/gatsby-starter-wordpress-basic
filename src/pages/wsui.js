/** @jsx jsx */
import {
  // css,
  jsx,
} from "@emotion/react";
import { Button, ThemeDebugger } from "@wsui/base";

export default function WsuiPage() {
  return (
    <div>
      <h1>WSUI</h1>
      <details>
        <summary>Theme</summary>
        <ThemeDebugger />
      </details>
      <h2>Components</h2>
      <Button onClick={() => {}}>Lorem ipsum</Button>
    </div>
  );
}
