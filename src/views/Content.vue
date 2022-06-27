<template>
  <div id="content">
    <header>
      <div class="logoWrap">
        <img src="../assets/fontLogo.png" alt="logo" />
      </div>
      <div class="topNav">
        <ul class="topNavBox">
          <li
            @click="getLeftInfo(item)"
            @dblclick="delFolders(item)"
            :class="[topNavType == item ? 'topNavType' : '']"
            :key="index"
            v-for="(item, index) in topNav"
          >
            {{ item }}
          </li>
          <router-link to="/Register" v-show="cookieType === false">
            <li>注册</li>
          </router-link>
          <li v-show="cookieType === true && setType === true">
            <el-button type="text" @click="addNav">添加分类</el-button>
          </li>
          <li @click="edit" v-show="cookieType === true && setType === false">
            编辑
          </li>
          <li @click="end" v-show="cookieType === true && setType === true">
            完成
          </li>
        </ul>
      </div>
    </header>

    <div class="leftNav">
      <ul>
        <li
          class="addDB"
          @click="addNav(topNavType)"
          v-show="topNav && topNav.includes(topNavType) && setType"
        >
          添加二级分类
        </li>
        <li
          v-for="(item, index) in leftNav"
          :key="index"
          @click="activeIndex = item.title"
        >
          <div
            class="title hvc"
            @click="setLNT(item)"
            @dblclick="delFolders(topNavType, leftNavType)"
          >
            {{ item.title }}
            <span v-if="item.value.length === 0">(空分类)</span>
          </div>
          <!-- <div v-show="setType" class="addDB">上传md文件至{{ item.title }}</div> -->
          <el-button
            v-show="setType"
            class="addDB"
            type="text"
            @click="(dialogVisible = true), setleftNavType(item.title)"
            >上传md文件至{{ item.title }}</el-button
          >

          <div
            :class="[
              'dropdown',
              activeIndex == item.title ? 'slide-in' : '',
              activeSubIndex == ite ? 'active' : '',
            ]"
            class="hvc"
            v-for="(ite, inde) in item.value"
            :key="inde"
            @click="getInfo(ite, item.title), (activeSubIndex = ite)"
            @dblclick="delFolders(topNavType, item.title, ite)"
          >
            {{ ite }}
          </div>
        </li>
      </ul>
      <div class="ICP">
        <a href="https://beian.miit.gov.cn/">豫ICP备20014783号</a>
      </div>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="handleClose"
    >
      <el-upload
        ref="upload"
        class="upload-demo"
        drag
        multiple
        :action="upMdUrl"
        :data="{ topNavType, leftNavType, leftNavItemType }"
        accept=".md"
        :before-upload="beforeUpload"
        :limit="12"
        :on-exceed="exceed"
        :clearFiles="clearFiles"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传md文件且单文件不超过100k，最多一次上传12个，上传的文件在分类下已存在则会覆盖。
        </div>
      </el-upload>
    </el-dialog>

    <div class="rightContent">
      <div id="main">
        <mavon-editor
          :externalLink="external_link"
          :value="content"
          :toolbarsFlag="toolbarsFlag"
          :subfield="subfield"
          :defaultOpen="defaultOpen"
        />
      </div>
    </div>
  </div>
</template>

<script>
//  引进组件
import { mapMutations, mapState, mapActions } from "vuex";
import {
  getCookieType,
  addFolder,
  delFolder,
  getTopNav,
  api,
} from "../http/http";
export default {
  data() {
    return {
      setType: false,
      cookieType: false,
      activeSubIndex: null,
      activeIndex: null,
      dialogVisible: false,
      upMdUrl: `${api}/upMd`,
      external_link: {
        markdown_css: function () {
          return "https://cdn.webnote.fun/mavonEditor/github-markdown.min.css";
        },
        hljs_js: function () {
          return "https://cdn.webnote.fun/mavonEditor/highlight.min.js";
        },
        hljs_lang: function (lang) {
          return (
            "https://cdn.webnote.fun/mavonEditor/languages/" + lang + ".min.js"
          );
        },
        hljs_css: function (css) {
          if (css) {
            return (
              "https://cdn.webnote.fun/mavonEditor/styles/" + css + ".min.css"
            );
          }
          return "";
        },
        katex_js: function () {
          return "https://cdn.webnote.fun/mavonEditor/katex.min.js";
        },
        katex_css: function () {
          return "https://cdn.webnote.fun/mavonEditor/katex.min.css";
        },
      },
    };
  },
  //  函数主体
  methods: {
    ...mapMutations(["setTopNavType", "setleftNavItemType", "setleftNavType"]),
    ...mapActions(["setTopNav", "setLeftNav", "setContent"]),

    delFolders(ite, item = null, items = null) {
      if (this.setType) {
        let msg;

        if (!item && !items) {
          msg = `此操作将永久删除 ${ite} 分类的所有内容！`;
        } else if (item && !items) {
          msg = `此操作将永久删除 ${ite} 分类下 ${item} 的所有内容！`;
        } else {
          msg = `此操作将永久删除 ${ite} 分类下 ${item} 分类中的 ${items}`;
        }

        this.$confirm(msg, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let this_ = this;
            async function delf() {
              let a = await delFolder(ite, item, items);
              if (a.data.code === 1) {
                this_.setTopNav();
                this_.setLeftNav();
                this_.$message({
                  type: "success",
                  showClose: true,
                  message: a.data.msg,
                });
              } else {
                this_.$message({
                  type: "warning",
                  showClose: true,
                  message: a.data.msg,
                });
              }
            }
            delf();
          })
          .catch(() => {
            this.$message({
              type: "info",
              showClose: true,
              message: "已取消删除",
            });
          });
      }
    },

    // test() {
    //   window.console.log(
    //     this.topNavType,
    //     this.leftNavType,
    //     this.leftNavItemType
    //   );
    // },

    getLeftInfo(item) {
      this.setleftNavItemType(undefined);
      this.setleftNavType(undefined);
      this.setTopNavType(item);
      this.setLeftNav();
    },

    addNav(tn) {
      this.$prompt(
        "2至16位汉字、数字、字母、英文标点 _ . -",
        "请输入分类名称",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^[a-z0-9A-Z\u4e00-\u9fa5._/-]{2,16}$/,
          inputErrorMessage: "格式不正确",
        }
      )
        .then(({ value }) => {
          let this_ = this;

          async function addf(value) {
            let a;

            if (typeof tn === "string") {
              a = await addFolder(tn, value);
            } else {
              a = await addFolder(value);
            }

            if (a.data.code === 1) {
              if (typeof tn === "string") {
                this_.setLeftNav();
              } else {
                this_.setTopNav();
              }

              this_.$message({
                type: "success",
                showClose: true,
                message: value + "   已添加成功",
              });
            } else {
              this_.$message({
                type: "warning",
                showClose: true,
                message: a.data.msg,
              });
            }
          }
          addf(value);
        })
        .catch(() => {
          this.$message("取消输入");
        });
    },

    edit() {
      let this_ = this;
      this.$confirm(
        "点击添加分类即可在对应位置增加分类，点击上传即可在对应分类下上传.md文件，双击已存在的内容可进行删除,，点击完成退出编辑模式。",
        "编辑操作:",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }
      )
        .then(() => {
          this_.setType = true;
          this.$message({
            type: "success",
            showClose: true,
            message: "进入编辑模式",
          });
        })
        .catch(() => {
          return;
        });
    },

    end() {
      this.setType = false;
      this.$message({
        type: "success",
        showClose: true,
        message: "已退出编辑模式",
      });
    },

    getInfo(l, c) {
      this.setleftNavItemType(l);
      this.setleftNavType(c);
      this.setContent();
    },

    setLNT(item) {
      this.setleftNavType(item.title);
    },
    clearFiles() {
      this.$refs.upload.clearFiles();
    },
    handleClose(done) {
      let this_ = this;

      this.$confirm("确认关闭？")
        .then(() => {
          done();
          this_.setLeftNav();
          this_.clearFiles();
        })
        .catch(() => {});
    },
    beforeUpload(files) {
      if (!(files.name.slice(-3) === ".md")) {
        this.$notify.error({
          title: "上传失败",
          message: `${files.name}不是md文件！`,
          duration: 0,
        });
        return false;
      } else if (files.size > 100 * 1024) {
        this.$notify.error({
          title: "上传失败",
          message: `${files.name}大于100K！`,
          duration: 0,
        });
        return false;
      }

      return true;
    },
    exceed() {
      this.$notify.error({
        title: "上传失败",
        message: `一次最多上传12个文件。`,
        duration: 0,
      });
    },
  },
  created() {
    let this_ = this;
    async function gc() {
      let gct = await getCookieType();
      if (gct.data.code === 1) {
        this_.cookieType = true;
      } else {
        this_.cookieType = false;
      }
    }
    gc();
    async function init() {
      let T = await getTopNav();
      this_.setTopNav(T.data);
      this_.setTopNavType(T.data[0]);
      this_.setLeftNav();
    }
    init();
  },
  //  计算属性
  computed: {
    ...mapState([
      "toolbarsFlag",
      "subfield",
      "defaultOpen",
      "topNav",
      "leftNav",
      "content",
      "topNavType",
      "leftNavType",
      "leftNavItemType",
    ]),
  },
};
</script>


<style lang="less">
@mainColor: #006400;
@borderColor: #84ceaf;

#content {
  & > header {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    border-bottom: 1px solid #ebebeb;
    // z-index: 1;
    min-width: 640px;
    .logoWrap {
      img {
        display: block;
        width: 146px;
        height: 40px;
        margin: 10px 30px;
        // cursor: pointer;
      }
    }
    .topNavBox {
      display: flex;
      li {
        line-height: 56px;
        margin-right: 20px;
        cursor: pointer;
        border-top: 2px solid transparent;
        border-bottom: 2px solid transparent;
      }
      li:hover {
        position: relative;
        left: 2px;
        border-bottom: 2px solid @mainColor;
      }
      .topNavType {
        border-bottom: 2px solid @mainColor;
      }
    }
  }
}
.shqON {
  animation: sfqON 0.2s linear 1;
}
@keyframes sfqON {
  0% {
    height: 42px;
  }
  100% {
    height: auto;
  }
}

@keyframes sfqOFF {
  0% {
    height: auto;
  }
  100% {
    height: 42px;
  }
}
.leftNav {
  position: fixed;
  width: 200px;
  top: 70px;
  left: 0px;
  bottom: 0px;
  overflow-x: hidden;
  overflow-y: auto;
  // background-color: #aaa;
  border-right: 1px solid #f1f1f1;
  ul li {
    padding-left: 20px;
    margin-bottom: 10px;
    text-align: left;
    font-size: 20px;
    &:hover {
      cursor: pointer;
    }
    .title {
      font-weight: bold;
    }
    .dropdown {
      display: none;
      font-size: 14px;
      padding: 6px 0;
      &.slide-in {
        display: block;
      }
      &.active {
        color: #006400;
        font-weight: bold;
      }
    }
  }

  .addDB {
    font-size: 16px;
  }
  .addDB:hover {
    position: relative;
    left: 2px;
  }

  .ICP {
    position: fixed;
    left: 20px;
    bottom: 20px;
  }
}
.rightContent {
  // width: calc(100% - 200px);
  position: absolute;
  right: 0;
  top: 60px;
  bottom: 0px;
  left: 200px;
  z-index: -1;

  // overflow: auto;
}
.hvc:hover {
  color: @mainColor;
}
</style>
