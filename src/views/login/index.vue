<script setup lang="ts">
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
import { useNav } from "@/layout/hooks/useNav";
import type { FormInstance } from "element-plus";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import { initRouter, getTopMenu } from "@/router/utils";
import { bg, avatar, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, reactive, toRaw, onMounted, onBeforeUnmount } from "vue";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import dayIcon from "@/assets/svg/day.svg?component";
import darkIcon from "@/assets/svg/dark.svg?component";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";
import Iphone from "@iconify-icons/ep/iphone";

defineOptions({
  name: "Login"
});
const value = ref("短信登录");
const options = ["短信登录", "密码登录"];
const router = useRouter();
const loading = ref(false);
const ruleFormRef = ref<FormInstance>();

const { initStorage } = useLayout();
initStorage();

const { dataTheme, overallStyle, dataThemeChange } = useDataThemeChange();
dataThemeChange(overallStyle.value);
const { title } = useNav();

const ruleForm = reactive({
  user_name: "",
  passwd: ""
});

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      loading.value = true;
      useUserStoreHook()
        .loginByUsername({
          user_name: ruleForm.user_name,
          passwd: ruleForm.passwd
        })
        .then(res => {
          if (true) {
            // 获取后端路由
            return initRouter().then(() => {
              router.push(getTopMenu(true).path).then(() => {
                message("登录成功", { type: "success" });
              });
            });
          } else {
            message("登录失败11", { type: "error" });
          }
        })
        .finally(() => (loading.value = false));
    }
  });
};

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (code === "Enter") {
    onLogin(ruleFormRef.value);
  }
}

onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <h2 class="outline-none">{{ title }}</h2>
          </Motion>
          <div class="login-type">
            <div class="custom-style">
              <el-segmented v-model="value" :options="options" />
            </div>
          </div>
          <!-- 密码登录 -->
          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
            v-if="value === '密码登录'"
          >
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                  }
                ]"
                prop="user_name"
              >
                <el-input
                  v-model="ruleForm.user_name"
                  clearable
                  placeholder="账号"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  v-model="ruleForm.passwd"
                  clearable
                  show-password
                  placeholder="密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>
          </el-form>
          <!-- 短信登录 -->
          <el-form ref="ruleFormRef" size="large" v-if="value === '短信登录'">
            <Motion>
              <el-form-item prop="phone">
                <el-input
                  clearable
                  placeholder="手机号码"
                  :prefix-icon="useRenderIcon(Iphone)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="100">
              <el-form-item prop="verifyCode">
                <div class="w-full flex justify-between">
                  <el-input
                    clearable
                    placeholder="验证码"
                    :prefix-icon="useRenderIcon('ri:shield-keyhole-line')"
                  />
                  <el-button class="ml-2">获取验证码</el-button>
                </div>
              </el-form-item>
            </Motion>
          </el-form>
          <!-- 登录按钮 -->
          <Motion :delay="250">
            <el-button
              class="w-full mt-4"
              size="default"
              type="primary"
              :loading="loading"
              @click="onLogin(ruleFormRef)"
            >
              登录
            </el-button>
          </Motion>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
