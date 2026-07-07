import WalletDetailsPageClient from './WalletDetailsPageClient'

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    return <WalletDetailsPageClient id={id} />;
}
