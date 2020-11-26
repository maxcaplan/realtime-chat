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
      chatInput: "",
      messages: [],
      keepScroll: true,
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
    // Returns styling for user in online list
    isUser(id) {
      if (this.id == id) {
        return "bg-success";
      } else {
        return "bg-secondary";
      }
    },
    submitName() {
      if (!this.id) {
        console.log("Submit name");
        socket.emit("set-name", this.inputName || "Anonymous");
      }
    },
    sendMessage() {
      console.log("send message");
      if ((this.name, this.id, this.chatInput)) {
        this.messages.push({
          id: this.id,
          name: this.name,
          message: this.chatInput,
          sent: false,
        });

        socket.emit("send-message", {
          name: this.name,
          id: this.id,
          message: this.chatInput,
        });

        this.chatInput = "";
      }
    },
    // checkScroll(toBottom) {
    //   const el = document.getElementById("messages");
    //   const scrollPerc =
    //     (100 * el.scrollTop) / (el.scrollHeight - el.clientHeight) || 100;
    //   console.log(scrollPerc);

    //   el.scrollTo(0, el.scrollHeight);
    // },
  },

  mounted() {
    // Calculate mobile height for styling
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    window.onresize = () => {
      console.log("Calc height");
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    const resizeObservers = new ResizeObserver((entries) => {
      if (this.keepScroll) {
        const el = document.getElementById("messages");
        el.scrollTo(0, el.scrollHeight);
      }
    });

    resizeObservers.observe(document.getElementById("messages-content"));

    document.getElementById("messages").addEventListener("scroll", () => {
      const el = document.getElementById("messages");
      const scrollPerc =
        (100 * el.scrollTop) / (el.scrollHeight - el.clientHeight) || 100;
      this.keepScroll = scrollPerc == 100;
    });

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

    socket.on("messages-update", (val) => {
      console.log("Messages received");
      this.messages = val.map((message) => {
        return {
          id: message.id,
          name: message.name,
          message: message.message,
          sent: true,
          timestamp: message.timestamp,
        };
      });
    });
  },
});
