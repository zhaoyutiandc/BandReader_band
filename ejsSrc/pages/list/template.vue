<template>
  <div class="demo-page" @swipe="onSwipe">
    <slot name="topBar"></slot>
    <text style="font-size: 1px">{{ top }}</text>
    <text style="font-size: 1px">{{ bottom }}</text>
    <text style="font-size: 1px">{{ toNum }}</text>
    <scroll
        id="scroll"
        scroll-y="{{true}}"
        scroll-top="{{top}}"
        scroll-bottom="{{bottom}}"
        @scroll="{{onScroll}}"
        @scrolltop="{{onScrollTop}}"
        @scrollbottom="{{onScrollBottom}}"
        class="list">
      <div id="chunk1" style="flex-direction: column;width: 100%;flex-shrink: 0">
        <div for="{{chunk1.item}}" id="c-{{$item.index}}" class="item-card"
             style="align-items: flex-start;padding: 0px 0px 0px 32px;"
             onclick="toDetail($item.index,$item.paging,$item.title,$idx)">
          <div style="flex: 1;padding:32px 0px 32px 0px">
            <text style="flex: 1;color:{{curChapter === $item.index ? 'rgb(163,199,218)' : 'white'}}">
              {{
                $item.title
              }}
            </text>
          </div>
          <div style="width: 90px;padding:0px 14px 0px 0px;height: 100%;justify-content: flex-end">
            <image src="/common/goto.png" style="width: 44px;height: 48px;margin-top: 32px"></image>
          </div>
        </div>
      </div>
      <div id="chunk2" style="flex-direction: column;width: 100%;flex-shrink: 0">
        <div for="{{chunk2.item}}" id="c-{{$item.index}}" class="item-card"
             style="align-items: flex-start;padding: 0px 0px 0px 32px;"
             onclick="toDetail($item.index,$item.paging,$item.title,$idx)">
          <div style="flex: 1;padding:32px 0px 32px 0px">
            <text style="flex: 1;color:{{curChapter === $item.index ? 'rgb(163,199,218)' : 'white'}}">
              {{
                $item.title
              }}
            </text>
          </div>
          <div style="width: 90px;padding:0px 14px 0px 0px;height: 100%;justify-content: flex-end">
            <image src="/common/goto.png" style="width: 44px;height: 48px;margin-top: 32px"></image>
          </div>
        </div>
      </div>
    </scroll>

    <div if="{{chunk1.item.length === 0 && loading === false}}"
         style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;justify-content: center;align-items: center">
      <text>无章节</text>
    </div>
    <div if="{{loading}}"
         style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;justify-content: center;align-items: center">
      <text>加载中</text>
    </div>

    <div if="{{wait}}" style="height: 100%;width: 100%;position: absolute;left: 0px;top: 0px;"></div>

    <div if="{{showGoto}}"
         style="height: 100%;width: 100%;padding: 20px;background-color: black;position: absolute;left: 0px;top: 0px;flex-direction: column;align-items: center;justify-content: flex-start">
      <text style="font-size: 50px;margin-bottom: 20px">
        <span>跳转至 </span>
        <span style="font-size: 44px">1-{{ chapterNum }}</span>
      </text>
      <text
          style="width: 100%;text-align: center;justify-content: center;border-radius: 16px;padding: 10px;border: 1px solid rgba(51, 45, 45, 1);margin-bottom: 20px">
        {{ toNum }}
      </text>
      <div class="nums">
        <text for="{{kbNums}}" class="input-num" @click="onInput($item)">{{ $item }}</text>
        <text class="input-num" style="width: 66%" @click="delNum">删除</text>
        <text class="input-num" style="width: 100%;padding: 20px" @click="goto">跳转</text>
      </div>
    </div>
  </div>
</template>

<script>
import router from '@system.router'
import storage from '@system.storage'
import file from '@system.file'
import prompt from '@system.prompt'

let offsetY = 0
let chunkOffset = 0
let chunks = []
let length = 0
let csize = 10
export default {
  // 页面级组件的数据模型，影响传入数据的覆盖机制：private内定义的属性不允许被覆盖
  private: {
    pageTitle: '章节',
    moreText: '跳转',
    config: {},
    sHeight: 0,
    showGoto: false,
    top: 4,
    bottom: -1,
    wait: false,
    chunkTop: 0,
    curi: '',
    cindex: 0,
    kbNums: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    nextC: '',
    count: 0,
    loading: true,
    y: 2,
    chunk1: {},
    chunk2: {},
    paging: 1,
    curChunk: 0,
    needWait: false,
    showChunk: true,
    pindex: 0,
    curChapter: 0,
    toNum: 0
  },
  protected: {
    p: 'init',
    id: '',
    name: '',
    pages: 1,
    chapterNum: 0,
  },
  onReady() {
    const that = this
    this.$element('scroll').getBoundingClientRect({
      success: (data) => {
        this.sHeight = data.height
        this.$app.$def.sendLog(`scroll height ${this.sHeight}`)
        storage.get({
          key: `chapter_${this.id}`,
          success: (data) => {
            that.curChapter = Number(data) || 0
            that.$app.$def.sendLog('list chapter_' + that.curChapter)
            file.readText({
              uri: `internal://files/reader/${that.id}/list.txt`,
              success: (data) => {
                that.$app.$def.data.chapters = data.text.split('\n')
                that.$app.$def.sendLog('list readText' + that.$app.$def.data.chapters.length)
                that.$app.$def.sendLog('first ' + `${that.$app.$def.data.chapters[0]}`)
                length = that.$app.$def.data.chapters.length
                that.$app.$def.sendLog('list read text1 ' + that.$app.$def.data.chapters.length)
                // 将chapter csize个一组push到chunks
                chunks = that.splitChunk(that.$app.$def.data.chapters, csize)
                that.$app.$def.sendLog('list chunk ' + chunks.length)
                that.toChapter(that.curChapter)
                that.loading = false
              },
              fail: function (data, code) {
                that.$app.$def.sendLog('list read text fail ' + code + ' ' + data)
                that.loading = false
              }
            })
          },
          fail: function (data, code) {
          }
        })
      },
    })
  },
  onShow() {
    storage.get({
      key: `chapter_${this.id}`,
      success: (data) => {
        try {
          this.$app.$def.sendLog('onShow:' + data)
          if (Number(data) !== Number(this.curChapter)) {
            this.curChapter = Number(data)
            this.toChapter(this.curChapter)
          }
        } catch (e) {

        }
      }
    })
  },
  splitChunk(array, size) {
    const tempChunks = [];
    this.$app.$def.sendLog("开始chunk " + array.length)
    for (let i = 0; i < array.length; i += size) {
      //page 等于i/size 向下取整
      let chunk = array.slice(i, i + size)
      tempChunks.push({page: Math.floor(i / size), item: chunk});
    }
    return tempChunks;
  },
  chunkToObjs(chunk) {
    this.$app.$def.sendLog('chunkToObjs ' + JSON.stringify({page: chunk.page, length: chunk.item.length}))
    return {
      page: chunk.page,
      item: chunk.item.map(item => {
        let obj = {}
        try {
          obj = JSON.parse(item)
        } catch (e) {
          this.$app.$def.sendLog('chunkToObjs err raw=' + item + ' e: ' + e.toString())
        }
        return obj
      }).filter(item => {
        return item.title
      })
    }
  },
  toChapter(index) {
    try {
      // chunks 是每csize个一组的 通过index来计算他是第几个chunk
      const chunkIndex = Math.floor(index / csize);
      let otherChunk = this.curChunk !== chunkIndex
      let last = chunkIndex === chunks.length - 1
      this.$app.$def.sendLog('to chapter ' + JSON.stringify({
        index,
        chunkIndex,
        curChunk: this.curChunk,
        otherChunk,
        last,
        chunkLength: chunks.length
      }))
      if (otherChunk || this.chunk1.item === undefined) {
        this.top = 0
        // 判断是不是最后一个chunk
        if (!last) {
          this.chunk1 = this.chunkToObjs(chunks[chunkIndex])
          this.chunk2 = this.chunkToObjs(chunks[chunkIndex + 1])
          this.curChunk = chunkIndex
        } else {
          this.chunk1 = this.chunkToObjs(chunks[chunkIndex - 1])
          this.chunk2 = this.chunkToObjs(chunks[chunkIndex])
        }
        this.wait = true
        this.$app.$def.sendLog('chunkToObjs end---')
        this.delay(1400).then(async () => {
          await this.delay(100)
          this.$element(`c-${this.curChapter}`).getBoundingClientRect({
            success: (data) => {
              this.$app.$def.sendLog('to chapter success ' + JSON.stringify({id: `c-${this.curChapter}`, ...data}))
              this.top = data.top - data.height
              this.wait = false
            }
          })
        })
      } else {
        this.wait = true
        this.delay().then(() => {
          this.top = 0
        }).then(() => {
          this.delay().then(() => {
            this.$element(`c-${this.curChapter}`).getBoundingClientRect({
              success: (data) => {
                this.$app.$def.sendLog('to chapter success ' + JSON.stringify({id: `c-${this.curChapter}`, ...data}))
                this.top = data.top - data.height
                this.wait = false
              }
            })
          })
        })
      }
      setTimeout(() => {
        this.wait = false
      }, 1500)
    } catch (e) {
      this.$app.$def.sendLog('to chapter error ' + e)
      setTimeout(() => {
        this.wait = false
      }, 1500)
    }
  },
  onSwipe({direction}) {
    if (direction === 'right') {
      if (this.showGoto) {
        this.showGoto = false
        return
      }
      this.back()
    }
  },
  onBackPress() {
    this.back()
  },

  back() {
    this.$app.$def.sendLog('back ' + 'showChunk:' + this.showChunk)
    if (this.showChunk) {
      router.back()
    } else {
      this.showChunk = true
    }
  },
  toDetail(index, paging, name, idx) {
    const that = this
    this.curChapter = index
    let uri = `internal://files/reader/${this.id}/${paging}/${index}_${name}.txt`
    //sendlog
    this.$app.$def.sendLog('to detail ' + uri)
    storage.set({
      key: `chapter_${this.id}`,
      value: String(index),
      success: (data) => {
        console.log('handling success')
        that.$app.$def.updateBook({
          id: that.id,
          current: (Number(index) + 1),
        })
        storage.set({
          key: 'cinfo_' + that.id,
          value: JSON.stringify({index, uri, name, bid: this.id, bname: this.name, chapterNum: this.chapterNum}),
          success: (data) => {
            that.$app.$def.sendLog('cinfo_' + JSON.stringify({
              key: 'cinfo_' + that.id,
              value: JSON.stringify({index, uri, name, bid: this.id, bname: this.name, chapterNum: this.chapterNum})
            }))
          },
        })
      },
      fail: function (data, code) {
        console.log(`handling fail, code = ${code}`)
      }
    })
    router.push({
      uri: '/pages/read',
      params: {index, uri, name, bid: this.id, bname: this.name, chapterNum: this.chapterNum}
    })
  },
  onScroll(scroll) {
    offsetY = scroll.scrollY
  },
  delay(time = 100) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, time)
    })
  },
  async chunkHeight(id) {
    let cb
    let promise = new Promise(resolve => {
      cb = resolve
    })
    this.$element(id).getBoundingClientRect({
      success: (data) => {
        cb(data.height)
      }
    })
    return promise
  },
  async onScrollBottom() {
    if (this.chunk2.item.length === 0 || this.chunk2.page === chunks.length - 1) {
      return
    }
    if (this.wait) {
      return
    }
    this.wait = true
    let h2 = await this.chunkHeight('chunk2')
    this.top = Math.random() + h2 - this.sHeight + 16
    this.curChunk = this.curChunk + 1
    this.$app.$def.sendLog('scroll bottom ' + JSON.stringify({
      next: this.chunk2.page + 1,
      chunk2: this.chunk2.item.length
    }))
    this.chunk1 = this.chunk2
    this.chunk2 = this.chunkToObjs(chunks[this.chunk2.page + 1])
    await this.delay()
    this.wait = false
  },
  async onScrollTop() {
    if (this.chunk1.page === 0) {
      return
    }
    if (this.wait) {
      return
    }
    this.wait = true
    this.curChunk = this.curChunk - 1
    let h1 = await this.chunkHeight('chunk1')
    this.bottom = Math.random() + h1 - this.sHeight + 16
    this.chunk2 = this.chunk1
    this.chunk1 = this.chunkToObjs(chunks[this.chunk1.page - 1])
    await this.delay()
    this.wait = false
  },
  onChunkScroll(scroll) {
    chunkOffset = scroll.scrollY
  },
  more() {
    this.showGoto = true
  },
  onInput(num) {
    this.toNum = Number(this.toNum + '' + num)
    if (this.toNum === 0) {
      this.toNum = 1
    }
    if (this.toNum > Number(this.chapterNum)) {
      this.toNum = Number(this.chapterNum)
    }
  },
  delNum() {
    //删除 this.toNum最后一位如果删除后toNum长度为0则toNum等于1如果删除后仅剩0则toNum等于0
    let numStr = String(this.toNum)
    numStr = numStr.substring(0, numStr.length - 1)
    if (numStr === '0') {
      numStr = '1'
    }
    this.toNum = Number(numStr)
  },
  goto() {
    this.showGoto = false
    if (this.toNum === 0) {
      this.toNum = 1
    }
    this.curChapter = this.toNum - 1
    this.toChapter(this.curChapter)
  }
}
</script>

<style>
@import '../../common/app.css';

.demo-page {
  height: 100%;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: #000000;
  color: white;
  position: relative;
  border: 1px solid black;
}

.title {
  width: 100%;
  font-size: 64px;
  text-align: left;
  padding-bottom: 16px;
  padding-left: 4px;
  flex-direction: row;
}

.btn {
  width: 200px;
  height: 40px;
  margin-top: 20px;
  border-radius: 5px;
  background-color: #09ba07;
  font-size: 20px;
  color: #ffffff;
}

.list {
  flex: 1;
  width: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
}

.chapter-name {
  font-size: 50px;
  font-weight: bold;
  flex: 1;
}

.item {
  border: 1px solid white;
  padding: 24px 16px 24px 16px;
  border-radius: 16px;
  color: white;
  width: 100%;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.nums {
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap
}

.input-num {
  width: 32%;
  color: white;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 10px;
  margin-bottom: 10px;
  background-color: rgba(51, 45, 45, 0.6);
}
</style>
