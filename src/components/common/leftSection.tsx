import Image from "next/image";
import React from "react";
import VipLogoSection from "./vipLogo";

interface AuthLeftSectionProps {
  imageSrc: string;
}

const AuthLeftSection: React.FC<AuthLeftSectionProps> = ({ imageSrc }) => {
  return (
    <div className="relative w-full h-full">
      {/* Mobile logo */}
      <div className="absolute top-3 left-3 z-10 lg:hidden">
        <VipLogoSection />
      </div>

      {/* Image wrapper */}
      <div className="relative w-full h-full min-h-[400px] lg:min-h-[600px]">
        <Image
          src={imageSrc}
          alt="Model"
          fill
          quality={100}
          priority
          className="object-cover object-top"
        />
      </div>
    </div>
  );
};

export default AuthLeftSection;
