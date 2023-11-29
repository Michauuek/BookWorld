import { Slider, TextField } from "@mui/material";
import { useState } from "react";


interface DeleteButtonProps {
    onClick: () => void;
    children: React.ReactNode;
}

const DeleteButton = (props: DeleteButtonProps) => {
    return (
        <div className="delete-button">
        {props.children}
        <button onClick={props.onClick}>
            x
        </button>
        </div>
    );
}

interface TextSearchProps {
    value: string;
    placeholder?: string;
    onChange: (value: string|undefined) => void;
}

    

export const TextSearch = (props: TextSearchProps) => {
    const [value, setValue] = useState<string|undefined>(props.value);
    
    return (
        <DeleteButton
            onClick={() => {
                setValue(undefined);
                props.onChange(undefined);
            }}
        >
        <TextField
            placeholder={props.placeholder}
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
                props.onChange(e.target.value);
            }}
        />
        </DeleteButton>
    );
}

interface RangeSearchProps {
    valuelow: number;
    valuehigh: number;
    min: number;
    max: number;
    onChange: (l: number|undefined, h: number|undefined) => void;
}


// slider
export const RangeSearch = (props: RangeSearchProps) => {
    const [value, setValue] = useState([props.valuelow, props.valuehigh]);

    const handleChange = (event: any, newValue: number|number[]) => {
        let [low, high] = newValue as number[];
        setValue([low, high]);
        props.onChange(low, high);
    };

    return (
        <DeleteButton
        onClick={() => {
            setValue([1,5]);
            props.onChange(undefined, undefined);
        }}
        >
        <Slider
            value={value}
            onChange={(e) => {}}
            onChangeCommitted={handleChange}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            min={props.min}
            max={props.max}
        />
        </DeleteButton>
    );
};

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