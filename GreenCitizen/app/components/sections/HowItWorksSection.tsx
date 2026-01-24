export default function HowItWorksSection() {
return (
<section id="how-it-works" className="py-20 bg-muted">
<div className="mx-auto max-w-6xl px-6">
<h2 className="text-3xl font-semibold text-center">How It Works</h2>
<div className="mt-12 grid gap-8 md:grid-cols-3">
<Step title="Take Action" description="Recycle, save energy, plant trees." />
<Step title="Earn Points" description="Log actions and gain eco-points." />
<Step title="Get Rewards" description="Unlock badges and local incentives." />
</div>
</div>
</section>
);
}


function Step({ title, description }: { title: string; description: string }) {
return (
<div className="rounded-xl border bg-white p-6 text-center">
<h3 className="font-medium">{title}</h3>
<p className="mt-2 text-sm text-muted-foreground">{description}</p>
</div>
);
}