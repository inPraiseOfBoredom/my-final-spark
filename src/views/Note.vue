<template>
  <div class="py-6 px-4 max-w-screen-sm mx-auto">
    <Navigation />
    <!-- Background-->

    <div
      @click="showConfirmation = false"
      class="w-screen h-screen grid place-items-center fixed bg-black bg-opacity-20 inset-0"
      v-if="showConfirmation"
    >
      <div @click.stop="" class="p-8 z-10 rounded shadow-xl bg-gray-50">
        <h2 class="text-lg font-medium mb-4">
          Are you sure?
        </h2>
        <div class="flex space-x-2 ">
          <button
            class="px-4 py-1 border-2 rounded-md border-green-300 text-green-300 font-medium uppercase text-sm hover:bg-green-100 
      hover:scale-105 transform transition-transform duration-200"
            @click="deleteIt"
          >
            Yes
          </button>

          <button
            class="px-5 py-1 border-2 rounded-md border-red-300 text-red-300 font-medium uppercase text-sm hover:bg-red-100 
      hover:scale-105 transform transition-transform duration-200"
            @click="showConfirmation = false"
          >
            No
          </button>
        </div>
      </div>
    </div>
    <header class="mb-4 mt-20">
      <h2 class="text-lg  ">{{ note.collection }}</h2>

      <img class="" :src="note.source" @click="changeIt()" />

      <h1
        class="text-4xl  font-semibold text-blue-900 pb-1 border-b  border-blue-200 "
      >
        {{ note.title }}
      </h1>
    </header>
    <p class="leading-relaxed text-blue-800 text-lg">{{ note.content }}</p>
    <div class="text-sm text-right text-gray-400 mt-4">
      {{ new Date(note.createdAt).toLocaleDateString() }}
    </div>

    <router-link
      class="font-medium text-blue-400 px-6 py-2 border-2 border-blue-400  text-base hover:bg-yellow-200  hover:bg-opacity-75  appearance-none focus:outline-none"
      :to="{
        name: 'EditNote',
        params: {
          id: $route.params.id,
        },
      }"
    >
      Edit
    </router-link>

    <button
      @click="showConfirmation = true"
      class="font-medium text-red-300 px-4 py-1 border-2 border-red-300 text-base hover:bg-yellow-200 hover:bg-opacity-75  appearance-none focus:outline-none ml-4"
    >
      Delete
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import Navigation from "@/components/Navigation.vue";

export default Vue.extend({
  components: {
    Navigation,
  },
  data() {
    return {
      note: {},
      showConfirmation: false,
      source: "",
    };
  },
  methods: {
    async deleteIt() {
      const id = this.$route.params.id;
      const response = await axios.delete(
        `${process.env.VUE_APP_API_URL}/notes` + id,
        {
          headers: {
            authorization: this.$store.state.token,
          },
        }
      );
      console.log(response);
      this.$router.push({ name: "Dashboard" });
    },

    async getNewImage() {
      const res = await axios.get("https://api.unsplash.com/photos/random", {
        headers: {
          Authorization:
            "Client-ID zqwYLE9TnTNR-G8tzu7dwxXBnPVvCjqrOHjCOxQBv0Q",
        },
      });
      this.source = `${res.data.urls.small}`;
    },
    async updateNewImage() {
      console.log(this.source);
      // eslint-disable-next-line no-unused-vars
      const response = await axios.patch(
        "http://localhost:3000/notes/" + this.$route.params.id,
        {
          source: this.source,
        },
        {
          headers: {
            authorization: this.$store.state.token,
          },
        }
      );
      this.note = response.data;
    },

    async changeIt() {
      await this.getNewImage();
      this.updateNewImage();
    },
  },
  async mounted() {
    const response = await axios.get(
      `${process.env.VUE_APP_API_URL}/notes/` + this.$route.params.id,
      {
        headers: {
          authorization: this.$store.state.token,
        },
      }
    );
    this.note = response.data;
  },
});
</script>

<style scoped></style>
