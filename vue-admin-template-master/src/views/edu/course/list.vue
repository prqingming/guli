<template>
    <div class="app-container">
        课程列表

        <!--查询表单-->
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
                <el-input v-model="courseQuery.title" placeholder="课程名称" />
            </el-form-item>

            <el-form-item>
                <el-select v-model="courseQuery.status" clearable placeholder="课程状态">
                    <el-option value="Normal" label="已发布" />
                    <el-option value="Draft" label="未发布" />
                </el-select>
            </el-form-item>

            <!-- 课程分类 -->
            <el-form-item label="课程分类">
                <!-- 一级分类 -->
                <el-select v-model="courseQuery.subjectParentId" placeholder="一级分类" @change="subjectLevelOneChanged">
                    <el-option v-for="subject in subjectOneList" :key="subject.id" :label="subject.title"
                        :value="subject.id" />
                </el-select>
                <!-- 二级分类 -->
                <el-select v-model="courseQuery.subjectId" placeholder="二级分类">
                    <el-option v-for="subject in subjectTwoList" :key="subject.id" :label="subject.title"
                        :value="subject.id" />
                </el-select>
            </el-form-item>

            <!-- 课程讲师 -->
            <el-form-item label="课程讲师">
                <el-select v-model="courseQuery.teacherId" placeholder="请选择">
                    <el-option v-for="teacher in teacherList" :key="teacher.id" :label="teacher.name"
                        :value="teacher.id" />
                </el-select>
            </el-form-item>

            <el-form-item label="添加时间">
                <el-date-picker v-model="courseQuery.begin" type="datetime" placeholder="选择开始时间"
                    value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" />
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="courseQuery.end" type="datetime" placeholder="选择截止时间"
                    value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" />
            </el-form-item>

            <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
            <el-button type="default" @click="resetData()">清空</el-button>
        </el-form>

        <!-- 表格 -->
        <el-table :data="list" border fit highlight-current-row>

            <el-table-column label="序号" width="150" align="center">
                <template slot-scope="scope">
                    {{ (page - 1) * limit + scope.$index + 1 }}
                </template>
            </el-table-column>

            <el-table-column prop="title" label="课程名称" />

            <el-table-column label="课程状态" width="150">
                <template slot-scope="scope">
                    {{ scope.row.status==='Normal'?'已发布':'未发布' }}
                </template>
            </el-table-column>

            <el-table-column prop="lessonNum" label="课时数" width="150" />

            <el-table-column prop="gmtCreate" label="添加时间" width="200" />

            <el-table-column prop="viewCount" label="浏览数量" width="150" />

            <el-table-column label="操作" width="250" align="center">
                <template slot-scope="scope">
                    <router-link :to="'/edu/course/info/'+scope.row.id">
                        <el-button type="primary" size="mini" icon="el-icon-edit" >编辑课程基本信息</el-button>
                    </router-link>
                    <router-link :to="'/edu/course/chapter/'+scope.row.id">
                        <el-button type="primary" size="mini" icon="el-icon-edit" >编辑课程大纲信息</el-button>
                    </router-link>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeCourseById(scope.row.id)">
                        删除课程信息</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination :current-page="page" :page-size="limit" :total="total"
            style="padding: 30px 0; text-align: center;" layout="total, prev, pager, next, jumper"
            @current-change="getList" />

    </div>
</template>

<script>
//引入调用teacher.js文件
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'

export default {
    //写核心代码位置
    // data:{
    // },
    data() { //定义变量和初始值
        return {
            list: null,//查询之后接口返回集合
            page: 1,//当前页
            limit: 10,//每页记录数
            total: 0,//总记录数
            courseQuery: {}, //条件封装对象
            teacherList: [],//封装所有的讲师
            subjectOneList: [],//一级分类
            subjectTwoList: []//二级分类
        }
    },
    created() { //页面渲染之前执行，一般调用methods定义的方法
        //调用条件查询所有课程的方法，此时条件为空
        this.getList()
        //需要初始化所有的课程分类和讲师
        this.getListTeacher()
        this.getOneSubject()
    },
    methods:{  
        //分页条件查询课程列表的方法
        getList(page = 1) {
            //没传page参数时默认为1，传了参数则取参数值
            this.page = page
            course.getListCourse(this.page,this.limit,this.courseQuery)
                .then(response =>{//请求成功
                    //response接口返回的数据
                    this.list = response.data.rows
                    this.total = response.data.total
                }) 
        },
        //清空条件查询表单的方法
        resetData() {//清空的方法
            //表单输入项数据清空
            this.courseQuery = {}
            //查询所有课程数据
            this.getList()
        },
        //删除课程的方法
        removeCourseById(id){
            //打印是否能获取id
            //alert(id)
            //要考虑用户体验，提示用户是否删除，删除是否成功
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //确认删除，调用删除方法
                course.removeCourse(id)
                    .then(() => {  //删除成功
                        this.getList()  //重写查询所有数据展示页面
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                    })
            })  //取消删除不提示
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
        }
    }
}
</script>
