import { useState, useEffect } from "react";


export const DateColumnFilter = ({ column }: { column: any }) => {
  const [val, setVal] = useState((column.getFilterValue() as string) || "");

  useEffect(() => {
    setVal((column.getFilterValue() as string) || "");
  }, [column.getFilterValue()]);

  return (
    <input
      type="date"
      style={{
        width: "100%",
        padding: "4px 0",
        border: "none",
        borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
        background: "transparent",
        outline: "none",
        color: "inherit",
        fontSize: "0.875rem"
      }}
      value={val}
      onChange={(e) => {
        const newValue = e.target.value;
        setVal(newValue);
        if (newValue.length === 10 || newValue === "") {
          column.setFilterValue(newValue);
        }
      }}
    />
  );
};
