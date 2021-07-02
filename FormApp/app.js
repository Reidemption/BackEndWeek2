var url = "http://forum2021.codeschool.cloud";

var app = new Vue({
  el: "#app",
  data: {
    page: "forum",

    //for filtering
    selected_category: "all",

    categories: [
      "all",
      "MechanicalKeyboards",
      "LeagueOfLegends",
      "BodyBuilding",
      "Funny",
      "Cartoons",
      "ComputerScience",
      "Me_Irl",
    ],
    post_index: 0,
    postings: [],
    // for a new thread
    new_name: "",
    new_author: "",
    new_description: "",
    new_category: "all",
    new_post_author: "",
    new_post_body: "",

    Threads: [],
  },
  created: function () {
    this.getThreadServer();
  },

  methods: {
    getThreadServer: function () {
      fetch(`${url}/thread`).then(function (response) {
        response.json().then(function (data) {
          console.log(data);
          app.Threads = data;
        });
      });
    },

    deleteThreadServer: function (thread) {
      fetch(`${url}/thread/` + thread, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function () {
        app.getThreadServer();
      });
    },

    newThreadServer: function () {
      var newThreadVar = {
        name: this.new_name,
        author: this.new_author,
        description: this.new_description,
        category: this.new_category,
      };
      fetch(`${url}/thread`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newThreadVar),
      }).then(function (response) {
        console.log(newThreadVar);
        if (response.status == 400) {
          response.json().then(function (data) {
            alert(data.message);
          });
        } else if (response.status == 201) {
          app.new_author = "";
          app.category = "all";
          app.new_description = "";
          app.new_name = "";
          app.getThreadServer();
        }
      });
    },
    // Post METHODS
    getPosts: function (thread_id) {
      fetch(`${url}/thread/` + thread_id)
        .then(function (response) {
          response.json().then(function (data) {
            console.log.data;
            app.postings = data;
          });
        })
        .then(function () {
          app.page = "posts";
        });
    },
    createPost: function (thread_id) {
      var newPostVar = {
        thread_id: thread_id,
        author: this.new_post_author,
        body: this.new_post_body,
      };

      fetch(`${url}/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPostVar),
      })
        .then(function (response) {
          console.log(newPostVar);
          if (response.status == 400) {
            response.json().then(function (data) {
              alert(data.message);
            });
          } else if (response.status == 201) {
          }
        })
        .then(function () {
          app.getPosts(thread_id);
          app.new_post_author = "";
          app.new_post_body = "";
        });
    },
    deletePost: function (post) {
      fetch(`${url}/post/${post.thread_id}/${post._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function () {
        app.getPosts(post.thread_id);
      });
    },
  },
  computed: {
    sorted_threads: function () {
      if (this.selected_category == "all") {
        return this.Threads;
      } else {
        var sorted_threads = this.Threads.filter(function (thread) {
          return thread.category == app.selected_category;
        });
        return sorted_threads;
      }
    },
  },
});
