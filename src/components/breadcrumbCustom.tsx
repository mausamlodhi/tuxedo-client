import Link from "next/link";

interface BreadcrumbProps {
  title: string;
  items: { label: string; href?: string }[];
}

const BreadcrumbCustom: React.FC<BreadcrumbProps> = ({ title, items }) => {
  return (
    <div className="bg-[#F2F2F2] py-4 px-6">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="font-advent text-xl font-bold mb-1 uppercase">
          {title}
        </h1>
        <p className="text-xs text-black/80">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <span key={index}>
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "font-medium" : ""}>
                    {item.label}
                  </span>
                )}
                {!isLast && " / "}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
};
export default BreadcrumbCustom;
