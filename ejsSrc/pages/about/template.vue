<template>
  <div class="page-cmpt">
    <slot name="topBar"></slot>
    <div style="width: 100%">
      <image src="/common/icon.png" style="height: 140px;width: 140px;object-fit: contain"></image>
      <div class="col" style="margin-left: 8px;margin-top: 8px">
        <text style="font-size: 44px;font-weight: bold">BandReader</text>
        <text class="font-gray" style="margin-top: 4px"><slot name="version"></slot></text>
      </div>
    </div>
    <div class="col" style="margin-top: 18px;padding-left: 12px">
      <text class="line font-gray">参与开发的人员</text>
      <text class="line ">@zhaoyutiandc</text>
      <text class="line ">@xinghengCN</text>
      <text class="line font-gray">更多资源请访问</text>
      <text class="line ">bandbbs.cn</text>
    </div>
  </div>
</template>
<script>
import router from '@system.router'
export default {
  private: {
    pageTitle: '关于',
  },
  back() {
    router.back()
  },
}
</script>
<style>
@import '../../common/app.css';
.line{
  margin-bottom: 8px;
  font-size: 48px;
}
</style>