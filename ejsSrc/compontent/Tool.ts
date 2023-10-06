import {Ecmpt} from "../types/Ecmpt";
import {eRender} from "../types/ERender";

const fs = require('fs')
const path = require('path')

export const tool = {
    vue2ux:(dir:any)=>{
        let vue = fs.readFileSync(dir + '/template.vue').toString()
        // 将 v-if="xxx" 替换成 if="{{xxx}}"
        const regex1 = /v-if="(.+?)"/g;
        vue = vue.replace(regex1, 'if="{{$1}}"');
        // 将类似  /**
        //    * @type import('../../types/type.ts').TPage
        //    */ 的jsdoc注释替换成空
        const regex2 = /\/\*\*[\s\S]*?\*\//g;
        vue = vue.replace(regex2, '');
        // 将 v-else 替换成 else
        const regex3 = /v-else/g;
        vue = vue.replace(regex3, 'else');
        /*// 将 v-for 替换成 for
        const regex2 = /v-for/g;
        vue = vue.replace(regex2, 'for');
        // 将 v-else 替换成 else
        const regex3 = /v-else/g;
        vue = vue.replace(regex3, 'else');
        // 将 v-else-if 替换成 elif
        const regex4 = /v-else-if/g;
        vue = vue.replace(regex4, 'elif');
        // 将 v-if 替换成 if
        const regex5 = /v-if/g;
        vue = vue.replace(regex5, 'if');
        // 将 v-on 替换成 on
        const regex6 = /v-on/g;
        vue = vue.replace(regex6, 'on');*/
        return vue;
    }
}

export const toSrc =async (ejsPath:any,ecmpt:Ecmpt)=>{
    const normalPath=path.normalize(ejsPath)
    let ux = await eRender(ecmpt)
    //将path中的ejs替换成src
    let srcPath = ejsPath.replace(/\.ts/g, '.ux')
    srcPath = srcPath.replace('ejsSrc','src')
    let srcDir = path.dirname(srcPath)
    if (!fs.existsSync(srcDir)) {
        // 创建目录
        fs.mkdirSync(srcDir);
    }
    fs.writeFileSync(srcPath, ux)


}