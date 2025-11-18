import React from "react";
import CardSwap, { Card } from "../components/CardSwap";
import ProductCard from "../components/ProductCard";

export default function FeaturedCollection({ products }) {
  const featuredProducts = products.slice(0, 6);

  return (
    <section className="py-16 px-6 md:px-20">
      <h2 className="text-3xl md:text-4xl font-bold font-serifFancy text-brand-navy text-center mb-10">
        Featured Collection
      </h2>

      <div className="w-full flex justify-center">
        <CardSwap
          width="100%"
          height={400}
          cardDistance={50}
          verticalDistance={15}
          delay={800} // faster animation
          skewAmount={6}
          pauseOnHover={false}
        >
          {featuredProducts.map((product) => (
            <Card key={product._id}>
              <ProductCard product={product} />
            </Card>
          ))}
        </CardSwap>
      </div>
    </section>
  );
}
