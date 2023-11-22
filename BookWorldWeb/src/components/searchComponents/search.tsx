import { useState } from "react";


interface TextSearchProps {
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
}


export const TextSearch = (props: TextSearchProps) => {
    const [value, setValue] = useState(props.value);

    return (
        <div className="text-search">
            <input
                type="text"
                placeholder={props.placeholder}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    props.onChange(e.target.value);
                }}
            />
        </div>
    );
}

interface RangeSearchProps {
    value: number;
    min: number;
    max: number;
    onChange: (value: number) => void;
}


// slider
export const RangeSearch = (props: RangeSearchProps) => {
    const [value, setValue] = useState(props.value);

    return (
        <div className="range-search">
            <input
                type="range"
                min={props.min}
                max={props.max}
                value={value}
                onChange={(e) => {
                    setValue(Number(e.target.value));
                    props.onChange(Number(e.target.value));
                }}
                />
        </div>
    );
}


interface SelectSearchProps {
    value: string;
    options: string[];
    onChange: (value: string) => void;
}

export const SelectSearch = (props: SelectSearchProps) => {
    return (
        <div className="select-search">
            <select
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
            >
                <option value="">All</option>
                {props.options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}


export type Sort = {
    [key: string]: "asc" | "desc";
}


// This component will allow to choose the columns to sort by
// and the order of the sorting
interface SortingProps {
    avalibleColumns: string[];
    onChange: (value: Sort[]) => void;
}

export const Sorting = (props: SortingProps) => {
    const [sorts, setSorts] = useState<Sort[]>([]);

    const addSort = () => {
        const newSorts = [...sorts];
        newSorts.push({ [props.avalibleColumns[0]]: "asc" });
        setSorts(newSorts);
    };

    const removeSort = (index: number) => {
        const newSorts = [...sorts];
        newSorts.splice(index, 1);
        setSorts(newSorts);
    };

    const changeSort = (index: number, column: string, order: "asc" | "desc") => {
        const newSorts = [...sorts];
        const currentSort = newSorts[index];
        const currentColumn = Object.keys(currentSort)[0];
        const currentOrder = Object.values(currentSort)[0] as "asc" | "desc";
    
        if (column !== currentColumn) {
            newSorts[index] = { [column]: currentOrder };
        } else if (order !== currentOrder) {
            newSorts[index] = { [currentColumn]: order };
        }
    
        setSorts(newSorts);
    };

    return (
        <div className="sorting">
            {sorts.map((sort, index) => (
                <div className="sort" key={index}>
                    <select
                        value={Object.keys(sort)[0] || ""}
                        onChange={(e) => changeSort(index, e.target.value, Object.values(sort)[0])}
                    >
                        <option value="">None</option>
                        {props.avalibleColumns.map((column) => (
                            <option key={column} value={column}>
                                {column}
                            </option>
                        ))}
                    </select>
                    <select
                        value={Object.values(sort)[0] || ""}
                        onChange={(e) => changeSort(index, Object.keys(sort)[0], e.target.value as "asc" | "desc")}
                    >
                        <option value="asc">ASC</option>
                        <option value="desc">DESC</option>
                    </select>
                    <button onClick={() => removeSort(index)}>X</button>
                </div>
            ))}
            <button onClick={addSort}>Add sort</button>
            <button onClick={() => props.onChange(sorts)}>Apply</button>
        </div>
    );
}