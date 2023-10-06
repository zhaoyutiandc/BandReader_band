import {Ecmpt} from "./Ecmpt";
const ejs = require('ejs')
const prettier = require("prettier");
export const eRender = async <T extends Ecmpt>(ecmpt: T) => {
    let res = ejs.render(ecmpt.template, ecmpt.props)
    //将res中 <slot name="topBar"></slot> 先匹配到 slots 中的 topBar 然后用ecmpt.slots.topBar 替换
    for (let key in ecmpt.slots) {
        res = res.replace(new RegExp(`<slot name="${key}"></slot>`, 'g'), ecmpt.slots[key])
    }
    res = await prettier.format(res, {parser: "html"});
    //去除 blank line
    res = res.replace(/^\s*[\r\n]/gm, '')
    return res
}