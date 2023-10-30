<template>
  <div class="page">
    <text style="font-size:1px">{{ count }}</text>
    <swiper id="swiper" v-if="books.length>0" class="swiper" @change="swipe">
      <div for="{{books}}" class="item">
        <stack style="width: 100%;height: 100%">
          <div style="padding: 100px 16px 16px 16px;flex: 1;width: 100%;height: 100%;flex-direction: column;justify-content: flex-start;align-items: flex-start">
            <div class="main-card" style="flex-direction: column;height: 440px"  onclick="toDirectory($item)" >
              <stack style="width: 100%;height: 100%">
                <div style="justify-content: flex-end;align-items: flex-end">
                  <stack if="{{$item.cover&&$item.cover.length>0}}" style="width: 260px;height: 360px">
                    <image src="{{$item.cover}}" alt="blank"
                           style="width: 260px;height: 360px;object-fit: contain"></image>
                    <div style="width: 260px;height: 360px;background-color: rgba(0,0,0,0.4)"></div>
                  </stack>
                </div>
                <div style="flex-direction: column;align-items: flex-start">
                  <div style="flex: 1;align-items: flex-start;padding-top: 14px">
                    <text class="book-name">{{ $item.name }}</text>
                  </div>
                  <text class="" style="font-size: 44px;width: 100%;">共{{ $item.chapters }}章</text>
                  <div class="" style="font-size: 44px;width: 100%;color: rgb(163,199,218);flex-direction: row;flex-wrap:wrap;padding: 16px 0px 0px 0px" @click="toDetail($item)">
                    <text style="margin-right: 16px">当前:{{ $item.current || 0 }}</text>
                    <text>继续阅读</text>
                  </div>
                </div>
              </stack>

            </div>
          </div>
          <text class="del" onclick="deleteBook($item)">删除</text>
        </stack>
      </div>
    </swiper>
    <div else class="col" style="flex: 1;margin-top: 18px;padding-top: 100px">
      <div class="main-card col" style="margin-bottom: 22px;flex: 1;align-items: flex-start">
        <text style="font-size: 64px;">书架空空如也</text>
        <div style="align-items: flex-start;height: 220px;margin-top: 24px">
          <image src="/common/icon.png" style="height: 140px;width: 200px;object-fit: contain"></image>
          <text style="width: 24px"></text>
          <div style="flex-direction: column">
            <text style="font-size: 40px;margin-top: 16px">请连接手机APP</text>
            <text style="font-size: 40px;margin-top: 16px">同步书籍</text>
          </div>
        </div>
      </div>
      <div class="main-card" @click="help">
        <text class="text-big">如何同步？</text>
        <image src="/common/goto.png"></image>
      </div>
    </div>

    <div if="{{isDel}}" class="opt">
      <image src="/common/del.png"
             style="width: 180px;height: 160px;margin-top: 18px;object-fit: fill;margin-bottom: 44px"></image>
      <text style="width: 100%;font-size: 64px;text-align: center;line-height: 64px;margin-bottom: 24px">确认删除吗
      </text>
      <text class="font-gray" style="width: 100%;font-size: 40px;text-align: center;margin-bottom: 24px">{{
          name
        }}
      </text>
      <text style="width: 100%;font-size: 42px;text-align: center;margin-bottom: 24px">操作不可恢复!</text>
      <div style="width: 100%;justify-content: space-between;padding-bottom: 18px">
        <div class="btn no" onclick="cancel">
          <image style="height: 44px" src="/common/x.png"></image>
        </div>
        <div style="width: 32px"></div>
        <div class="btn yes" onclick="confirm">
          <image style="height: 44px" src="/common/v.png"></image>
        </div>
      </div>
    </div>
    <div style="position: absolute;top: 0px;left: 0px">
      <slot name="topBar"></slot>
    </div>
  </div>

</template>

<script>
import router from '@system.router'
import app from '@system.app'
import storage from "@system.storage";
import prompt from '@system.prompt'
import sensor from '@system.sensor'

export default {
  private: {
    pageTitle: '首页',
    books: [],
    curBook:{},
    message: 'message',
    conn: {},
    evt: 'evt',
    isDel: false,
    cid: '',
    name: '',
    showLog: true,
    log: "log1",
    num: 0,
    showMore: true,
    cover: "",
    count: 0,
    hasCover: false,
    bindex: 0,
    isToDetail:false,
    toRead:false,
  },
  onInit() {
    this.$app.$def.data.emitter.on('conn', (data) => {
      this.evt = data
    })

    this.changeBooks()
    this.message = this.$app.$def.data.message
  },
  onReady() {
    this.$app.$def.sendLog("sensor " + Object.keys(sensor))
    setInterval(() => {
      this.count = this.count + 1
    }, 1000)
    this.$app.$def.data.emitter.on('add_book', () => {
      this.changeBooks()
    })
    this.log = "ready"
    this.$app.$def.data.emitter.on('log', (data) => {
      this.log = data
    })
    setTimeout(() => {
      storage.get({
        key: 'bindex',
        success: (data) => {
          {
            console.log('handling success')
            this.bindex = Number(data)
            setTimeout(() => {
              this.$element('swiper').swipeTo({index: this.bindex})
            }, 300)
          }
        },
        fail: function (data, code) {
          console.log(`handling fail, code = ${code}`)
        }
      })
    }, 600)
  },
  onShow(){
    if (this.toRead){
      this.toRead = false
      this.changeBooks()
      router.push({
        uri: '/pages/list',
        params: {id: this.curBook.id, name: this.curBook.name, pages: this.curBook.pages,chapterNum:this.curBook.chapters}
      })
    }
  },
  toDirectory(book) {
    if (this.isToDetail) return
    router.push({
      uri: '/pages/list',
      params: {id: book.id, name: book.name, pages: book.pages,chapterNum:book.chapters}
    })
  },
  changeBooks() {
    this.books = []
    this.books = [...this.$app.$def.data.books].reverse()
    setTimeout(() => {
      this.$element('swiper').swipeTo({index: this.bindex})
    }, 300)
  },
  deleteBook({id, name}) {
    this.isDel = true
    this.name = name
    this.cid = id
    return false
  },
  cancel() {
    this.isDel = false
  },
  confirm() {
    this.isDel = false
    this.$app.$def.data.emitter.emit('del_book', this.cid)
  },
  back() {
    app.terminate()
  },
  more() {
    router.push({
      uri: '/pages/about',
      params: {}
    })
  },
  help() {
    router.push({
      uri: '/pages/help',
      params: {}
    })
  },
  swipe(e) {
    this.bindex = e.index
    storage.set({
      key: 'bindex',
      value: String(this.bindex),
      success: function (data) {
        console.log('handling success')
      },
      fail: function (data, code) {
        console.log(`handling fail, code = ${code}`)
      }
    })
    if (this.books[e.index].cover && this.books[e.index].cover.length > 0) {
      this.cover = this.books[e.index].cover
      this.hasCover = true
    } else {
      this.hasCover = false
    }
  },
  toDetail(item){
    this.isToDetail = true
    this.toRead = true
    this.curBook = item
    setTimeout(()=>{
      this.isToDetail = false
    },1000)
    storage.get({
      key: 'cinfo_' + item.id,
      success: (data) => {
        let params = JSON.parse(data)
        params.fromHome = true
        router.push({
          uri: '/pages/read',
          params
        })
        this.$app.$def.sendLog('toDetail:' + JSON.stringify(JSON.parse(data)))
      }
    })
  }
}
</script>

<style>
@import '../../common/app.css';

text {
  color: white;
}

.page {
  width: 100%;
  height: 100%;
  align-items: flex-start;
  color: white;
  flex-direction: column;
  position: relative;
}

.book-name {
  font-size: 64px;
  margin-bottom: 82px;
  font-weight: bold;
  lines: 2;
  text-overflow: ellipsis;
  width: 100%;
}

.swiper {
  width: 100%;
  height: 100%;
  indicator-size: 10px;
  indicator-color: white;
  indicator-bottom: 44px
}

.item {
  text-align: center;
  color: white;
  font-size: 30px;
  flex-direction: column;
  position: relative;
}

.del {
  position: absolute;
  bottom: 32px;
  right: 8px;
  font-size: 44px;
  border-radius: 40px;
  border: 2px solid #333333;
  padding: 4px 30px 4px 30px;
  background-color: rgb(35, 35, 35);
}

.opt {
  position: absolute;
  flex-direction: column;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 90%;
  justify-content: flex-end;
  padding: 14px;
  align-items: center;
  background-color: black;
  border-radius: 32px;
}

.btn {
  color: black;
  border-radius: 150px;
  padding: 20px 46px 20px 46px;
  background-color: #333333;
  justify-content: center;
  align-items: center;
}

.yes {
  background-color: #0986D4;
}
</style>