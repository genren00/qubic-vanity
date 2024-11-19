import type { Metadata } from "next"
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Index' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}
