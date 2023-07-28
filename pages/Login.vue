<script lang="ts">
import Vue, { ref, Ref } from 'vue'
import { useRouter } from '@nuxtjs/composition-api'
import LoginAPI from '../api/app/LoginAPI'
import Utils from '@/static/utils'
import MainLayoutVue from '~/components/MainLayout.vue'
import PasswordForm from '~/components/PasswordForm.vue'
import { passwordPattern, userIdPattern } from '@/static/regex'

export default Vue.extend({
  name: 'LoginPage',
  components: { MainLayoutVue, PasswordForm },
  setup() {
    const router = useRouter()
    const userId: Ref<string> = ref('')
    const password: Ref<string> = ref('')
    const submitted: Ref<boolean> = ref(false)
    const isCapsLock: Ref<boolean> = ref(false)

    const login = async () => {
      try {
        if (!checkValidations()) return
        const loginData = {
          userId: userId.value,
          password: password.value,
        }
        const { data } = await LoginAPI.v1.login(loginData)
        if (data && data.success) {
          router.push('/user/main')
        } else {
          Vue.prototype.$subject.$emit('warning', data.message)
        }
      } catch (error) {
        Vue.prototype.$subject.$emit('error', '패스워드를 입력하세요.')
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
          '아이디 형식은 영문/숫자 4~16자리여야 합니다.'
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
          '패스워드 형식은 영문/숫자/특수기호를 포함한 4~16자리여야 합니다.'
        )
        return false
      }

      submitted.value = false
      return true
    }

    const routeToSignup = () => {
      router.push('/signup')
    }

    const checkCapsLock = (evt: KeyboardEvent) => {
      if (evt?.getModifierState)
        isCapsLock.value = evt?.getModifierState('CapsLock')
      else isCapsLock.value = false
    }

    const updatePassword = (data: string) => {
      password.value = data
    }

    return {
      userId,
      password,
      submitted,
      userIdPattern,
      passwordPattern,
      isCapsLock,
      login,
      checkValidations,
      routeToSignup,
      checkCapsLock,
      updatePassword,
      Utils,
    }
  },
})
</script>

<template>
  <MainLayoutVue>
    <section class="d-flex justify-content-center align-items-center mt-4">
      <div class="card col-10 col-xxl-3 col-xl-3 col-md-6 col-lg-5 col-sm-8">
        <div class="card-body">
          <h4 class="card-title">로그인</h4>

          <div class="form-group row mb-2 d-flex justify-content-center">
            <div class="col-12">
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
                @keydown="checkCapsLock"
              />
            </div>
          </div>

          <div class="form-group row mb-2 d-flex justify-content-center">
            <div class="col-12">
              <label
                for="projectname"
                class="col-form-label col-12 d-flex align-items-center p-0 pb-2"
              >
                패스워드
                <div class="display-capslock text-white mb-1">
                  <span v-if="!isCapsLock" class="badge bg-success ms-1"
                    >CapsLock off</span
                  >
                  <span v-if="isCapsLock" class="badge bg-danger ms-1"
                    >CapsLock on</span
                  >
                </div>
              </label>

              <PasswordForm
                class="mb-2"
                :init-data="password"
                :maxlength="'20'"
                :placeholder="'패스워드'"
                :is-invalid="
                  submitted &&
                  (Utils.isEmpty(password) ||
                    !passwordPattern.test(password.value))
                "
                @updatePassword="updatePassword"
                @onEnter="login"
                @onKeydown="checkCapsLock"
              />
            </div>
          </div>

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

<style lang="scss" scoped>
.display-capslock {
  margin-left: 0.5rem;
}
</style>
