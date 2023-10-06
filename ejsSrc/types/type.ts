import {Ecmpt} from "./Ecmpt";

export const ejsCmptTemplate = `
<% if (children) { %>
    <% children.forEach(function(child){ %>
    <%-  child %>
    <% }); %>
    <% } %>
`
export const ejsPageTemplate = `
<template>
<% if (children) { %>
    <% children.forEach(function(child){ %>
    <%-  child %>
    <% }); %>
    <% } %>
</template>
`

export type TCreateEcmpt = <T extends Ecmpt>(ecmpt: T) =>  T

export type TPage = {
    onInit?: () => void,
    onShow?: () => void,
    onHide?: () => void,
    onReady?: () => void,
    onDestory?: () => void,
    onBackPress?: () => void,
}