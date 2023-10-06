import {TCreateEcmpt} from "./type";

export interface Ecmpt {
    name?: string,
    template?: string
    props?: { [key: string]: any } & { children?: string[] },
    slots?: { [key: string]: string } & {title?: string},
    slot?: [],
    render?: TCreateEcmpt
}