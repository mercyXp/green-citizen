import Hero from '@/app/components/landing/Hero';
import ForCitizens from '@/app/components/landing/ForCitizens';
import ForPartners from '@/app/components/landing/ForPartners';
import DataTypes from '@/app/components/landing/DataTypes';
import Trust from '@/app/components/landing/Trust';
import CTA from '@/app/components/landing/CTA';
import Footer from '@/app/components/landing/Footer';
import Header from '@/app/components/landing/Header';


export default function LandingPage() {
    return (
        <main className="flex flex-col min-h-screen bg-bg-primary">
            <Header />
            <Hero />
            <ForCitizens />
            <ForPartners />
            <DataTypes />
            <Trust />
            <CTA />
            <Footer />
        </main>
    );
}
//This page serves as the landing page for the GreenCitizen application, showcasing various sections about the platform.