'use client'

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supportService, FAQ } from '@/services/support.service';
import { FAQSection } from './FAQSection';
import { QuickLinks } from './QuickLinks';

export const FAQView: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const faqsQuery = useQuery({
        queryKey: ['faqs', selectedCategory],
        queryFn: () => supportService.getFAQs(selectedCategory === 'all' ? undefined : selectedCategory)
    });

    const linksQuery = useQuery({
        queryKey: ['supportLinks'],
        queryFn: () => supportService.getLinks()
    });

    const faqList: FAQ[] = faqsQuery.data?.success && Array.isArray(faqsQuery.data.data) ? faqsQuery.data.data : [];
    const linksList = linksQuery.data?.success && Array.isArray(linksQuery.data.data) ? linksQuery.data.data : [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-in fade-in duration-200">
            <FAQSection
                faqList={faqList}
                isLoading={faqsQuery.isLoading}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <QuickLinks
                links={linksList}
                isLoading={linksQuery.isLoading}
            />
        </div>
    );
};

export default FAQView;
