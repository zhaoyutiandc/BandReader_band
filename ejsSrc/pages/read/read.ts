import {Ecmpt} from "../../types/Ecmpt";
import {tool, toSrc} from "../../compontent/Tool";
import {eRender} from "../../types/ERender";
import {createTopBar} from "../../compontent/TopBar/TopBar";
import {versionName} from "../../../src/manifest.json";
import {ejsCmptTemplate} from "../../types/type";

export interface TReadEcmpt extends Ecmpt {

}

export const createReadPage =async (ecmpt: TReadEcmpt): Promise<TReadEcmpt> => {
    let ux = tool.vue2ux(__dirname)
    const page = {
        ...ecmpt,
        template: ejsCmptTemplate,
        props: {
            children: [
                ux,
            ],
        },
        slots: {

        },
    }
    await toSrc(__filename, page)
    return page
}