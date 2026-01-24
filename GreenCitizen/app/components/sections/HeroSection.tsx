import Link from 'next/link';


export default function HeroSection() {
return (
<section className="py-24 text-center">
<div className="mx-auto max-w-3xl px-6">
<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
Turn Climate Action into Community Impact
</h1>
<p className="mt-6 text-lg text-muted-foreground">
Track eco-friendly actions, earn points, and build greener communities together.
</p>
<div className="mt-8 flex justify-center gap-4">
<Link href="/auth/register" className="rounded-lg bg-green-600 px-6 py-3 text-white">
Get Started
</Link>
<Link href="#how-it-works" className="rounded-lg border px-6 py-3">
Learn More
</Link>
</div>
</div>
</section>
);
}