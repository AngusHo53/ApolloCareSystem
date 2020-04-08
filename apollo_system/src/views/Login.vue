<template>
  <div class="login-form">
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group
        id="input-group-1"
        label="電子信箱:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          required
          placeholder="Enter email"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="密碼:" label-for="input-2">
        <b-form-input id="input-2" v-model="form.password" required placeholder="Enter password">
        </b-form-input>
      </b-form-group>
 <b-form-group label="職務" >
      <b-form-radio v-model="job" name="some-radios" value="doctor" state="fasle" required>
          <font-awesome-icon icon="user-md" />醫生</b-form-radio>
      <b-form-radio v-model="job" name="some-radios" value="nurce">
          <font-awesome-icon icon="user-nurse" />看護</b-form-radio>
    </b-form-group>
      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
        job: '',
      },
      show: true,
    };
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      alert(JSON.stringify(this.form));
    },
    onReset(evt) {
      evt.preventDefault();
      this.form.email = '';
      this.form.name = '';
      this.form.job = '';
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>

<style scoped>
div {
margin: 0 auto;
float: none;
width:40%;
}

</style>
