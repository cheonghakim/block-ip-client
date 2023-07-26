<script lang="ts">
import Vue, { ref, Ref } from 'vue'
import { useRouter } from '@nuxtjs/composition-api'
import SignupAPI from '../api/app/SignupAPI'
import Utils from '@/static/utils'

export default Vue.extend({
  name: 'LoginPage',
  middleware: ['userAuth'],
  setup() {
    const router = useRouter()
    const userId: Ref<string> = ref('')
    const password: Ref<string> = ref('')
    const passwordCheck: Ref<string> = ref('')
    const email = ref('')

    const signup = async () => {
      try {
        if (!checkValidations()) return
        const signupData = {
          userId: userId.value,
          password: password.value,
          email: email.value,
        }
        const { data } = await SignupAPI.v1.signup(signupData)
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

      if (Utils.isEmpty(passwordCheck.value)) {
        console.error('패스워드 확인을 입력하세요.')
        return false
      }

      if (password.value !== passwordCheck.value) {
        console.error('패스워드와 확인값이 다릅니다.')
        return false
      }

      if (Utils.isEmpty(email.value)) {
        console.error('메일을 입력하세요.')
        return false
      }

      return true
    }

    return {
      userId,
      password,
      passwordCheck,
      email,
      signup,
      checkValidations,
    }
  },
})
</script>

<template>
  <section>
    <div class="card">
      <div class="card-body">
        <input
          v-model="userId"
          type="text"
          placeholder="아이디"
          class="form-control"
        />

        <input
          v-model="password"
          type="text"
          placeholder="패스워드"
          class="form-control"
        />

        <input
          v-model="passwordCheck"
          type="text"
          placeholder="패스워드 확인"
          class="form-control"
        />

        <input
          v-model="email"
          type="text"
          placeholder="이메일"
          class="form-control"
        />
        <button class="btn btn-success w-lg" @click="signup">회원가입</button>
      </div>
    </div>
  </section>
</template>
