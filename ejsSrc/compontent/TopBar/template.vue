<div class="app-title" style="margin-bottom: 12px">
  <div style="flex:1;justify-content: flex-start" @click="back">
    <image style="height: 54px;width: 54px" src="/common/left_line.png"></image>
  </div>
  <text style="font-size: 50px">
    <span>{{pageTitle}}</span>
  </text>
  <div style="flex:1;justify-content: flex-end" @click="more">
    <image v-if="showMore"  style="height: 58px;width: 58px;margin-top: 8px" src="/common/more.png"></image>
    <text if="{{moreText}}" style="font-size: 38px;padding-right: 16px">{{moreText}}</text>
  </div>
</div>