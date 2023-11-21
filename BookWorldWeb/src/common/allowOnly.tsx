import { useAuth } from "./auth";

interface AllowOnlyProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    allowed: ("USER"|"ADMIN"|null)[];
}

export const AllowOnly = (props: AllowOnlyProps) => {
    const { user } = useAuth();
    
    if (props.allowed.includes(user?.role)) {
        return props.children;
    }

    return props.fallback;
}

export const AllowAdmins = (props: {children: React.ReactNode}) => {
    return <AllowOnly allowed={["ADMIN"]} {...props} />
}


export const AllowLoged = (props: {children: React.ReactNode}) => {
    return <AllowOnly allowed={["ADMIN", "USER"]} {...props} />
}

