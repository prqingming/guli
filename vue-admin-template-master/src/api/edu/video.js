import request from '@/utils/request'
export default {

    //添加小节
    addVideo(video) {
        return request({
            url: '/eduservice/video/addVideo',
            method: 'post',
            data: video
          })
    },
    //根据小节id删除小节
    deleteVideo(id) {
        return request({
            url: '/eduservice/video/deleteVideo/'+id,
            method: 'delete'
          })
    },
    //修改小节
    updateVideo(video){
        return request({
            url: '/eduservice/video/updateVideo',
            method: 'post',
            data: video
          })
    },
    //根据id查询小节
    getVideoById(videoId){
        return request({
            url: '/eduservice/video/getVideoById/'+videoId,
            method: 'get'
          })
    },
    //删除视频
    deleteAlyVideo(id){
        return request({
            url: '/eduvod/video/removeAlyVideo/'+id,
            method: 'delete'
          })
    }
}