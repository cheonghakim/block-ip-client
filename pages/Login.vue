<script lang="ts">
import Vue, { ref, Ref } from 'vue'
import { useRouter } from '@nuxtjs/composition-api'
import LoginAPI from '../api/app/LoginAPI'
import Utils from '@/static/utils'
import MainLayoutVue from '~/components/MainLayout.vue'

export default Vue.extend({
  name: 'LoginPage',
  components: { MainLayoutVue },
  setup() {
    const router = useRouter()
    const userId: Ref<string> = ref('')
    const password: Ref<string> = ref('')

    const login = async () => {
      try {
        if (!checkValidations()) return
        const loginData = {
          userId: userId.value,
          password: password.value,
        }
        const { data } = await LoginAPI.v1.login(loginData)
        if (data && data.success) {
          // login(loginData)
          alert('성공!')
          router.push('/user/main')
        } else {
          console.error(data.message)
        }
      } catch (error) {
        console.error(error)
      }
    }

    const checkValidations = () => {
      if (Utils.isEmpty(userId.value)) {
        console.error('아이디를 입력하세요.')
        return false
      }

      if (Utils.isEmpty(password.value)) {
        console.error('패스워드를 입력하세요.')
        return false
      }

      return true
    }

    const routeToSignup = () => {
      router.push('/signup')
    }

    return {
      userId,
      password,
      login,
      checkValidations,
      routeToSignup,
    }
  },
})
</script>

<template>
  <MainLayoutVue>
    <section class="d-flex justify-content-center align-items-center mt-4">
      <div class="card col-6">
        <div class="card-body">
          <h4 class="card-title">로그인</h4>

          <input
            v-model="userId"
            type="text"
            placeholder="아이디"
            class="form-control mb-2"
          />

          <input
            v-model="password"
            type="text"
            placeholder="패스워드"
            class="form-control mb-2"
          />

          <div class="d-flex justify-content-between">
            <button class="btn btn-primary w-lg" @click="routeToSignup">
              회원가입
            </button>

            <button class="btn btn-success w-lg" @click="login">로그인</button>
          </div>
        </div>
      </div>
    </section>
  </MainLayoutVue>
</template>
