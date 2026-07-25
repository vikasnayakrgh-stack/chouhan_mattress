import { Hero } from './library/Hero';
import { WhyChooseUsSection } from './library/WhyWakefitSection';
import { CategoriesSection } from './library/CategoriesSection';
import { TopSellingProductsSection } from './library/TopSellingProductsSection';

interface SectionProps {
  section: string;
  data: any;
}

export function Section({ section, data }: SectionProps) {
  switch (section) {
    case 'hero':
      return <Hero {...data} title={data.slides?.[0]?.title || ''} backgroundImage={data.slides?.[0]?.backgroundImage || ''} />;
    case 'whyWakefit':
    case 'whyChooseUs':
      return <WhyChooseUsSection data={data} />;
    case 'categories':
      return <CategoriesSection data={data} />;
    case 'topSelling':
      return <TopSellingProductsSection products={data.products || []} headline={data.headline} subheadline={data.subheadline} />;
    default:
      return null;
  }
}