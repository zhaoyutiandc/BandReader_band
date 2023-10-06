import {Ecmpt} from "./types/Ecmpt";
import {ejsCmptTemplate} from "./types/type";
import {eRender} from "./types/ERender";
import {createTopBar, TTopBarEcmpt} from "./compontent/TopBar/TopBar";

export function main() {
    (async () => {
        const page: Ecmpt = {
            name: 'page',
            template: ejsCmptTemplate,
            props: {
                name: '张三',
                children: [
                    `<text>this is page title</text>`,
                    await eRender<TTopBarEcmpt>(createTopBar({props:{title: 'this is top bar'}})),
                    await eRender({
                        name: 'text',
                        template: ejsCmptTemplate,
                        props: {
                            name: '王五',
                            children: [
                                `<text>this is 王五 text</text>`,
                            ]
                        }
                    }),
                ]
            },
        }
        let res = await eRender(page)
        console.log(res)
    })()
}

// main()