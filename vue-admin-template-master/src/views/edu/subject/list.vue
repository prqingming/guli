<template>
  <div class="app-container">
    <el-input 
        v-model="filterText" 
        placeholder="输入关键词进行检索" 
        style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />
  </div>
</template>

<script>
//调用subject.js的方法
import subject from '@/api/edu/subject'

export default {

  data() {
    return {
      filterText: '',
      data2: [],
      defaultProps: {
        //对应的是一级分类实体类中的children属性
        children: 'children',  
        //对应的是一级分类实体类中的title属性
        label: 'title'  
      }
    }
  },
  created(){
    this.getAllSubjectList()
  },
   watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  methods: {
      //查询所有课程分类的方法
      getAllSubjectList() {
          subject.getAllSubjectList()
              .then(response => {
                  this.data2 = response.data.list
              })
      },
      filterNode(value, data) {
          if (!value) return true
          return data.label.indexOf(value) !== -1
      }
  }
}
</script>
