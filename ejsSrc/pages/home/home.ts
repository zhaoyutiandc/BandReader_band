import {Ecmpt} from "../../types/Ecmpt";
import {tool, toSrc} from "../../compontent/Tool";
import {ejsCmptTemplate} from "../../types/type";
import {createTopBar} from "../../compontent/TopBar/TopBar";
import {eRender} from "../../types/ERender";

export interface THomePage extends Ecmpt {
    props?: Ecmpt['props'] & {
        topBar?: string,
    }
}

export const createHomePage = async (ecmpt: THomePage): Promise<THomePage> => {
    let ux = tool.vue2ux(__dirname)
    //await eRender(await createTestPage({}))
    const page = {
        ...ecmpt,
        template: ejsCmptTemplate,
        props: {
            children: [
                ux,
            ],
        },
        slots: {
            topBar: await eRender(createTopBar({props: {title: '书架'}})),
        },
    }
    //__dirname + 当前文件名
    await toSrc(__filename, page)
    return page
}