import React from "react";

interface Column {
  key: string;
  header: string | (() => React.ReactNode);
  render?: (value: any, row: any) => string | (() => React.ReactNode);
  type?: string;
}

interface Props {
  columns: any[];
  data: any[];
  theme?: boolean | object;
  loading?: boolean;
  onView?: (id: number) => void;
  onEdit?: (data: any) => void;
  onDelete?: (id: number) => void;
}

const CommonTable: React.FC<Props> = ({ columns, data, theme = true, onView, onEdit, onDelete,loading }) => {
  const styles = theme
    ? {
      container: "bg-[#F4F4F4] border-[#CED6D3]",
      header: "bg-[#F4F4F4] border-[#CED6D3] text-[#142531]",
      row: "hover:bg-[#EEEEEE] text-[#142531] border-[#ccc]",
      body: "bg-[#FFFFFF]",
      flaggedBtn: "bg-[#10223A] text-blue-400",
    }
    : {
      container: "bg-[#313A46] border-[#334155]",
      header: "bg-[#2D333C] border-[#334155] text-[#F1F5F9]",
      row: "hover:bg-[#2F3742] text-[#E2E8F0] border-[#475569]",
      body: "bg-[#334155]",
      flaggedBtn: "bg-[#0F172A] text-teal-400",
    };

  return (
    <div
      className={`w-full backdrop-blur-3xl border-none z-0 border-[1.2px] overflow-hidden ${styles.container}`}
    >
      <div className="max-h-[60vh] overflow-y-auto custom-scroll rounded-t-xl">
        <table className={`w-full table-auto ${styles.container}`}>
          {/* Table Header */}
          <thead className={`sticky top-0 z-10 border-b-[1.2px] ${styles.header}`}>
            <tr>
              {columns.map((column: any, index: number) => (
                <th
                  key={column.key || index}
                  className="px-4 py-4 font-medium text-[16px] md:text-base whitespace-nowrap"
                >
                  <div className="flex items-start justify-start h-full">
                    <p>
                      {typeof column.header === "function"
                        ? column.header()
                        : column.header}
                    </p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={`font-[poppins] ${styles.body}`}>
            {loading ? (
              // Skeleton Rows aligned with headers
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {columns.map((column, j) => (
                      <td key={j} className="px-4 py-4">
                        <div
                          className={`h-4 flex items-start justify-start rounded-md mx-auto ${
                            // 👇 Different skeleton width per column for realism
                            j % 3 === 0
                              ? "w-24"
                              : j % 3 === 1
                                ? "w-16"
                                : "w-32"
                            } ${theme ? "bg-gray-300" : "bg-gray-600"}`}
                        ></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ) : data?.length ?? 0 > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`transition-colors ${rowIndex !== data.length - 1
                      ? `border-b-[2px] border-dotted ${styles.row}`
                      : styles.row
                    }`}
                >
                  {columns.map((column: any, colIndex: number) => {
                    const cellContent = column.render
                      ? column.render(row[column.key], row)
                      : row[column.key];

                    return (
                      <td
                        key={`${rowIndex}-${colIndex}`}
                        className="px-4 py-6 font-medium text-[14px] md:text-sm whitespace-nowrap"
                      >
                        <div className="flex items-start justify-start h-full">
                          {column.type === "flaggedType" ? (
                            <button
                              className={`px-6 py-2 rounded-lg ${styles.flaggedBtn}`}
                            >
                              {cellContent}
                            </button>
                          ) : (
                            cellContent
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-gray-400"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default CommonTable;
