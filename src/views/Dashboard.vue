<template>
  <div class="p-4 pt-12 max-w-screen-sm mx-auto ">
    <Navigation :showDashboardButton="false" />

    <div class="mt-14">
      <input
        type="text"
        name="search"
        v-model="keyword"
        placeholder="Search keyword.."
        class="p-2 bg-yellow-50"
      />
    </div>

    <router-link
      class="block border-b  border-blue-200 py-4 "
      :to="{ name: 'Note', params: { id: note.id } }"
      v-for="note in filteredNotes"
      :key="note.id"
    >
      <div class="hover:bg-yellow-400 hover:scale-x-150 hover:bg-opacity-20  ">
        <header>
          <h3 class="text-xs text-blue-800">
            {{ note.collection }}
          </h3>
          <h2 class="text-lg font-semibold text-blue-900 ">{{ note.title }}</h2>
        </header>
        <p class="text-blue-900">{{ note.content }}</p>
        <p class="text-sm text-gray-300 mt-2 text-right">
          {{ new Date(note.createdAt).toLocaleDateString() }}
        </p>
        <button
          @click.prevent="deleteIt(note.id)"
          class="font-medium text-red-300  text-base hover:underline appearance-none focus:outline-none"
        >
          Delete
        </button>
      </div></router-link
    >
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import Navigation from "@/components/Navigation.vue";

export default Vue.extend({
  name: "Dashboard",
  components: {
    Navigation,
  },
  data() {
    return {
      notes: [],
      keyword: "",
    };
  },
  computed: {
    filteredNotes() {
      return this.notes.filter((note) => {
        return (
          note.content.toLowerCase().includes(this.keyword.toLowerCase()) ||
          note.title.toLowerCase().includes(this.keyword.toLowerCase())
        );
      });
    },
  },

  mounted() {
    this.getNotes();
  },

  methods: {
    async deleteIt(id) {
      const response = await axios.delete(
        `${process.env.VUE_APP_API_URL}/notes${id}`,
        {
          headers: {
            authorization: this.$store.state.token,
          },
        }
      );
      console.log(response);
      this.getNotes();
    },

    async getNotes() {
      console.log("oehfwqekjnf");
      const response = await axios.get(`${process.env.VUE_APP_API_URL}/notes`, {
        headers: {
          authorization: this.$store.state.token,
        },
      });
      console.log(response);
      this.notes = response.data;
    },
  },
});
</script>
