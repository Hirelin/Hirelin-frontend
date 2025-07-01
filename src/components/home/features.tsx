import React from "react";
import FeatureItem from "./feature-item";
import { features } from "./feature-list";

export default function Features() {
  return (
    <section
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl"
      id="features"
    >
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12">
        Features That Transform Your Career Journey
      </h2>

      <div className="relative">
        {/* Timeline line - hidden on small screens */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 hidden sm:block"></div>

        {/* Feature items */}
        <div className="space-y-16 sm:space-y-24">
          {features.map((feature, index) => (
            <FeatureItem
              key={feature.id}
              title={feature.title}
              description={feature.description}
              imageUrl={feature.imageUrl}
              isEven={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
