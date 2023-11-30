import { AddCircle, Cancel } from "@mui/icons-material";
import { FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Slider, TextField } from "@mui/material";
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
                <Cancel />
            </button>
        </div>
    );
}

interface TextSearchProps {
    value: string;
    placeholder?: string;
    onChange: (value: string | undefined) => void;
}



export const TextSearch = (props: TextSearchProps) => {
    const [value, setValue] = useState<string | undefined>(props.value);
    const [notActive, setNotActive] = useState(false);

    return (
        <DeleteButton
            onClick={() => {
                setValue('');
                props.onChange(undefined);
                setNotActive(true);
            }}
        >
            <TextField
                placeholder={props.placeholder}
                sx={{
                    color: notActive ? "gray" : "#deb887",
                }}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    props.onChange(e.target.value);
                    setNotActive(false);
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
    onChange: (l: number | undefined, h: number | undefined) => void;
}


// slider
export const RangeSearch = (props: RangeSearchProps) => {
    const [value, setValue] = useState([props.valuelow, props.valuehigh]);
    const [notActive, setNotActive] = useState(false);

    const handleChange = (_: any, newValue: number | number[]) => {
        let [low, high] = newValue as number[];
        setValue([low, high]);
        props.onChange(low, high);
        setNotActive(false);
    };

    return (
        <DeleteButton
            onClick={() => {
                setValue([0, 5]);
                props.onChange(undefined, undefined);
                setNotActive(true);
            }}
        >
            <Slider
                value={value}
                onChange={handleChange}
                sx={{
                    color: notActive ? "gray" : "#deb887",
                }}
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
        props.onChange(newSorts);
    };

    const removeSort = (index: number) => {
        const newSorts = [...sorts];
        newSorts.splice(index, 1);
        setSorts(newSorts);
        props.onChange(newSorts);
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
        props.onChange(newSorts);
    };

    return (
        <Grid container direction="row">
            {sorts.map((sort, index) => (
                <Grid item container direction="row" alignItems="center" spacing={2}>
                    <Grid item>
                        <FormControl fullWidth>
                            <InputLabel>Column</InputLabel>
                            <Select
                                size="small"
                                sx={{
                                    width: "100px",
                                }}
                                value={Object.keys(sort)[0] || ""}
                                onChange={(e) => changeSort(index, e.target.value, Object.values(sort)[0])}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {props.avalibleColumns.map((column: any) => (
                                    <MenuItem key={column} value={column}>
                                        {column}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl fullWidth>
                            <InputLabel>Order</InputLabel>
                            <Select
                                size="small"
                                sx={{
                                    width: "100px",
                                }}
                                value={Object.values(sort)[0] || ""}
                                onChange={(e) => changeSort(index, Object.keys(sort)[0], e.target.value as "asc" | "desc")}
                            >
                                <MenuItem value="asc">ASC</MenuItem>
                                <MenuItem value="desc">DESC</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <IconButton size="small" onClick={() => removeSort(index)}>
                            <Cancel />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
            <Grid item xs={12}>
                <IconButton onClick={addSort}>
                    <AddCircle />
                </IconButton>
            </Grid>
        </Grid>
    );
};