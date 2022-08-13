import request from '@/utils/request'
export default {
    //1 添加课程信息
    addCourseInfo(courseInfoVo) {
        return request({
            url: '/eduservice/course/addCourseInfo',
            method: 'post',
            data:courseInfoVo
          })
    },
    //2 查询所有讲师
    getListTeacher() {
        return request({
            url: '/eduservice/teacher',
            method: 'get'
          })
    },
    //3 根据id查询课程信息
    getCourseInfoById(courseId){
        return request({
            url: `/eduservice/course/getCourseById/${courseId}`,
            method: 'get'
          })
    },
    //根据课程id多表查询课程信息
    getPublihCourseInfo(courseId){
      return request({
        url: `/eduservice/course/getPublishCourseInfo/${courseId}`,
        method: 'get'
      })
    },
   //4 更新课程信息
   updateCourseInfo(courseInfoVo) {
    return request({
        url: '/eduservice/course/updateCourseInfo',
      method: 'post',
      data: courseInfoVo
    })
  },
  //发布课程
  publihCourse(courseId){
    return request({
      url: `/eduservice/course/publishCourse/${courseId}`,
      method: 'post'
    })
  },
  //分页条件查询课程
  getListCourse(page,limit,courseQuery){
    return request({
      url: `/eduservice/course/pageQueryCourse/${page}/${limit}`,
      method: 'post',
      data:courseQuery
    })
  },
  //根据课程id删除课程
  removeCourse(courseId){
    return request({
      url: `/eduservice/course/deleteCourse/${courseId}`,
      method: 'delete'
    })
  }
}
