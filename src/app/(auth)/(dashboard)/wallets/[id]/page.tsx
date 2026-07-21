import WalletDetailsPageClient from './WalletDetailsPageClient'

interface PageProps {
    params: Promise<{
        id: string;
    }>;
    searchParams: Promise<{
        provider?: string;
        network?: string;
    }>;
}

export default async function Page({ params, searchParams }: PageProps) {
    const { id } = await params;
    const { provider, network } = await searchParams;
    return <WalletDetailsPageClient id={id} provider={provider} network={network} />;
}
