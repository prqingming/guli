<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

    <el-form label-width="120px">

        <el-form-item label="课程标题">
            <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
        </el-form-item>

        <!-- 所属分类 TODO -->
        <el-form-item label="课程分类">
            <el-select
                v-model="courseInfo.subjectParentId"
                placeholder="一级分类" @change="subjectLevelOneChanged">
                <el-option
                    v-for="subject in subjectOneList"
                    :key="subject.id"
                    :label="subject.title"
                    :value="subject.id"/>
            </el-select>
            <!-- 二级分类 -->
            <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
                <el-option
                    v-for="subject in subjectTwoList"
                    :key="subject.id"
                    :label="subject.title"
                    :value="subject.id"/>
            </el-select>
        </el-form-item>


        <!-- 课程讲师 TODO -->
        <!-- 课程讲师 -->
        <el-form-item label="课程讲师">
        <el-select
            v-model="courseInfo.teacherId"
            placeholder="请选择">
            <el-option
                v-for="teacher in teacherList"
                :key="teacher.id"
                :label="teacher.name"
                :value="teacher.id"/>
        </el-select>
        </el-form-item>

        <el-form-item label="总课时">
            <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
        </el-form-item>

        <!-- 课程简介 TODO -->
        <el-form-item label="课程简介">
            <tinymce :height="300" v-model="courseInfo.description"/>
        </el-form-item>

        <!-- 课程封面-->
        <el-form-item label="课程封面">

            <el-upload
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :action="BASE_API+'/eduoss/fileoss'"
                class="avatar-uploader">
                <img :src="courseInfo.cover">
            </el-upload>

        </el-form-item>

        <el-form-item label="课程价格">
            <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
        </el-form-item>

        <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" 
                       @click="saveOrUpdate">保存并下一步</el-button>
        </el-form-item>
        </el-form>
  </div>
</template>

<script>

import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
//引入组件
import Tinymce from '@/components/Tinymce'

export default {
    //声明使用富文本编辑器组件
    components:{Tinymce},

    data() {
        return {
            saveBtnDisabled: false,
            //课程基本信息对象
            courseInfo: {
                title: '',  //课程标题
                subjectId: '',//二级分类id
                subjectParentId: '',//一级分类id
                teacherId: '',  //讲师id
                lessonNum: 0,  //课时
                description: '',  //课程简介
                cover: '/static/01.jpg',  //封面的url，默认一张图片
                price: 0  //课程价格
            },
            courseId:'',
            BASE_API: process.env.BASE_API, // 获取接口API地址
            teacherList: [],//封装所有的讲师
            subjectOneList: [],//一级分类
            subjectTwoList: []//二级分类
        }
    },
    created(){
        this.init()
    },
    //监听路由变化，再执行一次init()方法
    //避免从修改页面点击跳转到添加页面时，由于在同一个页面，
    //导致created渲染方法已经加载过，而init()方法不执行导致的页面数据未清空
    watch: {
        $route(to, from) {  //路由发生变化，即切换页面时
            this.init()
        }
    },
    methods: {
        //初始化方法
        init() {
            //判断是否携带id
            if (this.$route.params && this.$route.params.id) {
                //携带id则从路由获取id值
                this.courseId = this.$route.params.id
                //调用根据id查询课程的方法
                this.getInfo()
            } else {//不携带id
                //需要初始化所有的课程分类和讲师
                this.getListTeacher()
                this.getOneSubject()
                //清空表单
                this.courseInfo = {}
                this.courseInfo.cover= '/static/01.jpg'
            }
        },
        //查询所有的一级分类
        getOneSubject(){
            //调用方法
            subject.getAllSubjectList()
            .then(response=>{
                //查询成功把一级分类的list赋给subjectOneList
                //该list会在一级下拉框中迭代展示
                this.subjectOneList = response.data.list
            })
        },
        //点击一级分类，触发change,显示对应的二级分类
        subjectLevelOneChanged(value){
            //当触发change时，自动把一级列表的value值，即一级分类的id获取并传入该方法
            //遍历所有的分类，
            //当value值和某个一级分类的id相同时，取出里面的所有二级分类
            for(var i=0; i<this.subjectOneList.length; i++){
                //取出第i个一级分类
                var oneSubject = this.subjectOneList[i]
                //判断id和value是否相等
                if(value === oneSubject.id){
                    //获取该一级分类的二级分类
                    this.subjectTwoList = oneSubject.children
                    //清空列表框中显示的二级分类的id值(上一次选择一级分类留下的)
                    this.courseInfo.subjectId = ''
                }
            }
        },
        //查询所有讲师
        getListTeacher(){
            //调用方法
            course.getListTeacher()
            .then(response=>{
                //把查询到的讲师列表绑定给teacherList
                this.teacherList = response.data.items
            })
        },

        //上传封面成功的方法
        handleAvatarSuccess(res,file){
            //获取返回的url值（显示图片用）
            this.courseInfo.cover = res.data.url
        },

        //上传封面之前限制图片的类型和大小
        beforeAvatarUpload(file){
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },
        //保存课程信息方法
        save(){
            //调用方法添加课程信息
            course.addCourseInfo(this.courseInfo)
                .then(response => {
                    //提示添加成功
                    this.$message({
                        type: 'success',
                        message: '添加课程信息成功!'
                    });
                    //跳转到编辑课程大纲
                    this.$router.push({ path: '/edu/course/chapter/' + response.data.courseId })
                })
        },
        //修改课程信息
        update() {
            course.updateCourseInfo(this.courseInfo)
                .then(response => {
                    //提示修改成功
                    this.$message({
                        type: 'success',
                        message: '修改课程信息成功!'
                    });
                    //跳转到编辑课程大纲
                    this.$router.push({ path: '/edu/course/chapter/' + this.courseId })
                })
        },
        //点击保存或更新课程信息的方法
        saveOrUpdate() {
            //判断当前请求路径有无id
            if(!this.courseInfo.id){
                this.save()
            }else{
                this.update()
            }
        },
        //根据id获取课程信息
        getInfo(){
            //调用方法查询
            course.getCourseInfoById(this.courseId)
                .then(response => {
                    //获取返回的课程信息
                    this.courseInfo = response.data.courseInfo
                    //查询所有的课程分类
                    subject.getAllSubjectList()
                        .then(response => {
                            //获取一级分类列表
                            this.subjectOneList = response.data.list
                            //迭代一级列表
                            for(var i=0; i<this.subjectOneList.length;i++){
                                //找到跟parent_id相同的那个一级分类
                                var oneSubject = this.subjectOneList[i]
                                if(oneSubject.id===this.courseInfo.subjectParentId){
                                    //获取它的二级分类列表
                                    this.subjectTwoList = oneSubject.children
                                }
                            }
                        })
                        //初始化所有讲师
                        this.getListTeacher()
                })
        }
    }
}
</script>

<style scoped>

.tinymce-container {
  line-height: 29px;
}
</style>