<template>
  <div class="app-container">
    讲师表单
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" 
                   @click="imagecropperShow=true">更换头像
        </el-button>

        <!--
      v-show：是否显示上传组件
      :key：类似于id，如果一个页面多个图片上传控件，可以做区分
      :url：后台上传的url地址
      @close：关闭上传组件
      @crop-upload-success：上传成功后的回调 
        <input type="file" name="file"/>
      -->
        <image-cropper 
          v-show="imagecropperShow" 
          :width="300" 
          :height="300" 
          :key="imagecropperKey"
          :url="BASE_API+'/eduoss/fileoss'" 
          field="file" 
          @close="close" 
          @crop-upload-success="cropSuccess" />
      </el-form-item>

      <!-- 保存按钮 -->
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import teacherApi from '@/api/edu/teacher'
//引入上传的组件
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'


export default {
  //声明组件
  components:{ImageCropper,PanThumb},
  data(){
    return{
      //讲师信息
      teacher:{
        name:'',
        sort:0,
        level:1,
        career:'',
        intro:'',
        avatar:''
      },
      //添加按钮是否禁用
      saveBtnDisabled:false,
      //上传组件是否显示
      imagecropperShow:false,
      imagecropperKey:0,//上传组件key值
      BASE_API:process.env.BASE_API, //获取dev.env.js里面地址
    }

  },
  created(){
    //页面渲染前先执行初始化操作判断是什么操作
    this.init()
  },
  //监听路由变化，再执行一次init()方法
  //避免从修改页面点击跳转到添加页面时，由于在同一个页面，
  //导致created渲染方法已经加载过，而init()方法不执行导致的页面数据未清空
  watch:{
    $route(to,from){  //路由发生变化，即切换页面时
      this.init()
    }
  },
  methods:{
    //初始化方法
    init(){
      //判断路径有id值,执行修改相关操作
      if(this.$route.params && this.$route.params.id){
        //从路径获取id值
        const id = this.$route.params.id
        //根据id获取讲师信息
        this.getInfo(id)
      }else{//路径无id值
      //清空表单
      this.teacher = {}
      }
    },
    //保存或修改的方法
    saveOrUpdate(){
      //判断当前请求是修改还是添加
      //根据teacher是否有id
      if (!this.teacher.id) {  //没有id为添加
        //添加
        this.saveTeacher()
      }else{
        //修改
        this.updateTeacher()
      }
    },
    //添加讲师的方法
    saveTeacher() {
      //调用teacher.js里的添加方法
      teacherApi.addTeacher(this.teacher)
        .then(response => {  //添加成功
          //1.提示信息
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          //2.回到列表页面  路由跳转（重定向操作）
          this.$router.push({path:'/edu/teacher/list'})  //固定写法
      })
    },
    //根据id查询讲师信息
    getInfo(id) {
      teacherApi.getTeacherInfo(id)
        .then(response => {  //这里有问题，前面获取到数据，赋不了值
          this.teacher = response.data.item
        })
    },
    //修改讲师的方法
    updateTeacher() {
      teacherApi.updateTeacher(this.teacher)
        .then(response => {
          //1.提示信息
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          //2.回到列表页面，路由跳转
          this.$router.push({path:'/edu/teacher/list'})
        })
    },
    //上传头像时的关闭上传组件的方法
    close(){
      //让上传组件不显示，即关闭
      this.imagecropperShow = false
      //上传组件初始化
      this.imagecropperKey = this.imagecropperKey +1 
    },
    //上传成功后进行回调的方法
    //data相当于response,工具帮我们封装了
    cropSuccess(data){
      //关闭组件
      this.imagecropperShow = false
      //上传成功后接口会返回图片的url地址
      this.teacher.avatar = data.url
      this.imagecropperKey = this.imagecropperKey + 1
    }

  }
}
</script>
