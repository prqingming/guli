import request from '@/utils/request'

export default{
    //查询所有课程分类
    getAllSubjectList(){
        return request({
            //url: '/eduservice/teacher/pageTeacherCondition/'+page+'/'+limit',
            //使用``可以引用变量${}
            url:`/eduservice/subject/getAllSubject`,
            method: 'get'
        })
    }
}


