import RootShell, { rootMetadata } from "@/app/_shared/root-shell";

export const metadata = rootMetadata;

export default function JaRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootShell lang="ja">{children}</RootShell>;
}
