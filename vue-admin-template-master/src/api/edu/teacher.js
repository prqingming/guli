import request from '@/utils/request'

export default{
    //按条件分页查询讲师
    getTeacherListPage(page,limit,teacherQuery){
        return request({
            //url: '/eduservice/teacher/pageTeacherCondition/'+page+'/'+limit',
            //使用``可以引用变量${}
            url:`/eduservice/teacher/pageTeacherCondition/${page}/${limit}`,
            method: 'post',
            //后台teacherQuery使用了@RequestBody注解，需要使用json传送
            //data表示把对象转换成json传递到接口里
            data: teacherQuery
        })
    },
    //根据id删除讲师
    deleteTeacherById(id){
        return request({
            //url: '/eduservice/teacher/pageTeacherCondition/'+page+'/'+limit',
            //使用``可以引用变量${}
            url:`/eduservice/teacher/${id}`,
            method: 'delete',
        })
    },
    //添加讲师
    addTeacher(teacher){
        return request({
            //url: '/eduservice/teacher/pageTeacherCondition/'+page+'/'+limit',
            //使用``可以引用变量${}
            url:`/eduservice/teacher/addTeacher`,
            method: 'post',
            data: teacher
        })
    },
    //根据id查询讲师
    getTeacherInfo(id){
        return request({
            //url: '/eduservice/teacher/pageTeacherCondition/'+page+'/'+limit',
            //使用``可以引用变量${}
            url:`/eduservice/teacher/getTeacherById/${id}`,
            method: 'get'
        })
    },
    //修改讲师
    updateTeacher(teacher){
        return request({
            //url: '/eduservice/teacher/pageTeacherCondition/'+page+'/'+limit',
            //使用``可以引用变量${}
            url:`/eduservice/teacher/updateTeacher`,
            method: 'post',
            data: teacher
        })
    }
}


