import WalletDetailsPageClient from './WalletDetailsPageClient'

interface PageProps {
    params: Promise<{
        id: string;
    }>;
    searchParams: Promise<{
        provider?: string;
    }>;
}

export default async function Page({ params, searchParams }: PageProps) {
    const { id } = await params;
    const { provider } = await searchParams;
    return <WalletDetailsPageClient id={id} provider={provider} />;
}
