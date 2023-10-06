import {Ecmpt} from "../../types/Ecmpt";
import {tool, toSrc} from "../../compontent/Tool";
import {eRender} from "../../types/ERender";
import {createTopBar} from "../../compontent/TopBar/TopBar";
import {versionName} from "../../../src/manifest.json";
import {ejsCmptTemplate} from "../../types/type";

export interface TConfigEcmpt extends Ecmpt {

}

export const createConfigPage =async (ecmpt: TConfigEcmpt): Promise<TConfigEcmpt> => {
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
            topBar: await eRender(createTopBar({props: {title: '设置'}})),
            version: versionName,
        },
    }
    await toSrc(__filename, page)
    return page
}