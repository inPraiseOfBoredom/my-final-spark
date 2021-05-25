<template>
  <div class="p-4 pt-6">
    <form @submit.prevent="submit" class="max-w-screen-sm mx-auto">
      <Navigation class="mb-8" />
      <div class="mt-16">
        <label for="title" class="sr-only ">Title</label>
        <input
          class="w-full text-xl font-medium focus:outline-none bg-transparent text-blue-900"
          type="text"
          name="title"
          placeholder="Take a note"
          v-model="title"
          @blur="titleTouched = true"
        />
        <p class="text-sm text-blue-900" v-if="titleHint">
          {{ titleHint }}
        </p>
      </div>
      <div>
        <label for="content" class="sr-only">Content</label>
        <textarea
          class="bg-transparent resize-none text-lg focus:outline-none text-blue-800"
          placeholder="Content"
          rows="10"
          v-model="content"
        />
      </div>
      <div class="mt-4">
        <button
          class="font-mediumfont-medium text-blue-500 px-6 py-2 border-2 border-blue-400  text-base hover:bg-yellow-200  hover:bg-opacity-75  appearance-none focus:outline-none"
          type="submit"
        >
          Update
        </button>
      </div>
      <p v-if="submitError" class="mt-1 text-xs text-red-600">
        {{ submitError }}
      </p>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import Navigation from "@/components/Navigation.vue";

export default {
  name: "EditNote",
  components: {
    Navigation,
  },
  data() {
    return {
      title: "",
      titleTouched: false,
      content: "",
      submitError: "",
    };
  },
  async mounted() {
    const id = this.$route.params.id;
    const response = await axios.get(
      `${process.env.VUE_APP_API_URL}/notes/` + id,
      {
        headers: {
          authorization: this.$store.state.token,
        },
      }
    );
    this.title = response.data.title;
    this.content = response.data.content;
  },
  computed: {
    titleHint() {
      if (this.titleTouched == false) return "";
      if (!this.title) return "Please insert a title";
      return "";
    },
  },
  methods: {
    validate() {
      this.titleTouched = true;
      if (this.titleHint) return false;
      return true;
    },
    clearErrors() {
      this.submitError = "";
    },
    async submit() {
      this.clearErrors();

      if (!this.validate()) return;
      try {
        const now = new Date();

        const response = await axios.patch(
          `${process.env.VUE_APP_API_URL}/notes/` + this.$route.params.id,
          {
            title: this.title,
            content: this.content,
            collection: "Personal",
            updatedAt: now,
          },
          {
            headers: {
              authorization: this.$store.state.token,
            },
          }
        );

        const id = response.data.id;

        this.$router.push("/notes/" + id);
      } catch (error) {
        console.error(error);
        this.submitError =
          "Sorry, something went wrong. Please try again later.";
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
