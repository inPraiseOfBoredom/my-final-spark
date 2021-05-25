<template>
  <div class="p-4 pt-8  max-w-screen-sm max-h-screen">
    <Navigation />

    <form @submit.prevent="submit" class="max-w-screen-sm mx-auto mt-16">
      <div class="mb-4">
        <div id="pictureHere" class="mb-4">
          <img class="" :src="source" />
        </div>
        <button
          class="text-gray-600 mb-6 border-2 p-2 border-gray-600 hover:bg-yellow-200  hover:bg-opacity-75 appearance-none focus:outline-none "
          @click="addImage"
        >
          Choose your photo of the day
        </button>

        <div>
          <label for="title" class="sr-only">Title</label>

          <input
            class="w-full text-xl font-medium focus:outline-none bg-transparent border-b  border-blue-200 "
            type="text"
            name="title"
            placeholder="Title"
            v-model="title"
            @blur="titleTouched = true"
          />
          <p class="text-sm text-red-400" v-if="titleHint">
            {{ titleHint }}
          </p>
        </div>
        <div>
          <label for="content" class="sr-only">Content</label>
          <textarea
            class="bg-transparent resize-none text-lg focus:outline-none 
          "
            placeholder="Content"
            v-model="content"
          />
        </div>
      </div>

      <select
        v-model="selectedCollection"
        class="bg-yellow-50 focus:outline-none"
      >
        <option value="Job">Job</option>
        <option value="Todo">Todo</option>

        <option value="Personal">Personal</option>
      </select>

      <div class="mt-4">
        <button
          class="font-medium text-red-300 px-8 py-1 border-2 border-red-300  text-base hover:bg-yellow-200  hover:bg-opacity-75 appearance-none focus:outline-none"
          type="submit"
        >
          Create
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
  components: {
    Navigation,
  },

  data() {
    return {
      title: "",
      titleTouched: false,
      content: "",
      submitError: "",
      selectedCollection: "Personal",
      source: "",
    };
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

    async addImage() {
      const res = await axios.get("https://api.unsplash.com/photos/random", {
        headers: {
          Authorization:
            "Client-ID zqwYLE9TnTNR-G8tzu7dwxXBnPVvCjqrOHjCOxQBv0Q",
        },
      });
      this.source = `${res.data.urls.small}`;
    },

    async submit() {
      this.clearErrors();
      if (!this.validate()) return;
      try {
        console.log(this.source);

        const response = await axios.post(
          `${process.env.VUE_APP_API_URL}/notes`,
          {
            title: this.title,
            content: this.content,
            collection: this.selectedCollection,
            source: this.source,
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
