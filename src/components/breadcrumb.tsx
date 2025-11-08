"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumb = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <div className="bg-[#F2F2F2] px-6">
      <div className="max-w-screen-xl mx-auto">
        {/* Title = last segment */}
        <h1 className="font-advent text-xl font-bold mb-1 break-words whitespace-normal">
          {pathSegments.length > 0
            ? decodeURIComponent(pathSegments[pathSegments.length - 1]).replace(/-/g, " ").toUpperCase()
            : "HOME"}
        </h1>

        {/* Breadcrumb navigation */}
        <p className="text-xs text-black/80 break-words whitespace-normal">
          <Link href="/" className="hover:underline">
            HOME
          </Link>
          {pathSegments.map((segment, index) => {
            const href = "/" + pathSegments.slice(0, index + 1).join("/");
            const isLast = index === pathSegments.length - 1;
            const label = decodeURIComponent(segment).replace(/-/g, " ").toUpperCase();

            return (
              <span key={href}>
                {" / "}
                {isLast ? (
                  <span className="font-medium">{label}</span>
                ) : (
                  <Link href={href} className="hover:underline">
                    {label}
                  </Link>
                )}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
};

export default Breadcrumb;
