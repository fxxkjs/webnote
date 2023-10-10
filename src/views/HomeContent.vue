<template>
  <div id="content">
    <header>
      <div class="logoWrap">
        <img src="../assets/fontLogo.png" alt="logo" />
      </div>
      <div class="topNav">
        <div class="topNavBox">
          <div @click="addNav" v-show="cookieType === true && setType === true">
            <icon-svg iconname="wenjianjiatianjia" />
          </div>
          <div @click="getLeftInfo(item)" :class="[topNavType == item ? 'topNavType' : '']" :key="index"
            v-for="(item, index) in topNav">
            {{ item }}
            <span v-if="leftNav.length === 0 && topNavType === item">(空)</span>
            <i @click="delFolders(item)" v-show="cookieType === true && setType === true">
              <icon-svg iconname="wenjianjiashanchu" /></i>
          </div>

          <div @click="registerDialogVisible = true" v-show="cookieType === false">
            注册
          </div>
          <div @click="edit" v-show="cookieType === true && setType === false">
            编辑
          </div>
          <div @click="end" v-show="cookieType === true && setType === true">
            退出
          </div>
        </div>
      </div>
    </header>
    <!-- <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-xxx"></use>
    </svg> -->
    <div class="leftNav">
      <ul>
        <li @click="addNav(topNavType)" v-show="topNav && topNav.includes(topNavType) && setType">
          <icon-svg iconname="wenjianjiatianjia" />
        </li>

        <li v-for="(item, index) in leftNav" :key="index" @click="activeIndex = item.title">
          <div class="title hvc" @click="setLNT(item)">
            {{ item.title }}
            <i @click="setleftNavType(item.title), addMd(topNavType, item.title)"
              v-show="cookieType === true && setType === true"><icon-svg iconname="jurassic_add-blankform" /></i>
            <i @click="setleftNavType(item.title), (upDialogVisible = true)"
              v-show="cookieType === true && setType === true"><icon-svg iconname="wenjianshangchuan" /></i>
            <i @click="
              setleftNavType(item.title), delFolders(topNavType, leftNavType)
              " v-show="cookieType === true && setType === true"><icon-svg iconname="wenjianjiashanchu" /></i>
            <span v-if="item.value.length === 0">(空)</span>
          </div>

          <div :class="[
            'dropdown',
            activeIndex == item.title ? 'slide-in' : '',
            activeSubIndex == ite ? 'active' : '',
          ]" class="hvc" v-for="(ite, inde) in item.value" :key="inde"
            @click="getInfo(ite, item.title), (activeSubIndex = ite), pageUp()">
            {{ ite }}
            <i @click="delFolders(topNavType, item.title, ite)" v-show="cookieType === true && setType === true"><icon-svg
                iconname="wenjianshanchu" /></i>
            <i @click="setMdName(topNavType, leftNavType, ite)" v-show="cookieType === true && setType === true"><icon-svg
                iconname="zhongmingming" /></i>
          </div>
        </li>
      </ul>

      <div class="ICP">
        <a href="https://beian.miit.gov.cn/" style="color: #c0c0c0">豫ICP备20014783号-1</a>
      </div>
    </div>

    <el-dialog title="提示" :visible.sync="upDialogVisible" width="400px" :before-close="handleClose">
      <el-upload ref="upload" class="upload-demo" drag multiple :action="upMdUrl" :data="{ topNavType, leftNavType }"
        accept=".md" :before-upload="beforeUpload" :limit="12" :on-exceed="exceed" with-credentials>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          一次最多上传12个md文件，大小不超100k。同分类相同文件名覆盖保存。文件名不能包含以下字符\|/&lt;?&gt;:"'`*^()
        </div>
      </el-upload>
    </el-dialog>

    <el-dialog :show-close="false" :visible.sync="registerDialogVisible" width="350px" :showClose="false"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="register">
        <el-input v-model="username" placeholder="请输入邮箱" :input="onReg()" clearable></el-input>
        <el-input placeholder="请输入 6-16 位密码" v-model="password" show-password clearable></el-input>
        <el-input placeholder="请输入验证码" v-model="code" onkeyup="this.value=this.value.replace(/\D/g,'')" clearable>
          <el-button slot="append" :icon="mailIcon" @click="getCode" :loading="mailButLod"
            :disabled="mailButDis"></el-button>
        </el-input>
        <el-button type="primary" :loading="loading" :disabled="logInDisabled" @click="reg">注册/登录</el-button>
        <el-button type="primary" @click="registerDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <div class="rightContent">
      <div id="mainw">
        <mavon-editor id="main" ref="md" @save="save" @imgAdd="$imgAdd" @imgDel="$imgDel" @change="change"
          :imageFilter="imageFilter" :externalLink="external_link" :value="content" :toolbarsFlag="toolbarsFlag"
          :subfield="subfield" :defaultOpen="defaultOpen" :toolbars="toolbars"></mavon-editor>
      </div>
    </div>
  </div>
</template>

<script>
//  引进组件
import {
  api,
  upImg,
  upMdData,
  register,
  getCookieType,
  addFolder,
  delFolder,
  setSession,
  getCode,
  delImg,
  queryImg,
  addMd,
  setMdName,
} from "../http/http";
import { mapMutations, mapState, mapActions } from "vuex";
import "../icon/iconfont.css";

export default {
  data() {
    return {
      upMdIngType: false,
      value: null,
      toolbarsFlag: false,
      subfield: false,
      defaultOpen: "preview",
      loading: false,
      username: "",
      password: "",
      code: "",
      mailIcon: "el-icon-message",
      mailButLod: false,
      mailButDis: true,
      setType: false,
      cookieType: false,
      activeSubIndex: null,
      activeIndex: null,
      upDialogVisible: false,
      registerDialogVisible: false,
      upMdUrl: `${api}/upMd`,
      logInDisabled: true,
      img_file: {},
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
        },
        katex_js: function () {
          return "https://cdn.webnote.fun/mavonEditor/katex.min.js";
        },
        katex_css: function () {
          return "https://cdn.webnote.fun/mavonEditor/katex.min.css";
        },
      },
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        // fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        // undo: true, // 上一步
        // redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true, // 预览
      },
    };
  },
  //  函数主体
  methods: {
    ...mapMutations(["setTopNavType", "setleftNavItemType", "setleftNavType"]),
    ...mapActions(["setTopNav", "setLeftNav", "setContent"]),

    // 重置滚动条
    pageUp() {
      document.getElementsByClassName("v-show-content")[0].scrollTop = 0;
    },
    //  新建md文件
    addMd(tn, ln) {
      this.$prompt(
        "2至30位汉字、数字、字母、英文标点 _ . -/ 以及空格",
        "请输入文件名",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^[a-z0-9A-Z\u4e00-\u9fa5_./-\s]{2,30}$/,
          inputErrorMessage: "格式不正确",
        }
      )
        .then(({ value }) => {
          let this_ = this;
          addMd(tn, ln, value).then(
            (req) => {
              if (req.data.code === 1) {
                this_.setLeftNav(tn);
                this.$message({
                  type: "success",
                  message: `${req.data.msg}`,
                });
              } else {
                this.$alert(`${req.data.msg}`, "创建失败");
              }
            },
            () => {
              this.$alert(`网络繁忙，请稍后重试`, "创建失败");
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    // 重命名md文件
    setMdName(tn, ln, name) {
      this.$prompt(
        "2至30位汉字、数字、字母、英文标点 _ . -/ 以及空格",
        "请输入新的文件名",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^[a-z0-9A-Z\u4e00-\u9fa5_./-\s]{2,30}$/,
          inputErrorMessage: "格式不正确",
          inputValue: name,
        }
      )
        .then(({ value }) => {
          let this_ = this;
          setMdName(tn, ln, name, value).then(
            (req) => {
              if (req.data.code === 1) {
                this_.setLeftNav(tn);
                this.$message({
                  type: "success",
                  message: `${req.data.msg}`,
                });
              } else {
                this.$alert(`${req.data.msg}`, "重命名失败");
              }
            },
            () => {
              this.$alert(`网络繁忙，请稍后重试`, "重命名失败");
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    // 保存编辑栏数据
    change(value) {
      this.value = value;
    },
    // 上传md数据
    async upMd() {
      let req = await upMdData(
        this.topNavType,
        this.leftNavType,
        this.leftNavItemType,
        this.value
      );
      if (req.data.code === 0) {
        this.$message({
          message: req.data.msg,
          type: "warning",
        });
      } else {
        this.$message({
          message: req.data.msg,
          type: "success",
        });
      }
    },
    // 上传md数据diff
    async save() {
      if (this.upMdIngType) {
        this.$alert("图片上传中，请稍后。", "暂时不能保存");
        return;
      }
      let imgDiff = this.imgDiff();

      let sub = await new Promise((res) => {
        if (imgDiff.sub.length !== 0) {
          let imgstr = ``;
          imgDiff.sub.forEach((item) => {
            imgstr = `${imgstr}<p>${item}</p>`;
          });
          this.$confirm(imgstr, "检测到在编辑区手动删除了下列图片", {
            dangerouslyUseHTMLString: true,
            distinguishCancelAndClose: true,
            confirmButtonText: "确认删除并保存",
            cancelButtonText: "检查一下",
          })
            .then(() => {
              imgDiff.sub.forEach((item) => {
                this.$imgDel(item);
              });
              let arr = this.$refs.md.$refs.toolbar_left.img_file;
              let newArr = [];
              arr.forEach((item) => {
                if (typeof item[0] === "number" || item[0] === 0) {
                  if (!item[0] === 0) {
                    // toolBarImgName.push(item[1].name);
                  }
                } else {
                  if (!imgDiff.sub.includes(item[0].substring(item[0].lastIndexOf("/") + 1))) {
                    newArr.push(item);
                  }
                }
              });
              this.$refs.md.$refs.toolbar_left.img_file = newArr;
              res(true);
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "未保存",
              });
              res(false);
            });
        } else {
          res(true);
        }
      });

      if (sub) {
        if (imgDiff.add.length !== 0) {
          queryImg(imgDiff.add).then((req) => {
            if (req.data.code === 1) {
              this.upMd();
            } else {
              let imgstr = ``;
              req.data.data.forEach((item) => {
                imgstr = `${imgstr}<p>${item}</p>`;
              });
              this.$confirm(imgstr, "检测到在编辑区手动添加了不存在的图片", {
                dangerouslyUseHTMLString: true,
                distinguishCancelAndClose: true,
                confirmButtonText: "确认无误并保存",
                cancelButtonText: "检查一下",
              })
                .then(() => {
                  this.upMd();
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "未保存",
                  });
                });
            }
          });
        } else {
          this.upMd();
        }
      }
    },
    // img差异
    imgDiff() {
      let newMdImg = this.getMdImg(this.value);
      let newMdImgName = [];
      let toolBarImg = this.$refs.md.$refs.toolbar_left.img_file.slice(1);
      let toolBarImgName = [];
      let imgDiffObj = { add: [], sub: [] };
      newMdImg.forEach((item) => {
        newMdImgName.push(item[2].substring(item[2].lastIndexOf("/") + 1));
      });
      toolBarImg.forEach((item) => {
        if (typeof item[0] === "number") {
          toolBarImgName.push(item[1].name);
        } else {
          toolBarImgName.push(item[0].substring(item[0].lastIndexOf("/") + 1));
        }
      });
      newMdImgName.forEach((item) => {
        if (!toolBarImgName.includes(item)) {
          imgDiffObj.add.push(item);
        }
      });
      toolBarImgName.forEach((item) => {
        if (!newMdImgName.includes(item)) {
          imgDiffObj.sub.push(item);
        }
      });
      return imgDiffObj;
    },
    // 上传md图片
    async $imgAdd(imgKey, imgData) {
      this.upMdIngType = true;
      let req = await upImg(imgData);
      if (req.data.code === 1) {
        this.upMdIngType = false;
        this.$message({ message: req.data.msg, type: "success" });
        this.$refs.md.$img2Url(imgKey, req.data.imgUrl);
      } else {
        this.upMdIngType = false;
        this.$alert(req.data.msg, "上传失败");
      }
    },
    // md图片校验
    imageFilter(fileInfo) {
      if (/(?=.*[\\|/<>?:"'`*^()]).+/.test(fileInfo.name)) {
        this.$alert(`${fileInfo.name} 名包含特殊字符！`, "上传失败");
        return false;
      } else if (fileInfo.size > 1024 * 1000 * 2) {
        this.$alert(`${fileInfo.name} 大于2M！`, "上传失败");
        return false;
      } else if (!/.(jpg|jpeg|gif|png)$/.test(fileInfo.type)) {
        this.$alert(
          `${fileInfo.name} 不属于jpg、jpeg、gif、png 格式！`,
          "上传失败"
        );
        return false;
      }
      return true;
    },
    // 删除md图片
    async $imgDel(pos) {
      let imgName;
      if (typeof pos === "string") {
        imgName = pos;
      } else {
        imgName = pos[0].substring(pos[0].lastIndexOf("/") + 1);
        // imgName = pos[1].miniurl.substring(pos[1].miniurl.lastIndexOf("/") + 1);
      }
      let req = await delImg(imgName);
      if (req.data.code === 1) {
        delete this.img_file[pos];
        this.$message({ message: req.data.msg, type: "success" });
      } else {
        this.$alert(req.data.msg, "失败");
      }
    },
    // 账号密码校验
    onReg() {
      let mailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      mailReg.test(this.username) && this.mailIcon === "el-icon-message"
        ? (this.mailButDis = false)
        : (this.mailButDis = true);
      if (
        mailReg.test(this.username) &&
        this.password.length >= 6 &&
        this.code.length === 6 &&
        this.password.length <= 16
      ) {
        this.logInDisabled = false;
      } else {
        this.logInDisabled = true;
      }

      // this.mailButDis = false;
      // this.logInDisabled = false;
    },
    // 注册
    async reg() {
      this.loading = true;
      let req = await register(this.username, this.password, this.code);
      if (req.data.code === 1) {
        let r = await getCookieType();
        if (r.data.code === 1) {
          this.loading = false;
          this.registerDialogVisible = false;
          this.cookieType = true;
          this.init()
          this.$message({ message: req.data.msg, type: "success" });
        } else {
          this.password = "";
          this.$alert(req.data.msg, "失败");
          this.loading = false;
        }
      } else {
        this.username = null;
        this.password = "";
        this.$alert(`${req.data.msg}`, "失败11111");
        this.loading = false;
      }
    },
    // 获取验证码
    async getCode() {
      this.mailButLod = true;
      let req = await getCode(this.username);
      if (req.data.code === 1) {
        this.mailIcon = "el-icon-check";
        this.mailButLod = false;
        this.mailButDis = true;
        setTimeout(() => {
          this.mailIcon = "el-icon-message";
          this.mailButDis = false;
        }, 60000);
      } else {
        this.mailButLod = false;
        this.mailButDis = false;
        this.username = "";
        this.password = "";
        this.code = "";
        this.$alert("请稍后重试或更换有效邮箱。", "发送失败，");
      }
    },
    // 删除内容
    delFolders(ite, item = null, items = null) {
      if (this.setType) {
        let msg;
        if (!item && !items) {
          msg = `此操作将永久删除 ${ite} 分类中的所有内容！`;
        } else if (item && !items) {
          msg = `此操作将永久删除 ${ite} 分类下 ${item} 中的所有内容！`;
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
                await this_.setTopNav();
                await this_.setLeftNav();
                !item && !items ? this_.setTopNavType() : "";
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
    // 获取左侧导航数据
    getLeftInfo(item) {
      this.setleftNavItemType(undefined);
      this.setleftNavType(undefined);
      this.setTopNavType(item);
      this.setLeftNav();
    },
    // 添加分类
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
    // 进入编辑模式
    edit() {
      let this_ = this;
      this.$confirm(
        `<div id="iconW">
    <div>
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-wenjianjiatianjia"></use>
        </svg> :新增分类
    </div>
    <div>
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-wenjianjiashanchu"></use>
        </svg> :删除分类
    </div>

    <div>
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-jurassic_add-blankform"></use>
        </svg> :新建md文件
    </div>
    <div>
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-wenjianshangchuan"></use>
        </svg> :上传md文件
    </div>
    <div>
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-wenjianshanchu"></use>
        </svg> :删除md文件
    </div>
    <div>
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zhongmingming"></use>
        </svg> :重命名md文件
    </div>
    <div>图片限 jpg，jpeg，png，gif，大小2M。</div>
    <div>个人学习项目仅供娱乐，不对数据做任何保障。</div>
</div>`,
        "提示:",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
        }
      )
        .then(() => {
          this_.setType = true;
          this_.toolbarsFlag = true;
          this_.subfield = true;
          this.addImgList();
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
    // 退出编辑模式
    end() {
      this.setType = false;
      this.toolbarsFlag = false;
      this.subfield = false;
      this.$message({
        type: "success",
        showClose: true,
        message: "已退出编辑模式",
      });
    },
    // 获取文档数据
    getInfo(l, c) {
      this.setleftNavItemType(l);
      this.setleftNavType(c);
      this.$refs.md.$refs.toolbar_left.img_file = [[0, null]];
      this.setContent().then(() => {
        this.addImgList();
      });
    },
    // 获取当前文档中/图片
    getMdImg(txt) {
      let reg = /!\[(.*?)\]\((.*?)\)/gm;
      let imgarr = [];
      let img;

      while ((img = reg.exec(txt)) !== null) {
        if (img[2].includes("https://api.webnote.fun/getimg/")) {
          imgarr.push(img);
        }
      }

      return imgarr;
    },
    // 图片添加到列表
    addImgList() {
      if (this.setType) {
        let imgarr = this.getMdImg(this.content);
        imgarr.forEach((item) => {
          this.$refs.md.$refs.toolbar_left.$imgAddByFilename(`${item[2]}`, {
            name: item[1],
            miniurl: item[2],
            _name: item[1],
          });
        });
      }
    },
    setLNT(item) {
      this.setleftNavType(item.title);
    },
    // 更新leftNavz数据并清空上传列表
    handleClose(done) {
      done();
      this.setLeftNav();
      this.$refs.upload.clearFiles();
    },
    // md条件校验
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
      } else if (/(?=.*[\\|/<>?:"'`*^()]).+/.test(files.name.slice(0, -3))) {
        this.$notify.error({
          title: "上传失败",
          message: `${files.name} 文件名包含特殊字符！`,
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
    // 初始化数据
    async init() {
      await this.setTopNav();
      await this.setTopNavType();
      await this.setLeftNav();
    }
  },
  created() {

    getCookieType().then((req) => {
      req.data.code === 1
        ? (this.cookieType = true)
        : (this.cookieType = false);
    });
    setSession();
    this.init()
    if (!navigator.vendor.includes("Apple")) {
      console.log(`
          ___  __        __  ___  ___
    |  | |__  |__) |\\ | /  \\  |  |__
    |/\\| |___ |__) | \\| \\__/  |  |___

    `);
    }
  },
  //  计算属性

  computed: {
    ...mapState([
      "topNav",
      "leftNav",
      "content",
      "topNavType",
      "leftNavType",
      "leftNavItemType",
    ]),
  },
  // mounted() {},
  // components: {},
};
</script>

<style lang="less">
@mainColor: #006400;
@borderColor: #84ceaf;

#content {
  &>header {
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

      &>div {
        line-height: 56px;
        margin-right: 20px;
        cursor: pointer;
        border-top: 2px solid transparent;
        border-bottom: 2px solid transparent;
      }

      >div:hover {
        // position: relative;
        // left: 2px;
        border-bottom: 2px solid @mainColor;
      }

      .topNavType {
        border-bottom: 2px solid @mainColor;
      }
    }
  }

  .register {
    // padding: 20px;
    // margin: auto;
    // margin-top: 100px;
    // border: 1px solid #aaa;
    // width: 300px;

    &>* {
      margin-bottom: 6px;
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
  // border-right: 1px solid #f1f1f1;
  // list-style: none;
  &>ul {
    padding: 0;
    color: #000;

    li {
      padding-left: 20px;
      margin-bottom: 10px;
      text-align: left;
      font-size: 20px;
      list-style: none;
      text-decoration: none;

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
  // z-index: -1;

  #mainw {
    height: 100%;

    #main {
      height: 100%;
    }
  }
}

.hvc:hover {
  color: @mainColor;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

#iconW {
  font-size: 18px;
}
</style>
