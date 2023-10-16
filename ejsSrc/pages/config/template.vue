<template>
  <div class="page-cmpt" style="padding-bottom: 24px">
    <slot name="topBar"></slot>
    <text style="font-size: 1px">{{count}}</text>
    <scroll style="width: 100%;flex: 1;flex-direction: column" scroll-y="{{true}}" scroll-top="{{top}}">
      <div class="item-card" style="justify-content: space-between;align-items: center">
        <div style="width: 100%;flex-direction: column">
          <text>字体大小 {{ size }}</text>
          <slider style="margin-top: 24px;margin-bottom: 34px;width: 100%" min="34" max="64" step="4" value="{{ initialSliderValue }}"
                  onchange="onSliderChange"></slider>
          <text style="color: white;font-size: {{size}};text-align: center">测试大小</text>
        </div>
      </div>
      <div class="item-card" style="height: 120px;justify-content: space-between;align-items: center">
        <text>屏幕常亮</text>
        <switch checked="{{ bright }}" style="height: 48px" @change="onBrightChange"></switch>
      </div>
      <div class="item-card" style="height: 120px;justify-content: space-between;align-items: center">
        <text>自动翻页</text>
        <switch checked="{{ config.auto }}" style="height: 48px" @change="onAutoChange"></switch>
      </div>
      <div class="item-card" style="justify-content: space-between;align-items: center">
        <div style="width: 100%;flex-direction: column">
          <text>翻页间隔 {{ autoTime }}秒</text>
          <slider style="margin-top: 24px;margin-bottom: 34px;width: 100%" min="4" max="8" step="`1`" value="{{ initialTimeValue }}"
                  onchange="onTimeChange"></slider>
        </div>
      </div>
      <div class="item-card" style="height: 120px;justify-content: space-between;align-items: center">
        <text>固定顶栏</text>
        <switch checked="{{ config.pin }}" style="height: 48px" @change="onPinChange"></switch>
      </div>
      <div class="item-card" style="height: 120px;justify-content: space-between;align-items: center">
        <text>点击翻页</text>
        <switch checked="{{ config.click }}" style="height: 48px" @change="onClickChange"></switch>
      </div>
    </scroll>
  </div>
</template>
<script>
import router from '@system.router'
import prompt from '@system.prompt'
import storage from "@system.storage";
export default {
  private: {
    initialSliderValue: 54,
    sliderValue: 54,
    initialTimeValue:6,
    autoTime:6,
    top: 0,
    count: 0,
    size: 54,
    bright: false,
    config: {
      auto: false,
      pin: true,
      click:true,
    }
  },
  onInit() {
    this.config = this.$app.$def.data.config
    this.autoTime = this.config.autoTime || 6
    this.initialTimeValue = this.autoTime
    this.bright = this.config.bright || false
    this.initialSliderValue = this.$app.$def.data.config.size || 54
    this.size = this.initialSliderValue
  },
  onReady() {
    setInterval(() => {
      this.count = this.count + 1
    }, 1000)
    this.$app.$def.sendLog('config:' + JSON.stringify(this.config))
    storage.get({
      key:'showedConfig',
      success: (data) => {
        if (data == null || data === '') {
          this.top=400
          setTimeout(()=>{
            this.top=0
          },3000)
          storage.set({
            key: 'showedConfig',
            value: 'true'
          })
        }
      }
    })
  },
  onBackPress() {
    return true
  },
  onPinChange(e) {
    this.config.pin = e.checked
    this.$app.$def.changeConfig(this.config)
  },
  onClickChange(e) {
    this.config.click = e.checked
    this.$app.$def.changeConfig(this.config)
  },
  onAutoChange(e) {
    this.config.auto = e.checked
    this.config.autoTime = this.autoTime
    this.$app.$def.changeConfig(this.config)
    /*this.bright = e.checked
    this.onBrightChange({checked: e.checked})*/
  },
  onSliderChange(e) {
    this.size = e.progress
    this.sliderValue = e.progress
    this.config.size = e.progress
    this.$app.$def.changeConfig(this.config)
  },
  onTimeChange(e) {
    this.autoTime = e.progress
    this.initialTimeValue = e.progress
    this.config.autoTime = e.progress
    this.$app.$def.changeConfig(this.config)
  },
  onBrightChange(e) {
    this.bright = e.checked
    this.config.bright = e.checked
    this.$app.$def.changeConfig(this.config)
    this.$app.$def.brightSwitch(e.checked)
  },
  back() {
    router.back()
  },
}
</script>
<style>
@import '../../common/app.css';

.line {
  margin-bottom: 8px;
  font-size: 48px;
}
</style>