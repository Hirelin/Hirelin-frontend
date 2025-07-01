import React from "react";
import Image from "next/image";

interface FeatureItemProps {
  title: string;
  description: string;
  imageUrl: string;
  isEven: boolean;
}

export default function FeatureItem({
  title,
  description,
  imageUrl,
  isEven,
}: FeatureItemProps) {
  return (
    <div className="relative">
      <div
        className={`flex flex-col sm:flex-row items-center gap-6 ${
          isEven ? "" : "sm:flex-row-reverse"
        }`}
      >
        {/* Content */}
        <div className="w-full sm:w-1/2 p-4 sm:p-6">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            {description}
          </p>
        </div>

        {/* Image */}
        <div className="w-full sm:w-1/2 p-4 sm:p-6">
          <div className="relative h-48 sm:h-64 md:h-80 rounded-lg overflow-hidden shadow-lg bg-background flex items-center justify-center">
            <Image
              src={imageUrl}
              alt={title}
              width={300}
              height={300}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                padding: "1rem",
              }}
              priority
            />
          </div>
        </div>
      </div>

      {/* Timeline dot - hidden on small screens */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 sm:w-5 sm:h-5 rounded-full bg-primary z-10 hidden sm:block"></div>
    </div>
  );
}
