import Image from "next/image";
import Link from "next/link";
import React from "react";

const VipLogoSection: React.FC = () => {
  return (
    <div className="flex items-center">
      <Link href="/" className="block">
        <Image
          src="/assets/SVG/icons/logo.svg"
          alt="VIP Logo"
          width={60}
          height={45}
          className="w-12 h-auto sm:w-14 md:w-16 lg:w-20"
          priority
        />
      </Link>
    </div>
  );
};

export default VipLogoSection;
