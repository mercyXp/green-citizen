function RewardsSection() {
    return (
        <section className="py-12 bg-green-50"> 
            <div className="mx-auto max-w-6xl px-6">
                <h2 className="text-3xl font-semibold text-center">Rewards</h2>
                <p className="mt-4 text-center text-muted-foreground">
                    Redeem your eco-points for exciting rewards and incentives!
                </p>
                <div className="mt-8 grid gap-6 md:grid-cols-3">
                    <RewardCard title="Eco Badge" pointsRequired={100} description="Earn a special badge for your profile." />
                    <RewardCard title="Discount Voucher" pointsRequired={500} description="Get a discount at local eco-friendly stores." />
                    <RewardCard title="Tree Planting" pointsRequired={1000} description="Sponsor a tree planting in your community." />
                </div>
            </div>
        </section>
    );
}
function RewardCard({ title, pointsRequired, description }: { title: string; pointsRequired: number; description: string }) {
    return (
        <div className="rounded-xl border bg-white p-6 text-center shadow">
            <h3 className="font-medium text-lg">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            <p className="mt-4 font-semibold">{pointsRequired} Points</p>
            <button className="mt-6 rounded-lg bg-green-600 px-4 py-2 text-white">
                Redeem
            </button>
        </div>
    );
}
export default RewardsSection;