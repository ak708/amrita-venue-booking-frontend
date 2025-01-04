import React, { FC, PropsWithChildren } from "react";

const WeekViewEventGrid: FC<PropsWithChildren> = ({ children }) => {
    return (
        <ol
            className="col-start-1 col-end-2 row-start-1 grid grid-cols-7 pr-8 select-none"
            style={{
                gridTemplateRows: "1.75rem repeat(1440, 1.2px) auto",
            }}
        >
            {children}
        </ol>
    );
};

export default WeekViewEventGrid;
