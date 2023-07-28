<script lang="ts">
import Vue, { ref, Ref } from 'vue'
import { useRouter } from '@nuxtjs/composition-api'
import SignupAPI from '../api/app/SignupAPI'
import Utils from '@/static/utils'
import MainLayoutVue from '~/components/MainLayout.vue'
import {
  passwordPattern,
  userIdPattern,
  wholeEmailPattern,
} from '@/static/regex'

export default Vue.extend({
  components: { MainLayoutVue },
  name: 'LoginPage',
  setup() {
    const router = useRouter()
    const userId: Ref<string> = ref('')
    const password: Ref<string> = ref('')
    const passwordCheck: Ref<string> = ref('')
    const email: Ref<string> = ref('')
    const submitted: Ref<boolean> = ref(false)

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
          Vue.prototype.$subject.$emit('success', '성공')
          router.push('/login')
        } else {
          Vue.prototype.$subject.$emit('warning', data.message)
        }
      } catch (error) {
        Vue.prototype.$subject.$emit('error', error)
      }
    }

    const checkValidations = () => {
      submitted.value = true

      if (Utils.isEmpty(userId.value)) {
        Vue.prototype.$subject.$emit('warning', '아이디를 입력하세요.')
        return false
      }

      if (!userIdPattern.test(userId.value)) {
        Vue.prototype.$subject.$emit(
          'warning',
          '아이디 형식은 영문,숫자 4~16자리여야 합니다.'
        )
        return false
      }

      if (Utils.isEmpty(password.value)) {
        Vue.prototype.$subject.$emit('warning', '패스워드를 입력하세요.')
        return false
      }

      if (!passwordPattern.test(password.value)) {
        Vue.prototype.$subject.$emit(
          'warning',
          '패스워드 형식은 영문/숫자 4~16자리여야 합니다.'
        )
        return false
      }

      if (Utils.isEmpty(passwordCheck.value)) {
        Vue.prototype.$subject.$emit('warning', '패스워드 확인을 입력하세요.')
        return false
      }

      if (!passwordPattern.test(passwordCheck.value)) {
        Vue.prototype.$subject.$emit(
          'warning',
          '패스워드 형식은 영문/숫자 4~16자리여야 합니다.'
        )
        return false
      }

      if (password.value !== passwordCheck.value) {
        Vue.prototype.$subject.$emit('warning', '패스워드와 확인값이 다릅니다.')
        return false
      }

      if (Utils.isEmpty(email.value)) {
        Vue.prototype.$subject.$emit('warning', '메일을 입력하세요.')
        return false
      }

      if (!wholeEmailPattern.test(email.value)) {
        Vue.prototype.$subject.$emit('warning', '메일 형식을 확인해 주세요.')
        return false
      }

      submitted.value = false
      return true
    }

    const routeGoBack = () => {
      router.push('/login')
    }

    return {
      userId,
      password,
      passwordCheck,
      email,
      submitted,
      Utils,
      signup,
      checkValidations,
      routeGoBack,
      userIdPattern,
      passwordPattern,
      wholeEmailPattern,
    }
  },
})
</script>

<template>
  <MainLayoutVue>
    <section class="d-flex justify-content-center align-items-center mt-4">
      <div class="card col-3">
        <div class="card-body">
          <h4 class="card-title">회원가입</h4>

          <div class="form-group row mb-2 d-flex justify-content-center">
            <div class="col-12 col-xl-4 col-xxl-4 col-lg-4 col-md-5">
              <label
                for="projectname"
                class="col-form-label col-12 d-flex align-items-center p-0 pb-2"
              >
                아이디
              </label>

              <input
                v-model="userId"
                type="text"
                placeholder="아이디"
                class="form-control mb-2"
                maxlength="20"
                :class="{
                  'is-invalid':
                    submitted &&
                    (Utils.isEmpty(userId) ||
                      !userIdPattern.test(userId.value)),
                }"
              />

              <div class="mt-1 text-secondary" style="padding-left: 0.5rem">
                ex) demo123
              </div>
            </div>
          </div>

          <div class="form-group row mb-2 d-flex justify-content-center">
            <div class="col-12 col-xl-4 col-xxl-4 col-lg-4 col-md-5">
              <label
                for="projectname"
                class="col-form-label col-12 d-flex align-items-center p-0 pb-2"
              >
                패스워드
              </label>

              <input
                v-model="password"
                type="password"
                placeholder="패스워드"
                class="form-control mb-2"
                maxlength="20"
                :class="{
                  'is-invalid':
                    submitted &&
                    (Utils.isEmpty(password) ||
                      !passwordPattern.test(password.value)),
                }"
              />

              <div class="mt-1 text-secondary" style="padding-left: 0.5rem">
                ex) pw123
              </div>
            </div>
          </div>

          <div class="form-group row mb-2 d-flex justify-content-center">
            <div class="col-12 col-xl-4 col-xxl-4 col-lg-4 col-md-5">
              <label
                for="projectname"
                class="col-form-label col-12 d-flex align-items-center p-0 pb-2"
              >
                패스워드 확인
              </label>

              <input
                v-model="passwordCheck"
                type="password"
                placeholder="패스워드 확인"
                class="form-control mb-2"
                maxlength="20"
                :class="{
                  'is-invalid':
                    submitted &&
                    (Utils.isEmpty(passwordCheck) ||
                      !passwordPattern.test(passwordCheck.value)),
                }"
              />

              <div class="mt-1 text-secondary" style="padding-left: 0.5rem">
                ex) pw123
              </div>
            </div>
          </div>

          <div class="form-group row mb-2 d-flex justify-content-center">
            <div class="col-12 col-xl-4 col-xxl-4 col-lg-4 col-md-5">
              <label
                for="projectname"
                class="col-form-label col-12 d-flex align-items-center p-0 pb-2"
              >
                이메일
              </label>

              <input
                v-model="email"
                type="text"
                placeholder="이메일"
                class="form-control mb-2"
                maxlength="40"
                :class="{
                  'is-invalid':
                    submitted &&
                    (Utils.isEmpty(email) ||
                      !wholeEmailPattern.test(email.value)),
                }"
              />

              <div class="mt-1 text-secondary" style="padding-left: 0.5rem">
                ex) demo123@example.com
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-between pt-2">
            <button class="btn btn-secondary w-lg" @click="routeGoBack">
              로그인
            </button>
            <button class="btn btn-success w-lg" @click="signup">
              회원가입 신청
            </button>
          </div>
        </div>
      </div>
    </section>
  </MainLayoutVue>
</template>
