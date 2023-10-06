import {Ecmpt} from "../../types/Ecmpt";
import {tool, toSrc} from "../../compontent/Tool";
import {eRender} from "../../types/ERender";
import {createTopBar} from "../../compontent/TopBar/TopBar";
import {versionName} from "../../../src/manifest.json";
import {ejsCmptTemplate} from "../../types/type";

export interface TAboutEcmpt extends Ecmpt {

}

export const createAboutPage =async (ecmpt: TAboutEcmpt): Promise<TAboutEcmpt> => {
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
            topBar: await eRender(createTopBar({props: {title: '关于'}})),
            version: versionName,
        },
    }
    await toSrc(__filename, page)
    return page
}