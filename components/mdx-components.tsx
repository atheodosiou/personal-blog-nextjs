import Image from "next/image";
import * as runtime from "react/jsx-runtime";
import { cache } from "react";
import { Callout } from "./callout";

const getMDXComponent = cache((code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
});

const components = {
  Image,
  Callout,
};

interface MdxProps {
  code: string;
}

export function MDXContent({ code }: MdxProps) {
  const Component = getMDXComponent(code);
  // Server-rendered MDX is cached by its source; it has no client component state.
  // eslint-disable-next-line react-hooks/static-components
  return <Component components={components} />;
}
