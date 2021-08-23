<template>
  <div class="exception">
    <!-- <img :src="require('@/assets/img/404.jpg')"/> -->
    <img src="@/assets/404_images/404.jpg" alt="404" />
    <div class="content">
      <h1 class="title">{{ $t("route.page404") }}</h1>
      <div class="desc">{{ $t("route.desc404") }}</div>
      <el-button type="primary">
        <router-link to="/">{{ $t("route.primary404") }}</router-link>
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.exception {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 500px;
  background: #eeeff3;

  img {
    flex: 0 0 60%;
    margin: 50px 152px 0 0;
    width: 60%;
    max-width: 430px;
  }

  .content {
    .title {
      font-size: 72px;
      color: #434e59;
      line-height: 72px;
      font-weight: 600;
      margin-bottom: 24px;
    }

    .desc {
      color: rgba(0, 0, 0, 0.45);
      font-size: 20px;
      line-height: 28px;
      margin-bottom: 16px;
    }

    a {
      color: #fff;
    }
  }
}
</style>

