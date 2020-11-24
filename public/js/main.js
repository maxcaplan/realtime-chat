// Init socket.io event listeners
var socket = io();
// Create vue instance
new Vue({
  el: "#app",

  data() {
    return {
      connected: 0,
      names: [],
      inputName: null,
      name: null,
      id: null,
      sidebar: false,
    };
  },

  computed: {
    online() {
      return this.names.length;
    },
    joining() {
      return this.connected - this.names.length;
    },
    nameSubmitted() {
      return this.name != null && this.id != null;
    },
  },

  methods: {
    calcHeight() {
      // Calculate mobile height for styling
      console.log("Calc height");
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    },
    submitName() {
      if (!this.id) {
        console.log("Submit name");
        socket.emit("set-name", this.inputName || "Anonymous");
      }
    },
  },

  created() {
    // Calculate mobile height for styling
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    window.onresize = () => {
      console.log("Calc height");
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    socket.on("connected-update", (val) => {
      this.connected = val;
    });

    socket.on("names-update", (val) => {
      console.log(val);
      this.names = val;
    });

    socket.on("name-registered", (val) => {
      this.name = val.name;
      this.id = val.id;
    });
  },
});
