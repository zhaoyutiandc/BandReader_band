import {Ecmpt} from "../../types/Ecmpt";
import {tool} from "../Tool";

export interface TTopBarEcmpt extends Ecmpt {
    props: {
        title: string,
        operation?: ('back' | 'close' | 'more')[],
    },
    slots?: {title: string},
}

export const createTopBar = (ecmpt: TTopBarEcmpt): TTopBarEcmpt => {
    let ux = tool.vue2ux(__dirname)
    return {
        ...ecmpt,
        template: ux,
        props: {
            ...ecmpt.props,
        },
        slots:{title:ecmpt.props.title}
    }
}