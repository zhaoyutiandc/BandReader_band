import {Ecmpt} from "../../types/Ecmpt";
import {tool, toSrc} from "../../compontent/Tool";
import {eRender} from "../../types/ERender";
import {createTopBar} from "../../compontent/TopBar/TopBar";
import {versionName} from "../../../src/manifest.json";
import {ejsCmptTemplate} from "../../types/type";

export interface TListEcmpt extends Ecmpt {

}

export const createListPage =async (ecmpt: TListEcmpt): Promise<TListEcmpt> => {
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
            topBar: await eRender(createTopBar({props: {title: '章节'}})),
            version: versionName,
        },
    }
    await toSrc(__filename, page)
    return page
}