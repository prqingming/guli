<template>
  <div id="aCoursesList" class="bg-fa of">
    <!-- /课程列表 开始 -->
    <section class="container">
      <header class="comm-title">
        <h2 class="fl tac">
          <span class="c-333">全部课程</span>
        </h2>
      </header>
      <section class="c-sort-box">
        <section class="c-s-dl">
          <dl>
            <dt>
              <span class="c-999 fsize14">课程类别</span>
            </dt>
            <dd class="c-s-dl-li">
              <ul class="clearfix">
                <li>
                  <a title="全部" href="#" @click="initCourseFirst()">全部</a>
                </li>
                <li v-for="(item,index) in subjectNestedList" :key="index" :class="{active:oneIndex==index}">
                  <a :title="item.title" href="#" @click="searchOne(item.id,index)">{{item.title}}</a>
                </li>

              </ul>
            </dd>
          </dl>
          <dl>
            <dt>
              <span class="c-999 fsize14"></span>
            </dt>
            <dd class="c-s-dl-li">
              <ul class="clearfix">
                <li v-for="(item,index) in subSubjectList" :key="index" :class="{active:twoIndex==index}">
                  <a :title="item.title" href="#" @click="searchTwo(item.id,index)">{{item.title}}</a>
                </li>

              </ul>
            </dd>
          </dl>
          <div class="clear"></div>
        </section>
        <div class="js-wrap">
          <section class="fr">
            <span class="c-ccc">
              <i class="c-master f-fM">1</i>/
              <i class="c-666 f-fM">1</i>
            </span>
          </section>
          <section class="fl">
            <ol class="js-tap clearfix">
              <li :class="{'current bg-orange':buyCountSort!=''}">
                <a title="销量" href="javascript:void(0);" @click="searchBuyCount()">销量
                  <span :class="{hide:buyCountSort==''}">↓</span>
                </a>
              </li>
              <li :class="{'current bg-orange':gmtCreateSort!=''}">
                <a title="最新" href="javascript:void(0);" @click="searchGmtCreate()">最新
                  <span :class="{hide:gmtCreateSort==''}">↓</span>
                </a>
              </li>
              <li :class="{'current bg-orange':priceSort!=''}">
                <a title="价格" href="javascript:void(0);" @click="searchPrice()">价格&nbsp;
                  <span :class="{hide:priceSort==''}">↓</span>
                </a>
              </li>
            </ol>
          </section>
        </div>

        <div class="mt40">
          <!-- /无数据提示 开始-->
          <section class="no-data-wrap" v-if="data.total==0">
            <em class="icon30 no-data-ico">&nbsp;</em>
            <span class="c-666 fsize14 ml10 vam">没有相关数据，小编正在努力整理中...</span>
          </section>
          <!-- /无数据提示 结束-->
          <article class="comm-course-list" v-if="data.total>0">
            <ul class="of" id="bna">
              <li v-for="item in data.items" v-bind:key="item.id">
                <div class="cc-l-wrap" >
                  <section class="course-img">
                    <img :src="item.cover" class="img-responsive" :alt="item.title" style="height:230px">
                    <div class="cc-mask">
                      <a :href="'/course/'+item.id" title="开始学习" class="comm-btn c-btn-1">开始学习</a>
                    </div>
                  </section>
                  <h3 class="hLh30 txtOf mt10">
                    <a :href="'/course/'+item.id" :title="item.title"
                      class="course-title fsize18 c-333">{{item.title}}</a>
                  </h3>
                  <section class="mt10 hLh20 of">
                    <span class="fr jgTag bg-green">
                      <i class="c-fff fsize12 f-fA">{{item.isFree===true?'免费':''}}</i>
                    </span>
                    <span class="fl jgAttr c-ccc f-fA">
                      <i class="c-999 f-fA">{{item.viewCount}}人学习</i>
                      |
                      <i class="c-999 f-fA">9634评论</i>
                    </span>
                  </section>
                </div>
              </li>
            </ul>
            <div class="clear"></div>
          </article>
        </div>
        <!-- 公共分页 开始 -->
        <div>
          <div class="paging">
            <!-- undisable这个class是否存在，取决于数据属性hasPrevious -->
            <a :class="{undisable: !data.hasPrevious}" @click.prevent="gotoPage(1)" href="#" title="首页">首</a>
            <a :class="{undisable: !data.hasPrevious}" @click.prevent="gotoPage(data.current-1)" href="#"
              title="前一页">&lt;</a>
            <a v-for="page in data.pages" v-bind:key="page"
              :class="{current: data.current == page, undisable: data.current == page}" @click.prevent="gotoPage(page)"
              href="#" :title="'第'+page+'页'">{{page}}</a>
            <a :class="{undisable: !data.hasNext}" @click.prevent="gotoPage(data.current+1)" href="#"
              title="后一页">&gt;</a>
            <a :class="{undisable: !data.hasNext}" @click.prevent="gotoPage(data.pages)" href="#" title="末页">末</a>
            <div class="clear"></div>
          </div>
        </div>
        <!-- 公共分页 结束 -->
      </section>
    </section>
    <!-- /课程列表 结束 -->
  </div>
</template>
<script>
import courseApi from '@/api/course'

export default {
  data(){
    return {
      page:1, //当前页
      data:{},  //课程列表
      subjectNestedList: [], // 一级分类列表
      subSubjectList: [], // 二级分类列表

      searchObj: {}, // 查询表单对象
      //选中时显示样式
      oneIndex:-1,
      twoIndex:-1,
      buyCountSort:"",
      gmtCreateSort:"",
      priceSort:""
    }
  },
  created(){
    //查询课程列表
    this.initCourseFirst()
    //显示一级分类
    this.initSubject()
  },
  methods:{
    //查询第一页课程数据
    initCourseFirst(){
      this.subSubjectList=[]
      this.searchObj={}
      //调用方法获取课程列表
      courseApi.getCourseList(1,8,this.searchObj).then(response=>{
        this.data = response.data.data
      })
    },
    //查询所有一级分类
    initSubject(){
      courseApi.getAllSubject()
        .then(response=>{
          this.subjectNestedList = response.data.data.list
        })
    },
    //分页切换
    gotoPage(page){
      courseApi.getCourseList(page,8,this.searchObj).then(response=>{
        this.data = response.data.data
      })
    },
    //点击某个一级分类，查询对应的二级分类
    searchOne(subjectParentId, index) {
      //把Index值赋给oneIndex，为了使active样式生效
      this.oneIndex = index
      //二级分类样式不生效
      this.twoIndex = -1
      //二级分类不进行查询
      this.searchObj.subjectId = ""
      //二级列表为空，不显示
      this.subSubjectList = []
      //把一级分类点击id值，赋值给searchObj，查询指定的一级分类
      this.searchObj.subjectParentId = subjectParentId
      //点击某个一级分类进行条件查询
      this.gotoPage(1)

      //拿着点击的一级分类id 和 所有一级分类id进行比较，
      //如果id相同，从一级分类里面获取对应的二级分类
      for (let i = 0; i < this.subjectNestedList.length; i++) {
        //获取每个一级分类
        var oneSubject = this.subjectNestedList[i]
        //比较id是否相同
        if (subjectParentId == oneSubject.id) {
          //从一级分类里面获取对应的二级分类
          this.subSubjectList = oneSubject.children
        }
      }

    },
    //点击某个二级分类实现条件查询
    searchTwo(subjectId, index) {
      //把index赋值,为了样式生效
      this.twoIndex = index
      //把二级分类点击id值，赋值给searchObj
      this.searchObj.subjectId = subjectId
      //点击某个二级分类进行条件查询
      this.gotoPage(1)
    },

    //根据销量排序
    searchBuyCount() {
      //设置对应变量值，为了样式生效
      this.buyCountSort = "1"
      this.gmtCreateSort = ""
      this.priceSort = ""

      //把值赋值到searchObj
      this.searchObj.buyCountSort = this.buyCountSort
      this.searchObj.gmtCreateSort = this.gmtCreateSort;
      this.searchObj.priceSort = this.priceSort;

      //调用方法查询
      this.gotoPage(1)
    },
    //根据最新排序
    searchGmtCreate() {
      //设置对应变量值，为了样式生效
      this.buyCountSort = ""
      this.gmtCreateSort = "1"
      this.priceSort = ""

      //把值赋值到searchObj
      this.searchObj.buyCountSort = this.buyCountSort
      this.searchObj.gmtCreateSort = this.gmtCreateSort;
      this.searchObj.priceSort = this.priceSort;

      //调用方法查询
      this.gotoPage(1)
    },
    //根据价格排序
    searchPrice() {
      //设置对应变量值，为了样式生效
      this.buyCountSort = ""
      this.gmtCreateSort = ""
      this.priceSort = "1"

      //把值赋值到searchObj
      this.searchObj.buyCountSort = this.buyCountSort
      this.searchObj.gmtCreateSort = this.gmtCreateSort;
      this.searchObj.priceSort = this.priceSort;

      //调用方法查询
      this.gotoPage(1)
    }
  }
  
}
</script>
<style scoped>
  .active {
    background: #bdbdbd;
  }
  .hide {
    display: none;
  }
  .show {
    display: block;
  }

  .undisable {
    pointer-events: none;
  }
</style>