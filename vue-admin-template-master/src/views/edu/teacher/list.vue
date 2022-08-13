<template>
    <div class="app-container">
        <!--查询表单
        :inline="true" 在一行显示
        注意：
        element-ui的 date-picker组件默认绑定的时间值是默认世界标准时间，和中国时间差8小时
        设置 value-format="yyyy-MM-dd HH:mm:ss" 改变绑定的值
        -->
        <el-form :inline="true" class="demo-form-inline">
            <el-form-item>
                <!-- teacherQuery.name 查询条件的属性 -->
                <el-input v-model="teacherQuery.name" placeholder="讲师名" />
            </el-form-item>
            <el-form-item>
                <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
                    <el-option :value="1" label="高级讲师" />
                    <el-option :value="2" label="首席讲师" />
                </el-select>
            </el-form-item>
            <el-form-item label="添加时间">
                <el-date-picker v-model="teacherQuery.begin" type="datetime" placeholder="选择开始时间"
                    value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" />
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="teacherQuery.end" type="datetime" placeholder="选择截止时间"
                    value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" />
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
            <el-button type="default" @click="resetData()">清空</el-button>
        </el-form>

        <!-- 表格 
            :data = v-bind:data单向绑定-->
        <el-table :data="list" element-loading-text="数据加载中" border fit highlight-current-row>
            <el-table-column label="序号" width="70" align="center">

                <template slot-scope="scope">
                    {{ (page - 1) * limit + scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="名称" width="80" />
            <el-table-column label="头衔" width="80">
                <!-- level为1显示高级讲师，为2是首席讲师
                    ==判断值
                    ===判断类型和值 -->
                <template slot-scope="scope">
                    {{ scope.row.level===1?'高级讲师':'首席讲师' }}
                </template>
            </el-table-column>
            <el-table-column prop="intro" label="资历" />
            <el-table-column prop="gmtCreate" label="添加时间" width="160" />
            <el-table-column prop="sort" label="排序" width="60" />
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <!-- 进行路由的跳转
                         附加上当前teacher的id -->
                    <router-link :to="'/edu/teacher/edit/'+scope.row.id">
                        <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
                    </router-link>
                    <!-- scope是整个表格的数据，.row是一列某数据，取其中的id，根据id删除 -->
                    <el-button type="danger" size="mini" icon="el-icon-delete" 
                               @click="removeDataById(scope.row.id)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 
        @current-change = v-on：current-change 绑定事件
        美进行分页切换的时候就调用一次getList方法进行教师列表的分页查询-->
        <el-pagination :current-page="page" :page-size="limit" :total="total"
            style="padding: 30px 0; text-align: center;" layout="total, prev, pager, next, jumper"
            @current-change="getList" />
    </div>
</template>

<script>
//调用teacher.js的方法
//import teacher from '@api/edu/teacher.js'
import teacher from '@/api/edu/teacher'

export default {
    //写核心代码的位置
    data(){  //定义变量和初始值
        return{
            list:[],  //查询之后接口返回集合
            page:1,  //当前页数
            limit:10,  //每页记录数
            total:0,  //查询到的总记录数
            teacherQuery:{}  //查询讲师的条件封装对象
        }
    },
    created(){  //页面渲染之前，一般执行methons里定义的方法
        this.getList()  //调用方法
    },
    methods:{  //创建具体的方法，调用teacher.js里的方法
        //分页条件查询讲师
        getList(page = 1){
            //没传page参数时默认为1，传了参数则取参数值
            this.page = page
            //调用teacher.js里的方法,相当于axios里的第一部分
            teacher.getTeacherListPage(this.page,this.limit,this.teacherQuery)
            .then(response =>{
                //response为接口返回的数据
                //console.log(response)
                this.list = response.data.rows
                this.total= response.data.total
                console.log(this.list)
                console.log(this.total)
            })  //请求成功
            .catch(error =>{
                console.log(error)
            })  //请求失败
        },
        //清空条件查询的文本框的方法
        resetData(){ 
            //1.清空表单输入的数据,teacherQuery的数据是双向绑定的
            //把它清空，表单中的数据也清空了
            this.teacherQuery = {}
            //2.查询所有讲师数据
            this.getList()
        },
        //根据id删除讲师的方法
        removeDataById(id){
            //打印是否能获取id
            //alert(id)
            //要考虑用户体验，提示用户是否删除，删除是否成功
            this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //确认删除，调用删除方法
                teacher.deleteTeacherById(id)
                    .then(() => {  //删除成功
                        this.getList()  //重写查询所有数据展示页面
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                    })
            })  //取消删除不提示
        }
    }
}
</script>
