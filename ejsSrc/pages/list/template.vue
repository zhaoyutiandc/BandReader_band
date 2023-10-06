<template>
  <div class="demo-page" @swipe="onSwipe">
    <slot name="topBar"></slot>
    <text style="font-size: 1px">{{ pindex }}</text>
    <text style="font-size: 1px">{{ count }}</text>
    <text style="font-size: 1px">{{ showChunk }}</text>

    <scroll
        if="{{showChunk==false}}"
        scroll-y="{{true}}"
        scroll-top="{{top}}"
        @scroll="{{onScroll}}"
        class="list">
      <div for="{{chapters}}"  id="c-{{$idx}}"  class="item-card" style="align-items: flex-start;padding: 0px 0px 0px 32px;">
        <div  style="flex: 1;padding:32px 0px 32px 0px">
          <!--<div style="justify-content: space-between;margin-bottom: 12px;align-items: center">
            &lt;!&ndash;<div style="align-items: center">
              &lt;!&ndash;<marquee scrollamount={{16}} class="chapter-name">{{ $item.name.split(/\s+/).slice(0,-1).join(' ') }}</marquee>
              <text>{{ curi === $item.uri ? '*' : '' }}</text>&ndash;&gt;
              <text>{{$item.name}}</text>
            </div>&ndash;&gt;
          </div>-->
          <text style="flex: 1;color:{{curi === $item.uri ? '#bee0ff' : 'white'}}">{{$item.name}}</text>
          <!--<text if="{{curi === $item.uri}}" style="width: 50px;text-align: center">{{ curi === $item.uri ? '*' : '' }}</text>&ndash;&gt;-->
          <!--<text class="font-gray" style="font-size: 48px;width: 100%">{{ $item.name.split(/\s+/).slice(-1,).join('') || '' }}</text>-->
        </div>
        <div style="width: 90px;padding:0px 14px 0px 0px;height: 100%;justify-content: flex-end" onclick="toDetail($item.index,$item.uri,$item.name,$idx)">
          <image src="/common/goto.png" style="width: 44px;height: 48px;margin-top: 32px"></image>
        </div>
      </div>
    </scroll>

    <scroll
        if="{{showChunk==true}}"
        scroll-y="{{true}}"
        scroll-top="{{chunkTop}}"
        @scroll="{{onChunkScroll}}"
        class="list">
      <div for="{{chunks}}" class="item-card" style="height: 110px" onclick="toChunk($item)">
        <text>{{ ($item * 50) - 49 }} - {{ $item * 50 }}章 {{ curChunk == $item ? '*' : '' }}</text>
        <image src="/common/goto.png" style="width: 44px;height: 48px"></image>
      </div>
    </scroll>
    <div if="{{chapters.length===0 && chunks.length===0}}"
         style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;justify-content: center;align-items: center">
      <text>无章节</text>
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
export default {
  // 页面级组件的数据模型，影响传入数据的覆盖机制：private内定义的属性不允许被覆盖
  private: {
    config: {},
    top: 0,
    chunkTop: 0,
    curi: '',
    cindex:0,
    nextC:'',
    count: 0,
    loading: false,
    y: 2,
    chapters: [],
    paging: 1,
    curChunk: 1,
    needWait: false,
    showChunk: true,
    chunks: [],
    pindex: 0,
    curChapter: 0,
  },
  protected: {
    p: 'init',
    id: '',
    name: '',
    pages: 1,
    chapterNum:0,
  },
  onReady() {
    const that = this
    let temp = []
    for (var i = 1; i <= this.pages; i++) {
      temp.push(i)
    }


    setInterval(() => {
      this.count = this.count + 1
    }, 1000)

    this.chunks = temp
    setTimeout(() => {
      storage.get({
        key: 'chunk_offset_' + this.id,
        success: function (data) {
          that.chunkTop = Number(data)
          that.pindex = Number(data)
        },
        fail: function (data, code) {
        }
      })
    }, 2000)
    storage.get({
      key: `chapter_${this.id}`,
      success: function (data) {
        that.curi = data || 0
      },
      fail: function (data, code) {
      }
    })
    storage.get({
      key: 'chunk_' + this.id,
      success: function (data) {
        that.curChunk = data
      },
      fail: function (data, code) {
      }
    })


  },
  onShow() {
    const that = this
    setTimeout(() => {
      //sendlog
      this.$app.$def.sendLog('list on show '+ this.$app.$def.data.next)
      if (this.$app.$def.data.next) {
        let temp
        try {
         temp  = this.chapters[this.cindex + 1]
        }catch (e) {
          
        }

        if (temp) {
          this.nextC = temp.name
          this.$app.$def.sendLog('list has next chapter ' + 'c-' + this.cindex + 1)
          this.$app.$def.data.next = false
          this.$element('c-' + (this.cindex + 1)).getBoundingClientRect({
            success: (data)=> {
              this.$app.$def.sendLog(`next chapter ${JSON.stringify(data)}`)
              offsetY = offsetY + data.height
              this.top = offsetY
              this.toDetail(temp.index, temp.uri, temp.name,this.cindex + 1)
            },
            fail: (errorData, errorCode) => {
              this.$app.$def.sendLog('next chapter fail '+ errorCode + ' ' + errorData)
            },
          })
          /*offsetY = (this.cindex) * 190
          this.top = (this.cindex) * 190*/
        } else {
          this.$app.$def.sendLog('list to next chunk')
          if (this.paging < this.chunks.length) {
            //sendlog
            this.$app.$def.sendLog('next chunk')
            this.toChunk(this.paging + 1, true)
          }
        }
      }
    }, 1000)
  },
  onSwipe({direction}) {
    if (direction === 'right') {
      this.back()
    }
  },
  onBackPress() {
    this.back()
  },
  toChunk(chunk, next) {
    this.chapters = []
    this.paging = chunk
    this.loadPage(next)
    this.showChunk = false
    setTimeout(() => {
      storage.get({
        key: 'tuto_list',
        success: (data) => {
          if (data === '') {
            prompt.showToast({
              message: '点击章名右侧箭头进入阅读',
              duration: 6000
            })
            storage.set({
              key: 'tuto_list',
              value: '1'
            })
          } else {
          }
        }
      })
    }, 1600)
  },
  onShowChunk() {
    this.showChunk = true
    this.chapters = []
  },
  loadPage(next = false) {
    const that = this
    this.needWait = true
    this.loading = true
    that.pindex = 0
    that.top = 0
    file.list({
      uri: `internal://files/reader/${this.id}/${this.paging}`,
      success: function (data) {
        console.log(data.fileList)
        storage.set({
          key: 'paging_' + that.id,
          value: String(that.paging),
          success: function (data) {
            console.log('handling success')
          },
          fail: function (data, code) {
            console.log(`handling fail, code = ${code}`)
          }
        })
        that.chapters = data.fileList.map(item => {
          let obj = {}
          let arr = item.uri.split('/')
          obj.index = arr[arr.length - 1].split('.')[0].split('_')[0]
          obj.name = arr[arr.length - 1].split('.')[0].split('_')[1]
          obj.uri = item.uri

          return obj
        }).sort((a, b) => {
          return Number(a.index) - Number(b.index)
        })
        that.loading = false
        setTimeout(() => {
          //sendlog
          setTimeout(() => {
            if (next === true) {
              chunkOffset = (that.curChunk - 1) * 110
              that.chunkTop = (that.curChunk - 1) * 110
              that.curChunk = that.paging
              that.pindex = 0
              offsetY = 0
              that.top = 0
              that.$app.$def.data.next = false
              let temp = that.chapters[0]
              that.toDetail(temp.index, temp.uri, temp.name)
            }
          }, 1000)
          if (that.chapters.some(i => i.uri === that.curi)) {
            storage.get({
              key: 'ioffset_' + that.id,
              success: (data) => {
                that.pindex = data
                that.top = Number(data) || 0
              }
            })
          } else {
            that.pindex = 0
            that.top = 0
          }
        }, 500)
      },
      fail: function (data, code) {

      }
    })
  },
  back() {
    this.$app.$def.sendLog('back ' + 'showChunk:' + this.showChunk)
    if (this.showChunk) {
      router.back()
    } else {
      this.showChunk = true
    }
  },
  toDetail(index, uri, name,idx) {
    const that = this
    this.curChapter = Number(index)
    this.cindex = idx
    this.curi = uri
    storage.set({
      key: 'ioffset_' + this.id,
      value: String(offsetY),
      success: function (data) {
        console.log('handling success')
        that.pindex = offsetY
      },
      fail: function (data, code) {
        console.log(`handling fail, code = ${code}`)
      }
    })
    storage.set({
      key: 'chunk_offset_' + this.id,
      value: String(chunkOffset),
      success: function (data) {
        console.log('handling success')
        that.pindex = chunkOffset
      },
      fail: function (data, code) {
        console.log(`handling fail, code = ${code}`)
      }
    })
    storage.set({
      key: `chapter_${this.id}`,
      value: uri,
      success: function (data) {
        console.log('handling success')
        that.$app.$def.updateBook({
          id:that.id,
          current:name.split(' ')[0],
        })
      },
      fail: function (data, code) {
        console.log(`handling fail, code = ${code}`)
      }
    })

    this.curChunk = Number(this.paging)
    this.saveChunk()
    router.push({
      uri: '/pages/read',
      params: {index, uri, name, bid: this.id, bname: this.name,chapterNum:this.chapterNum}
    })
  },
  saveChunk() {
    let paging = String(this.paging)
    storage.set({
      key: 'chunk_' + this.id,
      value: paging,
      success: function (data) {
        console.log('handling success')
      },
      fail: function (data, code) {
        console.log(`handling fail, code = ${code}`)
      }
    })
  },
  onScroll(scroll) {
    offsetY = scroll.scrollY
  },
  onChunkScroll(scroll) {
    chunkOffset = scroll.scrollY
  },
}
</script>

<style>
@import '../../common/app.css';

.demo-page {
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: #000000;
  color: white;
  position: relative;
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

.chapter-name{
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
</style>
